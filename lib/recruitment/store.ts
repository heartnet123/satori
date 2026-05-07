import { createServerClient } from "@/lib/supabase/server";
import { type ParsedResume } from "@/lib/resume-processing";
import { resumeParsingSchema } from "@/lib/validators/resume-parsing";
import { analyzeJob, recommendOpportunities, scoreResumeForJob } from "./engine";
import { embeddingService } from "@/lib/services/embedding-service";
import { getJob, getJobs, saveJob } from "@/lib/db/jobs";
import { getResume, listResumes, saveResume } from "@/lib/db/resumes";
import { saveMatch, listMatches as dbListMatches, deleteMatchesForJob } from "@/lib/db/matches";
import {
  matchFeedbackSchema,
  type AnalyzedJob,
  type JobInput,
  type JobUpdate,
  type MatchFeedback,
  type OpportunityRecommendation,
  type RecruitmentMatch,
  type ResumeExtraction,
} from "./types";

export type StoredResume = {
  resumeId: string;
  candidateId: string;
  sourceFileName: string;
  createdAt: string;
  updatedAt: string;
};

export type StoredMatchFeedback = MatchFeedback & {
  matchId: string;
  createdAt: string;
};

export async function createJob(input: JobInput): Promise<AnalyzedJob> {
  const id = makeId("job");
  const job = analyzeJob(input, { id });
  
  // Generate embedding for the job description for semantic search
  const embedding = await embeddingService.generateEmbedding(
    `${job.title} ${job.description} ${job.requirements.join(' ')}`
  );
  
  return await saveJob(job, { embedding });
}

export async function listJobs(): Promise<AnalyzedJob[]> {
  return await getJobs();
}

export async function getJobById(jobId: string): Promise<AnalyzedJob | null> {
  return await getJob(jobId);
}

export async function runMatches(jobId: string): Promise<{ items: RecruitmentMatch[]; recommendations: OpportunityRecommendation[] } | null> {
  const job = await getJob(jobId);
  if (!job) return null;

  const supabase = createServerClient();

  // 1. Generate embedding for current job state if needed
  const jobText = `${job.title} ${job.description} ${job.requirements.join(' ')}`;
  const jobEmbedding = await embeddingService.generateEmbedding(jobText);

  // 2. Perform semantic vector search using pgvector RPC
  const { data: vectorMatches, error } = await supabase.rpc('match_resumes', {
    query_embedding: jobEmbedding,
    match_threshold: 0.5, // Broad threshold for semantic relevance
    match_count: 50,      // Top 50 candidates from long-term memory
  });

  if (error) {
    console.error("Vector search error:", error);
    // Fallback to listing all resumes if vector search fails (legacy behavior)
    const allResumes = await listResumes();
    const items = allResumes.map(r => scoreResumeForJob(r, job, { resumeId: r.id }));
    return { items, recommendations: recommendOpportunities(items) };
  }

  // 3. Clear existing matches for this job
  await deleteMatchesForJob(jobId);

  // 4. Detailed scoring for the candidates found via vector search
  const items: RecruitmentMatch[] = await Promise.all(
    vectorMatches.map(async (vm: any) => {
      const parsed = resumeParsingSchema.parse(vm.parsed_resume);
      const extraction: ResumeExtraction = {
        id: vm.id,
        fullName: parsed.candidate.fullName,
        title: parsed.headline,
        email: parsed.candidate.email,
        phone: parsed.candidate.phone,
        location: parsed.candidate.location,
        summary: parsed.professionalSummary,
        skills: parsed.skills.raw,
        sourceFileName: parsed.source.fileName,
        createdAt: parsed.source.parsedAt,
      };
      const match = scoreResumeForJob(extraction, job, {
        resumeId: vm.id,
        matchId: `match_${jobId}_${vm.id}`,
      });
      
      // Optionally combine vector similarity into the final score
      // const hybridScore = Math.round(match.score * 0.8 + vm.similarity * 20);
      // match.score = hybridScore;
      
      await saveMatch(match);
      return match;
    })
  );

  const sortedItems = items.sort((a, b) => b.score - a.score);
  const recs = recommendOpportunities(sortedItems);

  return { items: sortedItems, recommendations: recs };
}

