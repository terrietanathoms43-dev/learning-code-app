import { NextResponse } from "next/server";
import { checkAnswer } from "@/lib/answer-key";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (
    !payload ||
    typeof payload !== "object" ||
    !("exerciseId" in payload) ||
    !("answer" in payload) ||
    typeof payload.exerciseId !== "string" ||
    typeof payload.answer !== "string"
  ) {
    return NextResponse.json({ error: "Exercise and answer are required." }, { status: 400 });
  }

  if (payload.answer.length > 500 || payload.exerciseId.length > 100) {
    return NextResponse.json({ error: "Answer is too long." }, { status: 400 });
  }

  const result = checkAnswer(payload.exerciseId, payload.answer);

  if (!result) {
    return NextResponse.json({ error: "Exercise not found." }, { status: 404 });
  }

  return NextResponse.json(result);
}
