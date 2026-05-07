import { OpenAI } from 'openai';
import { recruitmentMatchSchema, type AnalyzedJob, type RecruitmentMatch, type ResumeExtraction } from "./types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generator for streaming response
export async function* matchCandidateToJobStream(
  job: AnalyzedJob,
  resume: ResumeExtraction
): AsyncGenerator<string, RecruitmentMatch, unknown> {
  const stream = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { 
        role: 'system', 
        content: 'Analyze the match between the provided job description and candidate profile. Stream the reasoning rationale, and return the final JSON match object.' 
      },
      { 
        role: 'user', 
        content: `Job: ${JSON.stringify(job)}\n\nCandidate: ${JSON.stringify(resume)}` 
      }
    ],
    stream: true,
  });

  let fullResponse = '';
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    if (content) {
        yield content;
        fullResponse += content;
    }
  }

  // Assuming last part is JSON
  const jsonMatch = fullResponse.match(/\{[\s\S]*\}/)?.[0] || '{}';
  return recruitmentMatchSchema.parse(JSON.parse(jsonMatch));
}

export async function matchCandidateToJob(
  job: AnalyzedJob,
  resume: ResumeExtraction
): Promise<RecruitmentMatch> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { 
        role: 'system', 
        content: 'Analyze the match between the provided job description and candidate profile. Return structured JSON matching the RecruitmentMatch schema.' 
      },
      { 
        role: 'user', 
        content: `Job: ${JSON.stringify(job)}\n\nCandidate: ${JSON.stringify(resume)}` 
      }
    ],
    response_format: { type: "json_object" }
  });

  const data = JSON.parse(response.choices[0].message.content || '{}');
  return recruitmentMatchSchema.parse(data);
}
