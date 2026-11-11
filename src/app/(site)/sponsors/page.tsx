import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Handshake, Phone } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { SponsorLogo } from "@/components/sponsors/sponsor-logo";
import { getSponsors } from "@/lib/data/sponsors";
import { site } from "@/lib/site";
import { sponsorTiers } from "@/lib/sponsor-tiers";

export const metadata: Metadata = {
  title: "Sponsors",
  description: "The hospitals and organisations that make the Healthcare Premier League possible, and how to become a sponsor.",
};

function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default async function SponsorsPage() {
  const sponsors = await getSponsors();
  const groups = sponsorTiers
    .map((tier) => ({ tier, members: sponsors.filter((sponsor) => sponsor.tier === tier.id) }))
    .filter((group) => group.members.length > 0);
  const { chairman } = site.contacts;

  return (
    <main id="main-content" tabIndex={-1}>
      <PageHero kicker="OUR SPONSORS" title={<>The people who <span>back the league.</span></>}>
        HPL runs on the generosity of hospitals and organisations that believe
        in healthcare workers, in cricket, and in the fight against cancer.
      </PageHero>

      {groups.length === 0 ? (
        <section className="section-wrap page-section">
          <div className="empty-state">
            <span className="empty-icon"><Handshake size={24} aria-hidden="true" /></span>
            <h2>Our first sponsors will be announced soon.</h2>
            <p>Conversations are under way. Want your organisation to be the first name on this page?</p>
            <a className="button button-forest" href="#become-a-sponsor">
              Become a sponsor <ArrowRight size={17} aria-hidden="true" />
            </a>
          </div>
        </section>
      ) : (
        groups.map(({ tier, members }) => (
          <section className="section-wrap page-section sponsor-tier" key={tier.id} data-tier={tier.id} aria-labelledby={`tier-${tier.id}`}>
            <header className="tier-head">
              <h2 id={`tier-${tier.id}`}>{members.length > 1 ? tier.plural : tier.label}</h2>
              <p>{tier.blurb}</p>
            </header>
            <ul className="sponsor-list">
              {members.map((sponsor) => (
                <li className="sponsor-card" id={sponsor.slug} key={sponsor.id}>
                  <div className="sponsor-card-logo">
                    <SponsorLogo sponsor={sponsor} />
                  </div>
                  <div className="sponsor-card-body">
                    <h3>{sponsor.name}</h3>
                    {sponsor.tagline && <p className="sponsor-tagline">{sponsor.tagline}</p>}
                    {sponsor.description && <p className="sponsor-description">{sponsor.description}</p>}
                    {sponsor.website_url && (
                      <a className="underlined-link" href={sponsor.website_url} target="_blank" rel="noopener noreferrer">
                        {hostname(sponsor.website_url)} <ArrowUpRight size={15} aria-hidden="true" />
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}

      <section className="partner-section" id="become-a-sponsor" aria-labelledby="partner-title">
        <div className="section-wrap partner-inner">
          <div className="partner-copy">
            <span className="section-kicker">BECOME A SPONSOR</span>
            <h2 id="partner-title">Stand with the people <span>who care for us.</span></h2>
            <p>
              HPL brings every corner of Trichy&apos;s healthcare community to
              one ground, in support of cancer awareness and early detection.
              Sponsors are seen on jerseys, on the boundary, on this website
              and across the league&apos;s social channels.
            </p>
            <div className="partner-actions">
              <a className="button button-lime" href={`tel:${chairman.phone}`}>
                <Phone size={16} aria-hidden="true" /> Call {chairman.name} · {chairman.display}
              </a>
              <Link className="text-link" href="/organizers">
                Meet the sponsorship team <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
          <ol className="partner-tiers">
            {sponsorTiers.map((tier, index) => (
              <li key={tier.id}>
                <span>{`0${index + 1}`}</span>
                <div>
                  <strong>{tier.label}</strong>
                  <p>{tier.blurb}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
