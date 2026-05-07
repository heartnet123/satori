import { createClient } from "@supabase/supabase-js";

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local"
    );
  }

  return { url, key };
}

/**
 * Server-only Supabase client using the service role key.
 * Use this in Next.js API routes and server actions only — never in client components.
 * RLS is bypassed because no auth is required for the MVP.
 * All data access is validated via Zod schemas in the repository layer.
 */
export function createServerClient() {
  const { url, key } = getSupabaseEnv();
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
