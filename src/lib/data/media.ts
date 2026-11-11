import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import type { MediaItem } from "@/types/database";

export const MEDIA_TAG = "media";

/** Published photos and videos, newest first within the admin's ordering. */
export async function getMedia(): Promise<MediaItem[]> {
  "use cache";
  cacheTag(MEDIA_TAG);
  cacheLife("minutes");

  const supabase = createPublicClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("media_items")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(300);

  if (error) {
    // Most often the migration in supabase/migrations has not been run yet.
    console.warn("[media] could not load:", error.message);
    return [];
  }

  return data as MediaItem[];
}
