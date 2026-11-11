import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ClipboardList, Handshake, Images } from "lucide-react";
import { PageHead, SetupNotice } from "@/components/admin/page-head";
import { requireAdmin } from "@/lib/auth";
import { createSessionClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Overview" };

export default async function AdminOverviewPage() {
  await requireAdmin();
  const supabase = await createSessionClient();

  const head = { count: "exact", head: true } as const;
  const [teams, pending, sponsors, media] = await Promise.all([
    supabase.from("teams").select("id", head),
    supabase.from("teams").select("id", head).eq("registration_status", "pending_verification"),
    supabase.from("sponsors").select("id", head),
    supabase.from("media_items").select("id", head),
  ]);
  const failure = [teams, pending, sponsors, media].find((result) => result.error)?.error;

  const cards = [
    {
      href: "/admin/registrations",
      icon: ClipboardList,
      label: "Team registrations",
      value: teams.count ?? 0,
      note: pending.count ? `${pending.count} waiting for payment verification` : "Nothing waiting for review",
      urgent: Boolean(pending.count),
    },
    { href: "/admin/sponsors", icon: Handshake, label: "Sponsors", value: sponsors.count ?? 0, note: "Shown on the home page band and /sponsors" },
    { href: "/admin/media", icon: Images, label: "Photos & videos", value: media.count ?? 0, note: "Shown in the public gallery" },
  ];

  return (
    <>
      <PageHead title="Overview">Everything the organising team manages on the HPL website.</PageHead>
      {failure && <SetupNotice detail={failure.message} />}
      <ul className="adm-stats">
        {cards.map(({ href, icon: Icon, label, value, note, urgent }) => (
          <li key={href}>
            <Link href={href} className="adm-stat" data-urgent={urgent || undefined}>
              <span className="adm-stat-icon"><Icon size={19} aria-hidden="true" /></span>
              <span className="adm-stat-label">{label}</span>
              <strong>{value}</strong>
              <small>{note}</small>
              <span className="adm-stat-go">Open <ArrowRight size={15} aria-hidden="true" /></span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
