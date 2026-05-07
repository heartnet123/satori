import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { type ParsedResume } from "@/lib/resume-processing";
import { resumeParsingSchema } from "../validators/resume-parsing";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function normalizeResumeData(rawText: string): Promise<ParsedResume> {
  const { object } = await generateObject({
    model: openai('gpt-4o'),
    schema: resumeParsingSchema,
    system: `You are an expert recruitment AI. Extract candidate information from the provided resume text into a highly structured JSON format.
        
        Follow these rules:
        1. Extract candidate contact info, headline, and a professional summary.
        2. Detail education history, languages, and skills (raw, primary, and normalized).
        3. Extract work experiences and project details (technologies, roles, achievements).
        4. Provide an 'inferredProfile' including years of experience, seniority, role families, and domain experience.
        5. Populate 'matchingProfile' with 'searchText' and 'embeddingText' (a concise summary for vector search).
        6. Identify any 'redFlags' like missing work experience or job gaps.
        7. Evaluate data 'analysis' quality and confidence.`,
    prompt: rawText,
  });

  // Ensure we have a valid source object
  const data = {
    ...object,
    source: {
      ...object.source,
      parsedAt: new Date().toISOString(),
    },
  };

  return resumeParsingSchema.parse(data);
}
