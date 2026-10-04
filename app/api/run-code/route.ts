import { NextResponse } from "next/server";
import { Sandbox } from "@vercel/sandbox";
import { createAdminClient, isAdminSupabaseConfigured } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isSameOriginRequest } from "@/lib/request-security";

export const maxDuration = 20;

const MAX_CODE_LENGTH = 10_000;
const MAX_OUTPUT_LENGTH = 12_000;
const HOURLY_RUN_LIMIT = 30;

type RunnableLanguage = "python" | "javascript";

function isRunnableLanguage(value: unknown): value is RunnableLanguage {
  return value === "python" || value === "javascript";
}

function trimOutput(value: string) {
  if (value.length <= MAX_OUTPUT_LENGTH) return value;

  return (
    value.slice(0, MAX_OUTPUT_LENGTH) +
    "\n\n[Output truncated by CodeTrail.]"
  );
}

async function getUserId() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  return !error && data?.claims && typeof data.claims.sub === "string"
    ? data.claims.sub
    : null;
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Cross-site request blocked." }, { status: 403 });
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ error: "Invalid run request." }, { status: 400 });
  }

  const object = payload as Record<string, unknown>;
  const code = typeof object.code === "string" ? object.code : "";
  const language = object.language;

  if (!isRunnableLanguage(language)) {
    return NextResponse.json(
      { error: "Only Python and JavaScript can run in the sandbox right now." },
      { status: 400 },
    );
  }

  if (!code.trim()) {
    return NextResponse.json({ error: "Write some code before running it." }, { status: 400 });
  }

  if (code.length > MAX_CODE_LENGTH) {
    return NextResponse.json(
      { error: "Runnable code must be 10,000 characters or fewer." },
      { status: 400 },
    );
  }

  if (!isAdminSupabaseConfigured) {
    return NextResponse.json(
      { error: "The code runner is temporarily unavailable." },
      { status: 503 },
    );
  }

  const userId = await getUserId();

  if (!userId) {
    return NextResponse.json(
      { error: "Sign in to run code securely." },
      { status: 401 },
    );
  }

  const admin = createAdminClient();
  const { data: reservationRows, error: reservationError } = await admin.rpc(
    "reserve_code_run",
    {
      p_user_id: userId,
      p_language: language,
      p_limit: HOURLY_RUN_LIMIT,
    },
  );

  if (reservationError) {
    console.error("[code-runner]", {
      stage: "reserve",
      code: reservationError.code,
    });
    return NextResponse.json(
      { error: "The code runner could not reserve a run." },
      { status: 503 },
    );
  }

  const reservation =
    Array.isArray(reservationRows) && reservationRows.length
      ? reservationRows[0]
      : null;

  if (!reservation) {
    return NextResponse.json(
      { error: "Hourly code-run limit reached. Try again later." },
      { status: 429 },
    );
  }

  const eventId = Number(reservation.event_id);
  const startedAt = Date.now();
  let sandbox: Sandbox | null = null;
  let sandboxCreated = false;

  try {
    sandbox = await Sandbox.create({
      persistent: false,
      timeout: 8_000,
      resources: { vcpus: 1 },
      networkPolicy: "deny-all",
      tags: { feature: "codetrail-runner" },
    });
    sandboxCreated = true;

    const command =
      language === "python"
        ? { cmd: "python3", args: ["-c", code] }
        : { cmd: "node", args: ["-e", code] };

    const result = await sandbox.runCommand({
      ...command,
      timeout: 3_000,
    });

    const [stdout, stderr] = await Promise.all([
      result.stdout(),
      result.stderr(),
    ]);
    const runtimeMs = Math.max(0, Date.now() - startedAt);

    await admin
      .from("code_run_events")
      .update({
        exit_code: result.exitCode,
        runtime_ms: runtimeMs,
      })
      .eq("id", eventId)
      .eq("user_id", userId);

    return NextResponse.json({
      stdout: trimOutput(stdout),
      stderr: trimOutput(stderr),
      exitCode: result.exitCode,
      runtimeMs,
      remaining: Math.max(0, Number(reservation.remaining ?? 0)),
    });
  } catch (error) {
    const runtimeMs = Math.max(0, Date.now() - startedAt);

    if (!sandboxCreated) {
      await admin
        .from("code_run_events")
        .delete()
        .eq("id", eventId)
        .eq("user_id", userId);
    } else {
      await admin
        .from("code_run_events")
        .update({ runtime_ms: runtimeMs })
        .eq("id", eventId)
        .eq("user_id", userId);
    }

    console.error("[code-runner]", {
      stage: sandboxCreated ? "execute" : "create",
      message: error instanceof Error ? error.message.slice(0, 180) : "unknown",
    });

    return NextResponse.json(
      {
        error: sandboxCreated
          ? "Your code took too long or the sandbox could not finish the run."
          : "The secure code sandbox is temporarily unavailable.",
      },
      { status: sandboxCreated ? 408 : 503 },
    );
  } finally {
    if (sandbox) {
      try {
        await sandbox.stop();
      } catch {
        // Best-effort cleanup. The short sandbox timeout still stops the session.
      }

      try {
        await sandbox.delete({ deleteOrphanSnapshots: true });
      } catch {
        // Best-effort cleanup for the named sandbox record.
      }
    }
  }
}
