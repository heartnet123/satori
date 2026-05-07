export type ResumeExtraction = {
  fullName: string;
  title: string;
  email?: string;
  phone?: string;
  location?: string;
  skills: string[];
  experienceYears?: number;
  summary: string;
};

export type CandidateProfile = ResumeExtraction & {
  id: string;
  sourceFileName: string;
  updatedAt: string;
};

export type ResumeParsingSchema = {
  source: {
    fileName: string;
    fileType: string;
    language: string;
    parsedAt: string;
  };
  candidate: {
    fullName: string;
    email: string;
    phone: string;
    location: string | null;
    links: {
      github: string | null;
      portfolio: string | null;
      linkedin: string | null;
      website: string | null;
    };
  };
  headline: string;
  professionalSummary: string;
  education: Array<{
    institution: string;
    degree: string | null;
    fieldOfStudy: string;
    startYear: number | null;
    endYear: number | null;
    status: "current" | "completed" | "incomplete";
    description: string | null;
    evidence: string[];
  }>;
  languages: Array<{
    language: string;
    proficiency: string;
    test?: {
      name: string;
      score: number;
    };
    evidence: string[];
  }>;
  skills: {
    raw: string[];
    normalized: Array<{
      name: string;
      category: string;
      aliases?: string[];
      confidence: number;
      evidence: string[];
    }>;
    primary: string[];
  };
  workExperiences: unknown[];
  projects: Array<{
    name: string;
    type: string;
    description: string;
    role: string;
    technologies: string[];
    responsibilities: string[];
    achievements: string[];
    evidence: string[];
  }>;
  certifications: unknown[];
  inferredProfile: {
    totalYearsExperience: number;
    commercialYearsExperience: number;
    projectBasedExperience: boolean;
    seniority: string;
    roleFamilies: string[];
    strongestSkills: string[];
    domainExperience: string[];
    interests: string[];
    confidence: number;
    warnings: string[];
  };
  matchingProfile: {
    searchText: string;
    embeddingText: string;
    hardSkills: string[];
    softSkills: string[];
    tools: string[];
    domains: string[];
    preferredRoles: string[];
    redFlags: Array<{
      type: string;
      message: string;
      severity: "low" | "medium" | "high";
      evidence: string[];
    }>;
  };
  analysis: {
    confidence: number;
    quality: string;
    missingFields: string[];
    warnings: string[];
  };
};
