import { z } from "zod";

const educationItemSchema = z.object({
  institution: z.string().min(1),
  degree: z.string().nullable(),
  fieldOfStudy: z.string().min(1),
  startYear: z.number().int().nullable(),
  endYear: z.number().int().nullable(),
  status: z.enum(["current", "completed", "incomplete"]),
  description: z.string().nullable(),
  evidence: z.array(z.string()),
});

const languageItemSchema = z.object({
  language: z.string().min(1),
  proficiency: z.string().min(1),
  test: z
    .object({
      name: z.string().min(1),
      score: z.number(),
    })
    .optional(),
  evidence: z.array(z.string()),
});

const normalizedSkillSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  aliases: z.array(z.string()).optional(),
  confidence: z.number().min(0).max(1),
  evidence: z.array(z.string()),
});

const projectSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  description: z.string().min(1),
  role: z.string().min(1),
  technologies: z.array(z.string()),
  responsibilities: z.array(z.string()),
  achievements: z.array(z.string()),
  evidence: z.array(z.string()),
});

const redFlagSchema = z.object({
  type: z.string().min(1),
  message: z.string().min(1),
  severity: z.enum(["low", "medium", "high"]),
  evidence: z.array(z.string()),
});

export const resumeParsingSchema = z.object({
  source: z.object({
    fileName: z.string().min(1),
    fileType: z.string().min(1),
    language: z.string().min(1),
    parsedAt: z.string().datetime(),
  }),
  candidate: z.object({
    fullName: z.string().min(1),
    email: z.string().min(1),
    phone: z.string().min(1),
    location: z.string().nullable(),
    links: z.object({
      github: z.string().nullable(),
      portfolio: z.string().nullable(),
      linkedin: z.string().nullable(),
      website: z.string().nullable(),
    }),
  }),
  headline: z.string().min(1),
  professionalSummary: z.string().min(1),
  education: z.array(educationItemSchema),
  languages: z.array(languageItemSchema),
  skills: z.object({
    raw: z.array(z.string()),
    normalized: z.array(normalizedSkillSchema),
    primary: z.array(z.string()),
  }),
  workExperiences: z.array(z.unknown()),
  projects: z.array(projectSchema),
  certifications: z.array(z.unknown()),
  inferredProfile: z.object({
    totalYearsExperience: z.number(),
    commercialYearsExperience: z.number(),
    projectBasedExperience: z.boolean(),
    seniority: z.string().min(1),
    roleFamilies: z.array(z.string()),
    strongestSkills: z.array(z.string()),
    domainExperience: z.array(z.string()),
    interests: z.array(z.string()),
    confidence: z.number().min(0).max(1),
    warnings: z.array(z.string()),
  }),
  matchingProfile: z.object({
    searchText: z.string().min(1),
    embeddingText: z.string().min(1),
    hardSkills: z.array(z.string()),
    softSkills: z.array(z.string()),
    tools: z.array(z.string()),
    domains: z.array(z.string()),
    preferredRoles: z.array(z.string()),
    redFlags: z.array(redFlagSchema),
  }),
  analysis: z.object({
    confidence: z.number().min(0).max(1),
    quality: z.string().min(1),
    missingFields: z.array(z.string()),
    warnings: z.array(z.string()),
  }),
});

export type ResumeParsingInput = z.infer<typeof resumeParsingSchema>;
