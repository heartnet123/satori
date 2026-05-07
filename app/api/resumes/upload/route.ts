import { NextResponse } from "next/server";
import {
  pipelineSteps,
  resumeStatusSchema,
  resumeUploadResponseSchema,
  type ParsedResume,
  type ResumeStatus,
} from "@/lib/resume-processing";
import {
  createCleanResumeMarkdown,
  createDemoParsedResume,
  saveParsedResume,
} from "@/lib/recruitment";

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ACCEPTED_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
]);

type ResumeRecord = {
  resumeId: string;
  candidateId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  status: ResumeStatus;
  progress: number;
  currentStep: string;
  error: null | { errorCode: string; message: string; canRetry: boolean };
  parsedJson: ParsedResume | null;
  cleanMarkdown: string | null;
  createdAt: string;
  updatedAt: string;
};

const resumes = new Map<string, ResumeRecord>();

function makeId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function makeResumeRecord(input: {
  resumeId: string;
  candidateId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}): ResumeRecord {
  return {
    resumeId: input.resumeId,
    candidateId: input.candidateId,
    fileName: input.fileName,
    fileType: input.fileType,
    fileSize: input.fileSize,
    status: "UPLOADED",
    progress: 0,
    currentStep: "Resume uploaded",
    error: null,
    parsedJson: null,
    cleanMarkdown: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

import { ResumeParserService } from "@/lib/services/resume-parser.service";

async function runResumePipeline(resumeId: string, fileName: string, fileBuffer: ArrayBuffer) {
  const update = (next: Partial<ResumeRecord>) => {
    const current = resumes.get(resumeId);
    if (!current) return;
    resumes.set(resumeId, {
      ...current,
      ...next,
      updatedAt: new Date().toISOString(),
    });
  };

  try {
    update({ status: "PARSING_AI", progress: 20, currentStep: "Parsing resume" });
    
    const parser = new ResumeParserService();
    const storedResume = await parser.process({ fileName, fileBuffer });

    update({
      status: "READY",
      progress: 100,
      currentStep: "Resume processing completed",
      parsedJson: {
        source: {
          fileName: storedResume.sourceFileName,
          fileType: "pdf",
          language: "en",
          parsedAt: storedResume.createdAt,
        },
        candidate: {
          fullName: storedResume.fullName,
          email: storedResume.email || "",
          phone: storedResume.phone || "",
          location: storedResume.location ?? null,
          links: { github: null, portfolio: null, linkedin: null, website: null },
        },
        headline: storedResume.title,
        professionalSummary: storedResume.summary,
        education: [],
        languages: [],
        skills: { raw: storedResume.skills, normalized: [], primary: storedResume.skills },
        workExperiences: [],
        projects: [],
        certifications: [],
        inferredProfile: {
          totalYearsExperience: 0,
          commercialYearsExperience: 0,
          projectBasedExperience: false,
          seniority: "unspecified",
          roleFamilies: [],
          strongestSkills: [],
          domainExperience: [],
          interests: [],
          confidence: 1,
          warnings: [],
        },
        matchingProfile: {
          searchText: storedResume.summary,
          embeddingText: storedResume.summary,
          hardSkills: storedResume.skills,
          softSkills: [],
          tools: [],
          domains: [],
          preferredRoles: [],
          redFlags: [],
        },
        analysis: {
          confidence: 1,
          quality: "high",
          missingFields: [],
          warnings: [],
        },
      },
    });
  } catch (error) {
    console.error("Pipeline error:", error);
    update({
      status: "FAILED_AI_PARSE",
      progress: 100,
      currentStep: "Resume processing failed",
      error: {
        errorCode: "AI_SCHEMA_VALIDATION_FAILED",
        message: error instanceof Error ? error.message : "Resume processing failed.",
        canRetry: true,
      },
    });
  }
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }

  if (!ACCEPTED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "UNSUPPORTED_FILE_TYPE" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "FILE_TOO_LARGE" }, { status: 400 });
  }

  const fileBuffer = await file.arrayBuffer();
  const resumeId = makeId("res");
  const candidateId = makeId("cand");

  const record = makeResumeRecord({
    resumeId,
    candidateId,
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
  });

  resumes.set(resumeId, record);
  
  // Fire and forget, or handle differently if needed
  void runResumePipeline(resumeId, file.name, fileBuffer);

  const response = resumeUploadResponseSchema.parse({
    resumeId,
    candidateId,
    status: "UPLOADED",
    message: "Resume uploaded successfully. Processing has started.",
  });

  return NextResponse.json(response);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const resumeId = url.searchParams.get("resumeId");

  if (!resumeId) {
    return NextResponse.json({ error: "resumeId is required" }, { status: 400 });
  }

  const record = resumes.get(resumeId);
  if (!record) {
    return NextResponse.json({ error: "RESUME_NOT_FOUND" }, { status: 404 });
  }

  const status = resumeStatusSchema.parse({
    resumeId: record.resumeId,
    status: record.status,
    progress: record.progress,
    currentStep: record.currentStep,
    error: record.error,
  });

  return NextResponse.json({
    ...status,
    parsedJson: record.parsedJson,
    cleanMarkdown: record.cleanMarkdown,
  });
}
