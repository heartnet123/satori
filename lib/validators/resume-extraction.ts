import { z } from "zod";

export const resumeExtractionSchema = z.object({
  fullName: z.string().min(1),
  title: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  skills: z.array(z.string()).default([]),
  experienceYears: z.number().nonnegative().optional(),
  summary: z.string().min(1),
});

export type ResumeExtractionInput = z.infer<typeof resumeExtractionSchema>;
