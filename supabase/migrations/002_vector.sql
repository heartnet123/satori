-- Enable the pgvector extension to work with embeddings
create extension if not exists vector;

-- Add embedding column to resumes table
alter table resumes 
add column if not exists embedding vector(1536);

-- Add embedding column to jobs table for JD vectorization
alter table jobs 
add column if not exists embedding vector(1536);

-- Create an HNSW index for faster vector similarity search
-- m=16, ef_construction=64 are reasonable defaults for OpenAI embeddings
create index if not exists resumes_embedding_hnsw_idx 
on resumes using hnsw (embedding vector_cosine_ops)
with (m = 16, ef_construction = 64);

-- Create a function to search for resumes by vector similarity
-- This will be called via Supabase RPC
create or replace function match_resumes (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  source_file_name text,
  parsed_resume jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    resumes.id,
    resumes.source_file_name,
    resumes.parsed_resume,
    1 - (resumes.embedding <=> query_embedding) as similarity
  from resumes
  where 1 - (resumes.embedding <=> query_embedding) > match_threshold
  order by resumes.embedding <=> query_embedding
  limit match_count;
end;
$$;
