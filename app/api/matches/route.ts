import { NextResponse } from "next/server";
import { listMatches, matchRunRequestSchema, runMatches } from "@/lib/recruitment";

export async function POST(request: Request) {
  const input = matchRunRequestSchema.safeParse(await request.json().catch(() => null));

  if (!input.success) {
    return NextResponse.json({ error: "INVALID_MATCH_INPUT", issues: input.error.issues }, { status: 400 });
  }

  const result = await runMatches(input.data.jobId);
  if (!result) {
    return NextResponse.json({ error: "JOB_NOT_FOUND" }, { status: 404 });
  }

  return NextResponse.json(result);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const jobId = url.searchParams.get("jobId") ?? undefined;

  const items = await listMatches(jobId);
  return NextResponse.json({ items });
}
