import { createServerClient } from "@/lib/supabase/server";
import { analyzedJobSchema, type AnalyzedJob } from "@/lib/recruitment/types";

export async function getJobs(): Promise<AnalyzedJob[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });
    
  if (error) throw error;
  return data.map((job) => analyzedJobSchema.parse({
    ...job,
    createdAt: job.created_at,
    updatedAt: job.updated_at,
    extractedSkills: job.extracted_skills,
  }));
}

export async function getJob(id: string): Promise<AnalyzedJob | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single();
    
  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  
  return analyzedJobSchema.parse({
    ...data,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    extractedSkills: data.extracted_skills,
  });
}

export async function saveJob(
  job: AnalyzedJob,
  options: { embedding?: number[] } = {}
): Promise<AnalyzedJob> {
  const supabase = createServerClient();
  
  const insert = {
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    description: job.description,
    extracted_skills: job.extractedSkills,
    seniority: job.seniority,
    responsibilities: job.responsibilities,
    requirements: job.requirements,
    domains: job.domains,
    confidence: job.confidence,
    embedding: options.embedding,
  };

  const { data, error } = await supabase
    .from("jobs")
    .upsert(insert, { onConflict: "id" })
    .select()
    .single();
    
  if (error) throw error;
  
  return analyzedJobSchema.parse({
    ...data,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    extractedSkills: data.extracted_skills,
  });
}
