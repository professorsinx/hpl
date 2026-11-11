import "server-only";
import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "./env";

/**
 * Cookie-less client for public reads and visitor submissions. It always acts
 * as the `anon` role, so it is safe inside `use cache` scopes: nothing about
 * the current visitor can leak into a shared cache entry.
 */
export function createPublicClient() {
  if (!isSupabaseConfigured) return null;
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
