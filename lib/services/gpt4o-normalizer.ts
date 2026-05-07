import { OpenAI } from 'openai';
import { type ParsedResume } from "@/lib/resume-processing";
import { resumeParsingSchema } from "../validators/resume-parsing";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function normalizeResumeData(rawText: string): Promise<ParsedResume> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { 
        role: 'system', 
        content: `You are an expert recruitment AI. Extract candidate information from the provided resume text into a highly structured JSON format.
        
        Follow these rules:
        1. Extract candidate contact info, headline, and a professional summary.
        2. Detail education history, languages, and skills (raw, primary, and normalized).
        3. Extract work experiences and project details (technologies, roles, achievements).
        4. Provide an 'inferredProfile' including years of experience, seniority, role families, and domain experience.
        5. Populate 'matchingProfile' with 'searchText' and 'embeddingText' (a concise summary for vector search).
        6. Identify any 'redFlags' like missing work experience or job gaps.
        7. Evaluate data 'analysis' quality and confidence.

        Output MUST be valid JSON matching the specified schema.` 
      },
      { role: 'user', content: rawText }
    ],
    response_format: { type: "json_object" }
  });

  const data = JSON.parse(response.choices[0].message.content || '{}');
  
  // Ensure we have a valid source object even if GPT doesn't provide it perfectly
  if (!data.source) {
    data.source = {
      fileName: "unknown",
      fileType: "unknown",
      language: "en",
      parsedAt: new Date().toISOString()
    };
  } else {
    data.source.parsedAt = new Date().toISOString();
  }

  return resumeParsingSchema.parse(data);
}
