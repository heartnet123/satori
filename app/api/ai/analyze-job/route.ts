import { NextResponse } from "next/server";
import { z } from "zod";
import { analyzeJob } from "@/lib/recruitment";

const analyzeJobPreviewSchema = z.object({
  title: z.string().trim().min(2).optional(),
  company: z.string().trim().min(1).optional(),
  location: z.string().trim().min(1).optional(),
  description: z.string().trim().min(30, "Job description must include enough detail to analyze."),
});

export async function POST(request: Request) {
  const input = analyzeJobPreviewSchema.safeParse(await request.json().catch(() => null));

  if (!input.success) {
    return NextResponse.json({ error: "INVALID_JOB_INPUT", issues: input.error.issues }, { status: 400 });
  }

  const analysis = analyzeJob({
    title: input.data.title ?? "Untitled role",
    company: input.data.company,
    location: input.data.location,
    description: input.data.description,
  });

  return NextResponse.json({
    ...analysis,
    message: "Demo job analysis preview generated without persistence.",
  });
}
