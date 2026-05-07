/**
 * Supabase database types for Satori.
 * These mirror the SQL schema in supabase/migrations/001_init.sql.
 * Update this file whenever the schema changes.
 */
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      resumes: {
        Row: {
          id: string;
          source_file_name: string;
          parsed_resume: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          source_file_name: string;
          parsed_resume: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          source_file_name?: string;
          parsed_resume?: Json;
          updated_at?: string;
        };
      };
      jobs: {
        Row: {
          id: string;
          title: string;
          company: string | null;
          location: string | null;
          description: string;
          extracted_skills: Json;
          seniority: string;
          responsibilities: Json;
          requirements: Json;
          domains: Json;
          confidence: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          company?: string | null;
          location?: string | null;
          description: string;
          extracted_skills?: Json;
          seniority?: string;
          responsibilities?: Json;
          requirements?: Json;
          domains?: Json;
          confidence?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          company?: string | null;
          location?: string | null;
          description?: string;
          extracted_skills?: Json;
          seniority?: string;
          responsibilities?: Json;
          requirements?: Json;
          domains?: Json;
          confidence?: number;
          updated_at?: string;
        };
      };
      matches: {
        Row: {
          id: string;
          resume_id: string;
          candidate_name: string;
          job_id: string;
          score: number;
          matched_skills: Json;
          missing_skills: Json;
          strengths: Json;
          risks: Json;
          explanation: string;
          recommendation_label: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          resume_id: string;
          candidate_name: string;
          job_id: string;
          score: number;
          matched_skills: Json;
          missing_skills: Json;
          strengths: Json;
          risks: Json;
          explanation: string;
          recommendation_label: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          resume_id?: string;
          candidate_name?: string;
          job_id?: string;
          score?: number;
          matched_skills?: Json;
          missing_skills?: Json;
          strengths?: Json;
          risks?: Json;
          explanation?: string;
          recommendation_label?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