export function createDemoParsedResume(fileName = "MyResume.pdf", fileType = "pdf"): ParsedResume {
  return resumeParsingSchema.parse({
    source: {
      fileName,
      fileType,
      language: "en",
      parsedAt: new Date().toISOString(),
    },
    candidate: {
      fullName: "Jaruvit Jongcheaklang",
      email: "jaruvit.rpg@gmail.com",
      phone: "097-148-2351",
      location: null,
      links: {
        github: "heartnet123",
        portfolio: "Web Portfolio",
        linkedin: null,
        website: null,
      },
    },
    headline: "Fullstack Developer",
    professionalSummary:
      "Fullstack Developer with experience in Next.js and Django, skilled in both frontend and backend development. Built projects including an E-commerce platform, an E-book store, and a kitchen management desktop app, focusing on scalability and user experience. Passionate about Modern Webapp, AI, Game Development, and Cybersecurity.",
    education: [
      {
        institution: "King Mongkut's Institute of Technology Ladkrabang",
        degree: null,
        fieldOfStudy: "Information Technology",
        startYear: 2022,
        endYear: null,
        status: "current",
        description: "4th year student of Information Technology",
        evidence: [
          "King Mongkut's Institute of Technology Ladkrabang",
          "Education 2022 - Now",
          "4th year student of Information Technology",
        ],
      },
    ],
    languages: [
      {
        language: "Thai",
        proficiency: "native",
        evidence: ["Thai (Native)"],
      },
      {
        language: "English",
        proficiency: "intermediate",
        test: {
          name: "TOEIC",
          score: 780,
        },
        evidence: ["English (TOEIC 780)"],
      },
    ],
    skills: {
      raw: ["HTML", "CSS", "JS", "React", "Next.js"],
      normalized: [],
      primary: ["Next.js", "Django", "React"],
    },
    workExperiences: [],
    projects: [],
    certifications: [],
    inferredProfile: {
      totalYearsExperience: 0,
      commercialYearsExperience: 0,
      projectBasedExperience: true,
      seniority: "student",
      roleFamilies: ["fullstack", "frontend", "backend"],
      strongestSkills: ["Next.js", "Django", "React"],
      domainExperience: ["E-commerce", "E-book / Reading Platform", "Ticket Booking"],
      interests: ["Modern Web App", "AI", "Game Development", "Cybersecurity"],
      confidence: 0.88,
      warnings: [
        "Resume does not show formal work experience or internship experience.",
        "Projects are school projects, not clearly commercial production experience.",
      ],
    },
    matchingProfile: {
      searchText:
        "Fullstack Developer student Next.js Django React JavaScript Python PostgreSQL SQLite Tailwind CSS Node.js Docker AWS Tauri Svelte E-commerce inventory management ticket booking",
      embeddingText:
        "Candidate is a 4th-year Information Technology student and Fullstack Developer with project experience in Next.js, Django, React, JavaScript, Python, PostgreSQL, SQLite, Tailwind CSS, Svelte, and Tauri.",
      hardSkills: ["Next.js", "Django", "React", "JavaScript", "Python"],
      softSkills: ["User Experience Focus", "Continuous Learning"],
      tools: ["Docker", "AWS", "Vercel", "Netlify", "Linux", "Tauri", "Arduino IDE"],
      domains: ["E-commerce", "E-book Platform", "Ticket Booking", "Inventory Management"],
      preferredRoles: [
        "Fullstack Developer",
        "Frontend Developer",
        "Backend Developer",
        "Junior Software Engineer",
        "Intern Software Engineer",
      ],
      redFlags: [
        {
          type: "missing_work_experience",
          message: "No formal work experience or internship is listed.",
          severity: "medium",
          evidence: ["Experience section lists School Projects only."],
        },
      ],
    },
    analysis: {
      confidence: 0.9,
      quality: "usable",
      missingFields: ["location", "linkedin", "full github url", "portfolio url"],
      warnings: [
        "Candidate has strong project-based fullstack profile, but lacks listed professional experience.",
        "Some links are not machine-actionable because they are shown as labels rather than full URLs.",
      ],
    },
  });
}

export function createCleanResumeMarkdown(parsedResume: ParsedResume): string {
  return [
    `# ${parsedResume.candidate.fullName}`,
    `**${parsedResume.headline}**`,
    "",
    parsedResume.professionalSummary,
    "",
    "## Skills",
    parsedResume.skills.primary.map((skill) => `- ${skill}`).join("\n"),
  ].join("\n");
}

export async function saveParsedResume(
  parsedResume: ParsedResume,
  sourceFileName: string,
  resumeId?: string,
): Promise<StoredResume> {
  const extraction: ResumeExtraction = {
    id: resumeId ?? crypto.randomUUID(),
    fullName: parsedResume.candidate.fullName,
    title: parsedResume.headline,
    email: parsedResume.candidate.email,
    phone: parsedResume.candidate.phone,
    location: parsedResume.candidate.location,
    summary: parsedResume.professionalSummary,
    skills: parsedResume.skills.raw,
    sourceFileName: sourceFileName,
    createdAt: parsedResume.source.parsedAt,
  };
  const result = await saveResume(extraction, sourceFileName, { id: extraction.id });
  return {
    resumeId: result.id,
    candidateId: `cand_${result.id}`, // Mock candidate ID for now
    sourceFileName: result.sourceFileName,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
  };
}

export async function getParsedResume(resumeId: string): Promise<StoredResume | null> {
  const result = await getResume(resumeId);
  if (!result) return null;
  return {
    resumeId: result.id,
    candidateId: `cand_${result.id}`, // Mock candidate ID for now
    sourceFileName: result.sourceFileName,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
  };

}

export async function listParsedResumes(): Promise<StoredResume[]> {
  const results = await listResumes();
  return results.map(result => ({
    resumeId: result.id,
    candidateId: `cand_${result.id}`, // Mock candidate ID for now
    sourceFileName: result.sourceFileName,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
  }));
}


export async function updateJob(jobId: string, input: JobUpdate = {}): Promise<AnalyzedJob | null> {
  const current = await getJob(jobId);
  if (!current) return null;

  const nextInput: JobInput = {
    title: input.title ?? current.title,
    company: input.company ?? current.company ?? undefined,
    location: input.location ?? current.location ?? undefined,
    description: input.description ?? current.description,
  };
  const updated = analyzeJob(nextInput, {
    id: jobId,
    createdAt: current.createdAt,
    updatedAt: new Date().toISOString(),
  });

  return await saveJob(updated);
}

export async function getMatch(matchId: string): Promise<RecruitmentMatch | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase.from("matches").select().eq("id", matchId).single();
  if (error) return null;
  return data as RecruitmentMatch;
}

export async function saveMatchFeedback(matchId: string, input: MatchFeedback): Promise<StoredMatchFeedback | null> {
  // Placeholder for feedback storage if table exists
  return {
    matchId,
    ...matchFeedbackSchema.parse(input),
    createdAt: new Date().toISOString(),
  };
}

export async function listMatches(jobId?: string): Promise<RecruitmentMatch[]> {
  return await dbListMatches({ jobId });
}

function makeId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
