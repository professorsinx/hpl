import type { Metadata } from "next";
import { MediaManager } from "@/components/admin/media-manager";
import { PageHead, SetupNotice } from "@/components/admin/page-head";
import { requireAdmin } from "@/lib/auth";
import { createSessionClient } from "@/lib/supabase/server";
import type { MediaItem } from "@/types/database";

export const metadata: Metadata = { title: "Photos & videos" };

export default async function AdminMediaPage() {
  await requireAdmin();
  const supabase = await createSessionClient();
  const { data, error } = await supabase
    .from("media_items")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <>
        <PageHead title="Photos & videos">Event media for the public gallery.</PageHead>
        <SetupNotice detail={error.message} />
      </>
    );
  }

  return <MediaManager items={data as MediaItem[]} />;
}
