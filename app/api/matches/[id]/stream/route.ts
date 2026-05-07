import { NextRequest, NextResponse } from "next/server";
import { matchCandidateToJobStream } from "@/lib/recruitment/gpt4o-matcher";
import { getMatch, getJob, getResume } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const match = await getMatch(id);
  
  if (!match) return new NextResponse("Match not found", { status: 404 });

  const [job, resume] = await Promise.all([getJob(match.jobId), getResume(match.resumeId)]);
  
  if (!job || !resume) return new NextResponse("Match resources not found", { status: 404 });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const matchStream = matchCandidateToJobStream(job, resume);
      for await (const chunk of matchStream) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`));
      }
      controller.close();
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
