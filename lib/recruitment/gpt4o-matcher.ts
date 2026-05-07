import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { recruitmentMatchSchema, type AnalyzedJob, type RecruitmentMatch, type ResumeExtraction } from "./types";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generator for streaming response (note: streamObject is preferred if streaming structured data)
export async function* matchCandidateToJobStream(
  job: AnalyzedJob,
  resume: ResumeExtraction
): AsyncGenerator<string, RecruitmentMatch, unknown> {
    // In a full implementation, this should use streamObject, 
    // but preserving original streaming string interface for now.
    throw new Error("Streaming structured objects requires streamObject. Please update the consuming interface.");
}

export async function matchCandidateToJob(
  job: AnalyzedJob,
  resume: ResumeExtraction
): Promise<RecruitmentMatch> {
  const { object } = await generateObject({
    model: openai('gpt-4o'),
    schema: recruitmentMatchSchema,
    system: 'Analyze the match between the provided job description and candidate profile. Return structured JSON matching the RecruitmentMatch schema.',
    prompt: `Job: ${JSON.stringify(job)}\n\nCandidate: ${JSON.stringify(resume)}`,
  });

  return object;
}
