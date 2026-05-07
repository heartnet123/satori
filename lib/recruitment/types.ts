import { z } from "zod";

export const senioritySchema = z.enum([
  "intern",
  "junior",
  "mid",
  "senior",
  "lead",
  "unspecified",
]);

export const jobInputSchema = z.object({
  title: z.string().trim().min(2, "Job title is required."),
  company: z.string().trim().min(1).optional(),
  location: z.string().trim().min(1).optional(),
  description: z.string().trim().min(30, "Job description must include enough detail to analyze."),
  requirements: z.array(z.string().min(1)).optional(),
});

export const jobUpdateSchema = jobInputSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "At least one job field is required."
);

export const analyzedJobSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  company: z.string().nullable(),
  location: z.string().nullable(),
  description: z.string().min(1),
  extractedSkills: z.array(z.string().min(1)),
  seniority: senioritySchema,
  responsibilities: z.array(z.string().min(1)),
  requirements: z.array(z.string().min(1)),
  domains: z.array(z.string().min(1)),
  confidence: z.number().min(0).max(1),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
});

export const recommendationLabelSchema = z.enum([
  "strong_fit",
  "good_fit",
  "stretch",
  "not_recommended",
]);

export const recruitmentMatchSchema = z.object({
  id: z.string().min(1),
  resumeId: z.string().min(1),
  candidateName: z.string().min(1),
  jobId: z.string().min(1),
  score: z.number().min(0).max(100),
  matchedSkills: z.array(z.string().min(1)),
  missingSkills: z.array(z.string().min(1)),
  strengths: z.array(z.string().min(1)),
  risks: z.array(z.string().min(1)),
  explanation: z.string().min(1),
  recommendationLabel: recommendationLabelSchema,
  createdAt: z.string().datetime({ offset: true }),
});

export const opportunityRecommendationSchema = z.object({
  id: z.string().min(1),
  jobId: z.string().min(1),
  matchId: z.string().min(1),
  title: z.string().min(1),
  score: z.number().min(0).max(100),
  reason: z.string().min(1),
  nextAction: z.string().min(1),
});

export const matchFeedbackSchema = z.object({
  rating: z.enum(["good", "neutral", "poor"]),
  note: z.string().trim().max(500).optional(),
});

export const matchRunRequestSchema = z.object({
  jobId: z.string().min(1),
});

export const explainMatchRequestSchema = z
  .object({
    matchId: z.string().min(1).optional(),
    resumeId: z.string().min(1).optional(),
    jobId: z.string().min(1).optional(),
  })
  .refine(
    (value) => Boolean(value.matchId) || Boolean(value.resumeId && value.jobId),
    "Provide matchId or both resumeId and jobId."
  );

export const resumeExtractionSchema = z.object({
  id: z.string().uuid(),
  fullName: z.string().min(1),
  title: z.string().min(1),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  summary: z.string().min(1),
  skills: z.array(z.string()),
  sourceFileName: z.string().min(1),
  createdAt: z.string().datetime({ offset: true }),
});

export type Seniority = z.infer<typeof senioritySchema>;
export type JobInput = z.infer<typeof jobInputSchema>;
export type JobUpdate = z.infer<typeof jobUpdateSchema>;
export type AnalyzedJob = z.infer<typeof analyzedJobSchema>;
export type RecommendationLabel = z.infer<typeof recommendationLabelSchema>;
export type RecruitmentMatch = z.infer<typeof recruitmentMatchSchema>;
export type OpportunityRecommendation = z.infer<typeof opportunityRecommendationSchema>;
export type MatchFeedback = z.infer<typeof matchFeedbackSchema>;
export type MatchRunRequest = z.infer<typeof matchRunRequestSchema>;
export type ExplainMatchRequest = z.infer<typeof explainMatchRequestSchema>;
export type ResumeExtraction = z.infer<typeof resumeExtractionSchema>;
