import { storageUrl } from "@/lib/supabase/env";
import { BUCKETS, type Sponsor } from "@/types/database";

/**
 * A sponsor's logo, or a typeset wordmark when none has been uploaded yet.
 * Logos are arbitrary remote files (often SVG), so a plain <img> is used.
 */
export function SponsorLogo({ sponsor, className }: { sponsor: Pick<Sponsor, "name" | "logo_path">; className?: string }) {
  const src = storageUrl(BUCKETS.sponsorLogos, sponsor.logo_path);
  if (!src) {
    return <span className={className ? `sponsor-wordmark ${className}` : "sponsor-wordmark"}>{sponsor.name}</span>;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={className ? `sponsor-logo ${className}` : "sponsor-logo"} src={src} alt={sponsor.name} loading="lazy" decoding="async" />
  );
}
