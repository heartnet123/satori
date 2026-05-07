-- Satori MVP — Initial database schema
-- Run this in the Supabase SQL editor (or via Supabase CLI: supabase db push)
-- No RLS: single-user MVP. Add RLS policies when introducing auth.

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────
-- resumes
-- Stores parsed candidate profiles (process & discard the original file).
-- ─────────────────────────────────────────────
create table if not exists resumes (
  id              uuid primary key default gen_random_uuid(),
  source_file_name text not null,
  parsed_resume   jsonb not null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists resumes_created_at_idx on resumes (created_at desc);

-- ─────────────────────────────────────────────
-- jobs
-- Stores job descriptions created/saved by the recruiter for reuse.
-- ─────────────────────────────────────────────
create table if not exists jobs (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  company          text,
  location         text,
  description      text not null,
  extracted_skills jsonb not null default '[]',
  seniority        text not null default 'unspecified',
  responsibilities jsonb not null default '[]',
  requirements     jsonb not null default '[]',
  domains          jsonb not null default '[]',
  confidence       numeric(4,2) not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists jobs_updated_at_idx on jobs (updated_at desc);

-- ─────────────────────────────────────────────
-- matches
-- Stores GPT-4o match results for a resume × job pair.
-- ─────────────────────────────────────────────
create table if not exists matches (
  id                   uuid primary key default gen_random_uuid(),
  resume_id            uuid not null references resumes(id) on delete cascade,
  candidate_name       text not null,
  job_id               uuid not null references jobs(id) on delete cascade,
  score                integer not null check (score between 0 and 100),
  matched_skills       jsonb not null default '[]',
  missing_skills       jsonb not null default '[]',
  strengths            jsonb not null default '[]',
  risks                jsonb not null default '[]',
  explanation          text not null,
  recommendation_label text not null,
  created_at           timestamptz not null default now()
);

create index if not exists matches_resume_id_idx on matches (resume_id);
create index if not exists matches_job_id_idx    on matches (job_id);
create index if not exists matches_score_idx     on matches (score desc);

-- updated_at trigger helper (shared)
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger resumes_updated_at
  before update on resumes
  for each row execute procedure set_updated_at();

create or replace trigger jobs_updated_at
  before update on jobs
  for each row execute procedure set_updated_at();
