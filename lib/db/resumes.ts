import { createServerClient } from "@/lib/supabase/server";
import { type ResumeExtraction, resumeExtractionSchema } from "@/lib/recruitment/types";

export type StoredResume = ResumeExtraction & {
  embedding?: number[];
  updatedAt: string;
};

function toStoredResume(row: any): StoredResume {
  return {
    ...resumeExtractionSchema.parse(row),
    embedding: row.embedding ? (row.embedding as number[]) : undefined,
    updatedAt: row.updated_at,
  };
}

export async function saveResume(
  extraction: ResumeExtraction,
  sourceFileName: string,
  options: { id?: string; embedding?: number[] } = {}
): Promise<StoredResume> {
  const db = createServerClient();

  const insert = {
    ...extraction,
    source_file_name: sourceFileName,
    embedding: options.embedding,
  };

  const { data, error } = await db
    .from("resumes")
    .upsert(insert, { onConflict: "id" })
    .select()
    .single();

  if (error) throw new Error(`Failed to save resume: ${error.message}`);
  return toStoredResume(data);
}


export async function getResume(id: string): Promise<StoredResume | null> {
  const db = createServerClient();

  const { data, error } = await db
    .from("resumes")
    .select()
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // not found
    throw new Error(`Failed to get resume: ${error.message}`);
  }

  return toStoredResume(data);
}

export async function listResumes(): Promise<StoredResume[]> {
  const db = createServerClient();

  const { data, error } = await db
    .from("resumes")
    .select()
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to list resumes: ${error.message}`);
  return data.map(toStoredResume);
}

export async function deleteResume(id: string): Promise<void> {
  const db = createServerClient();

  const { error } = await db.from("resumes").delete().eq("id", id);
  if (error) throw new Error(`Failed to delete resume: ${error.message}`);
}
