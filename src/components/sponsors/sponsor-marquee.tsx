import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSponsors } from "@/lib/data/sponsors";
import { sponsorTiers, tierLabel } from "@/lib/sponsor-tiers";
import { SponsorLogo } from "./sponsor-logo";

/** Enough copies of the list that one half of the track always fills the screen. */
function fill<T>(items: T[], minimum: number) {
  const copies = Math.max(1, Math.ceil(minimum / items.length));
  return Array.from({ length: copies }, () => items).flat();
}

/**
 * The scrolling sponsor band on the home page. Each logo links to that
 * sponsor's entry on /sponsors. Until sponsors are added in the admin, the
 * band advertises the open sponsorship tiers instead of sitting empty.
 */
export async function SponsorMarquee() {
  const sponsors = await getSponsors();
  const hasSponsors = sponsors.length > 0;

  const items = hasSponsors
    ? sponsors.map((sponsor) => ({
        key: sponsor.id,
        href: `/sponsors#${sponsor.slug}`,
        label: `${sponsor.name}, ${tierLabel(sponsor.tier)}`,
        content: (
          <>
            <SponsorLogo sponsor={sponsor} />
            <small>{tierLabel(sponsor.tier)}</small>
          </>
        ),
      }))
    : sponsorTiers.map((tier) => ({
        key: tier.id,
        href: "/sponsors#become-a-sponsor",
        label: `${tier.label}: partnership available`,
        content: (
          <>
            <span className="sponsor-wordmark sponsor-open">Your logo here</span>
            <small>{tier.label}</small>
          </>
        ),
      }));

  const half = fill(items, 8);

  return (
    <section className="sponsor-band" aria-labelledby="sponsor-band-title">
      <div className="section-wrap sponsor-band-head">
        <div>
          <span className="section-kicker">{hasSponsors ? "MADE POSSIBLE BY" : "PARTNER WITH HPL"}</span>
          <h2 id="sponsor-band-title">{hasSponsors ? "Our sponsors" : "Put your name beside the league"}</h2>
        </div>
        <Link className="underlined-link" href="/sponsors">
          {hasSponsors ? "Meet the sponsors" : "Sponsorship details"} <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
      <div className="marquee" style={{ "--marquee-items": half.length } as React.CSSProperties}>
        <ul className="marquee-track">
          {half.map((item, index) => (
            <li key={`a-${item.key}-${index}`}>
              <Link className="marquee-item" href={item.href} aria-label={item.label}>
                {item.content}
              </Link>
            </li>
          ))}
          {/* Second copy makes the loop seamless; hidden from assistive tech. */}
          {half.map((item, index) => (
            <li key={`b-${item.key}-${index}`} aria-hidden="true">
              <Link className="marquee-item" href={item.href} tabIndex={-1}>
                {item.content}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
