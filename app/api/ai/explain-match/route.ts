import { NextResponse } from "next/server";
import {
  explainMatchRequestSchema,
  getJobById as getJob,
  getMatch,
  getParsedResume,
  scoreResumeForJob,
} from "@/lib/recruitment";

export async function POST(request: Request) {
  const input = explainMatchRequestSchema.safeParse(await request.json().catch(() => null));

  if (!input.success) {
    return NextResponse.json({ error: "INVALID_EXPLAIN_INPUT", issues: input.error.issues }, { status: 400 });
  }

  if (input.data.matchId) {
    const match = await getMatch(input.data.matchId);
    if (!match) {
      return NextResponse.json({ error: "MATCH_NOT_FOUND" }, { status: 404 });
    }

    return NextResponse.json({
      matchId: match.id,
      explanation: match.explanation,
      strengths: match.strengths,
      risks: match.risks,
    });
  }

  const resume = await getParsedResume(input.data.resumeId ?? "");
  if (!resume) {
    return NextResponse.json({ error: "RESUME_NOT_FOUND" }, { status: 404 });
  }

  const job = await getJob(input.data.jobId ?? "");
  if (!job) {
    return NextResponse.json({ error: "JOB_NOT_FOUND" }, { status: 404 });
  }

  const preview = scoreResumeForJob(resume as any, job, {
    resumeId: (resume as any).id,
    matchId: `match_preview_${job.id}_${(resume as any).id}`,
  });

  return NextResponse.json({
    matchId: preview.id,
    explanation: preview.explanation,
    strengths: preview.strengths,
    risks: preview.risks,
  });
}
