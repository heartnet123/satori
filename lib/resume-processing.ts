import { z } from "zod";

import { resumeParsingSchema } from "@/lib/validators/resume-parsing";

export const resumeUploadResponseSchema = z.object({
  resumeId: z.string(),
  candidateId: z.string(),
  status: z.literal("UPLOADED"),
  message: z.string(),
});

export const resumeStatusSchema = z.object({
  resumeId: z.string(),
  status: z.enum([
    "UPLOADED",
    "EXTRACTING_TEXT",
    "CLEANING_TEXT",
    "PARSING_AI",
    "VALIDATING_SCHEMA",
    "NORMALIZING",
    "EMBEDDING",
    "MATCHING",
    "READY",
    "FAILED_EXTRACTION",
    "FAILED_AI_PARSE",
    "FAILED_VALIDATION",
    "FAILED_EMBEDDING",
    "FAILED_MATCHING",
  ]),
  progress: z.number().min(0).max(100),
  currentStep: z.string(),
  error: z
    .object({
      errorCode: z.string(),
      message: z.string(),
      canRetry: z.boolean(),
    })
    .nullable(),
});

export const parsedResumeSchema = resumeParsingSchema;

export type ResumeStatus = z.infer<typeof resumeStatusSchema>["status"];
export type ParsedResume = z.infer<typeof parsedResumeSchema>;

export const pipelineSteps = [
  { status: "EXTRACTING_TEXT" as const, progress: 15, currentStep: "Extracting text" },
  { status: "CLEANING_TEXT" as const, progress: 30, currentStep: "Cleaning extracted text" },
  { status: "PARSING_AI" as const, progress: 50, currentStep: "Parsing resume with AI" },
  { status: "VALIDATING_SCHEMA" as const, progress: 65, currentStep: "Validating structured JSON" },
  { status: "NORMALIZING" as const, progress: 78, currentStep: "Normalizing skills and profile" },
  { status: "EMBEDDING" as const, progress: 88, currentStep: "Creating embedding vector" },
  { status: "MATCHING" as const, progress: 96, currentStep: "Running job matching" },
] as const;
