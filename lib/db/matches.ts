import { createServerClient } from "@/lib/supabase/server";
import { recruitmentMatchSchema, type RecruitmentMatch } from "@/lib/recruitment/types";

function toRecruitmentMatch(row: {
  id: string;
  resume_id: string;
  candidate_name: string;
  job_id: string;
  score: number;
  matched_skills: unknown;
  missing_skills: unknown;
  strengths: unknown;
  risks: unknown;
  explanation: string;
  recommendation_label: string;
  created_at: string;
}): RecruitmentMatch {
  return recruitmentMatchSchema.parse({
    id: row.id,
    resumeId: row.resume_id,
    candidateName: row.candidate_name,
    jobId: row.job_id,
    score: row.score,
    matchedSkills: row.matched_skills,
    missingSkills: row.missing_skills,
    strengths: row.strengths,
    risks: row.risks,
    explanation: row.explanation,
    recommendationLabel: row.recommendation_label,
    createdAt: row.created_at,
  });
}

export async function saveMatch(match: RecruitmentMatch): Promise<RecruitmentMatch> {
  const db = createServerClient();

  const insert = {
    id: match.id,
    resume_id: match.resumeId,
    candidate_name: match.candidateName,
    job_id: match.jobId,
    score: match.score,
    matched_skills: match.matchedSkills,
    missing_skills: match.missingSkills,
    strengths: match.strengths,
    risks: match.risks,
    explanation: match.explanation,
    recommendation_label: match.recommendationLabel,
  };

  const { data, error } = await db
    .from("matches")
    .upsert(insert, { onConflict: "id" })
    .select()
    .single();

  if (error) throw new Error(`Failed to save match: ${error.message}`);
  return toRecruitmentMatch(data);
}

export async function getMatch(id: string): Promise<RecruitmentMatch | null> {
  const db = createServerClient();

  const { data, error } = await db.from("matches").select().eq("id", id).single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(`Failed to get match: ${error.message}`);
  }

  return toRecruitmentMatch(data);
}

export async function listMatches(options?: {
  jobId?: string;
  resumeId?: string;
}): Promise<RecruitmentMatch[]> {
  const db = createServerClient();

  let query = db
    .from("matches")
    .select()
    .order("score", { ascending: false });

  if (options?.jobId) query = query.eq("job_id", options.jobId);
  if (options?.resumeId) query = query.eq("resume_id", options.resumeId);

  const { data, error } = await query;
  if (error) throw new Error(`Failed to list matches: ${error.message}`);
  return data.map(toRecruitmentMatch);
}

export async function deleteMatchesForJob(jobId: string): Promise<void> {
  const db = createServerClient();
  const { error } = await db.from("matches").delete().eq("job_id", jobId);
  if (error) throw new Error(`Failed to delete matches for job: ${error.message}`);
}
