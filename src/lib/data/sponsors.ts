import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import { tierRank } from "@/lib/sponsor-tiers";
import type { Sponsor } from "@/types/database";

export const SPONSORS_TAG = "sponsors";

/**
 * Published sponsors, most senior tier first. Cached and tagged: the admin
 * actions expire the tag, so edits appear immediately.
 */
export async function getSponsors(): Promise<Sponsor[]> {
  "use cache";
  cacheTag(SPONSORS_TAG);
  cacheLife("minutes");

  const supabase = createPublicClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("sponsors")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    // Most often the migration in supabase/migrations has not been run yet.
    console.warn("[sponsors] could not load:", error.message);
    return [];
  }

  return (data as Sponsor[]).sort((a, b) => tierRank[a.tier] - tierRank[b.tier]);
}
