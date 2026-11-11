import type { Bucket } from "@/types/database";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** False on a machine without .env.local — pages then render their empty states. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/** Public URL for an object in one of our public buckets. */
export function storageUrl(bucket: Bucket, path: string | null | undefined) {
  if (!path || !supabaseUrl) return null;
  const encoded = path.split("/").map(encodeURIComponent).join("/");
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${encoded}`;
}
