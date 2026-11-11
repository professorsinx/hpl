import type { Metadata } from "next";
import { PageHead, SetupNotice } from "@/components/admin/page-head";
import { RegistrationManager, type RegistrationRow } from "@/components/admin/registration-manager";
import { requireAdmin } from "@/lib/auth";
import { storageUrl } from "@/lib/supabase/env";
import { createSessionClient } from "@/lib/supabase/server";
import { BUCKETS, type Team } from "@/types/database";

export const metadata: Metadata = { title: "Registrations" };

const submittedFormat = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export default async function AdminRegistrationsPage() {
  await requireAdmin();
  const supabase = await createSessionClient();
  const { data, error } = await supabase.from("teams").select("*").order("created_at", { ascending: false });

  if (error) {
    return (
      <>
        <PageHead title="Registrations">Team entries and their UPI payments.</PageHead>
        <SetupNotice detail={error.message} />
      </>
    );
  }

  // Dates are formatted here, on the server, so the browser's locale can't
  // produce a different string and trip hydration.
  const rows: RegistrationRow[] = (data as Team[]).map((team) => ({
    ...team,
    reference: `HPL-${team.id.slice(0, 8).toUpperCase()}`,
    submitted: submittedFormat.format(new Date(team.created_at)),
    logoUrl: storageUrl(BUCKETS.hospitalLogos, team.hospital_logo_path),
  }));

  return <RegistrationManager rows={rows} />;
}
