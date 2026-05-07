import { NextResponse } from "next/server";
import { z } from "zod";
import { createCleanResumeMarkdown, createDemoParsedResume } from "@/lib/recruitment";
import { resumeParsingSchema } from "@/lib/validators/resume-parsing";

const parseResumePreviewRequestSchema = z.object({
  fileName: z.string().trim().min(1).optional(),
  text: z.string().trim().optional(),
});

export async function POST(request: Request) {
  const body = parseResumePreviewRequestSchema.safeParse(await request.json().catch(() => ({})));

  if (!body.success) {
    return NextResponse.json({ error: "INVALID_RESUME_INPUT", issues: body.error.issues }, { status: 400 });
  }

  const parsedJson = resumeParsingSchema.parse(
    createDemoParsedResume(body.data.fileName ?? "PreviewResume.pdf", "text/plain")
  );
  const cleanMarkdown = createCleanResumeMarkdown(parsedJson);

  return NextResponse.json({
    parsedJson,
    cleanMarkdown,
    previewTextLength: body.data.text?.length ?? 0,
    message: "Demo parser preview generated with deterministic mock extraction.",
  });
}
