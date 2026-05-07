import { NextResponse } from "next/server";
import { matchFeedbackSchema, saveMatchFeedback } from "@/lib/recruitment";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const input = matchFeedbackSchema.safeParse(await request.json().catch(() => null));

  if (!input.success) {
    return NextResponse.json({ error: "INVALID_FEEDBACK_INPUT", issues: input.error.issues }, { status: 400 });
  }

  const feedback = saveMatchFeedback(id, input.data);
  if (!feedback) {
    return NextResponse.json({ error: "MATCH_NOT_FOUND" }, { status: 404 });
  }

  return NextResponse.json({ matchId: id, feedback });
}
