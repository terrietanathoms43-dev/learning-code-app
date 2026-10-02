import { implementedLessonSlugs, pythonPath, type PathNode } from "@/lib/course-data";
import { createClient } from "@/lib/supabase/server";

export type DashboardEvent = {
  amount: number;
  createdAt: string;
  lessonSlug: string | null;
  lessonTitle: string;
};

export type LearningDashboard = {
  signedIn: boolean;
  displayName: string;
  nodes: PathNode[];
  totalXp: number;
  todayXp: number;
  streak: number;
  dailyGoalXp: number;
  completedLessons: number;
  totalLessons: number;
  progressPercent: number;
  completedLessonSlugs: string[];
  recentEvents: DashboardEvent[];
  timeZone: string;
};

const implementedSet = new Set(implementedLessonSlugs);

function buildNodes(completedSlugs: Set<string>, availableSlugs: Set<string>) {
  let currentAssigned = false;

  return pythonPath.map((node) => {
    let status: PathNode["status"] = "locked";

    if (completedSlugs.has(node.slug)) {
      status = "completed";
    } else if (availableSlugs.has(node.slug) && !currentAssigned) {
      status = "current";
      currentAssigned = true;
    }

    return { ...node, status };
  });
}

function guestDashboard(): LearningDashboard {
  const available = new Set<string>([implementedLessonSlugs[0]]);
  return {
    signedIn: false,
    displayName: "Coder",
    nodes: buildNodes(new Set<string>(), available),
    totalXp: 0,
    todayXp: 0,
    streak: 0,
    dailyGoalXp: 50,
    completedLessons: 0,
    totalLessons: implementedLessonSlugs.length,
    progressPercent: 0,
    completedLessonSlugs: [],
    recentEvents: [],
    timeZone: "UTC",
  };
}

function dayKey(input: string | Date, timeZone: string) {
  const date = new Date(input);
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return year && month && day ? `${year}-${month}-${day}` : date.toISOString().slice(0, 10);
}

function shiftDay(key: string, amount: number) {
  const [year, month, day] = key.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}

function calculateStreak(createdAtValues: string[], timeZone: string) {
  const activeDays = new Set(createdAtValues.map((value) => dayKey(value, timeZone)));
  const today = dayKey(new Date(), timeZone);
  const yesterday = shiftDay(today, -1);
  let cursor = activeDays.has(today) ? today : activeDays.has(yesterday) ? yesterday : null;
  let streak = 0;

  while (cursor && activeDays.has(cursor)) {
    streak += 1;
    cursor = shiftDay(cursor, -1);
  }

  return streak;
}

export async function getLearningDashboard(): Promise<LearningDashboard> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    return guestDashboard();
  }

  try {
    const supabase = await createClient();
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
    const userId =
      !claimsError && claimsData?.claims && typeof claimsData.claims.sub === "string"
        ? claimsData.claims.sub
        : null;

    if (!userId) return guestDashboard();

    const [lessonResult, progressResult, xpResult, profileResult] = await Promise.all([
      supabase
        .from("lessons")
        .select("id, slug, sort_order, title")
        .eq("is_published", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("user_lesson_progress")
        .select("lesson_id, status, completed_at")
        .eq("user_id", userId),
      supabase
        .from("xp_events")
        .select("amount, created_at, lesson_id, event_type")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(365),
      supabase
        .from("profiles")
        .select("display_name, daily_goal_xp, time_zone")
        .eq("id", userId)
        .maybeSingle(),
    ]);

    const lessonRows = lessonResult.error ? [] : lessonResult.data ?? [];
    const progressRows = progressResult.error ? [] : progressResult.data ?? [];
    const xpRows = xpResult.error ? [] : xpResult.data ?? [];
    const profile = profileResult.error ? null : profileResult.data;

    const publishedImplemented = lessonRows
      .filter((lesson) => implementedSet.has(lesson.slug))
      .map((lesson) => lesson.slug);
    const availableSlugs = new Set<string>(
      publishedImplemented.length ? publishedImplemented : implementedLessonSlugs,
    );

    const lessonIdToSlug = new Map<string, string>();
    const lessonIdToTitle = new Map<string, string>();
    for (const lesson of lessonRows) {
      lessonIdToSlug.set(lesson.id, lesson.slug);
      lessonIdToTitle.set(lesson.id, lesson.title);
    }

    const completedSlugs = new Set<string>();
    for (const row of progressRows) {
      if (row.status !== "completed") continue;
      const slug = lessonIdToSlug.get(row.lesson_id);
      if (slug && implementedSet.has(slug)) completedSlugs.add(slug);
    }

    const nodes = buildNodes(completedSlugs, availableSlugs);
    const totalLessons = availableSlugs.size;
    const completedLessons = [...completedSlugs].filter((slug) => availableSlugs.has(slug)).length;
    const totalXp = xpRows.reduce((sum, event) => sum + Number(event.amount || 0), 0);
    const dailyGoalXp = Number(profile?.daily_goal_xp || 50);
    const timeZone = profile?.time_zone || "UTC";
    const today = dayKey(new Date(), timeZone);
    const todayXp = xpRows
      .filter((event) => dayKey(event.created_at, timeZone) === today)
      .reduce((sum, event) => sum + Number(event.amount || 0), 0);

    return {
      signedIn: true,
      displayName: profile?.display_name || "Coder",
      nodes,
      totalXp,
      todayXp,
      streak: calculateStreak(xpRows.map((event) => event.created_at), timeZone),
      dailyGoalXp,
      completedLessons,
      totalLessons,
      progressPercent:
        totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
      completedLessonSlugs: [...completedSlugs],
      timeZone,
      recentEvents: xpRows.slice(0, 10).map((event) => ({
        amount: Number(event.amount || 0),
        createdAt: event.created_at,
        lessonSlug: event.lesson_id ? lessonIdToSlug.get(event.lesson_id) ?? null : null,
        lessonTitle: event.lesson_id
          ? lessonIdToTitle.get(event.lesson_id) ?? "Coding activity"
          : "Coding activity",
      })),
    };
  } catch {
    return guestDashboard();
  }
}
