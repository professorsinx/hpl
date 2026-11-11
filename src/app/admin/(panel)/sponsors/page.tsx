import type { Metadata } from "next";
import { PageHead, SetupNotice } from "@/components/admin/page-head";
import { SponsorManager } from "@/components/admin/sponsor-manager";
import { requireAdmin } from "@/lib/auth";
import { createSessionClient } from "@/lib/supabase/server";
import type { Sponsor } from "@/types/database";

export const metadata: Metadata = { title: "Sponsors" };

export default async function AdminSponsorsPage() {
  await requireAdmin();
  const supabase = await createSessionClient();
  const { data, error } = await supabase
    .from("sponsors")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    return (
      <>
        <PageHead title="Sponsors">Logos and descriptions for the home page band and the sponsors page.</PageHead>
        <SetupNotice detail={error.message} />
      </>
    );
  }

  return <SponsorManager sponsors={data as Sponsor[]} />;
}
