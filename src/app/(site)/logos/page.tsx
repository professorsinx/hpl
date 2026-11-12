import type { Metadata } from "next";
import { Check } from "lucide-react";
import { logos } from "@/components/brand/logos";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Logo picker",
  robots: { index: false, follow: false },
};

export default function LogosPage() {
  return (
    <main id="main-content" tabIndex={-1} className="lab-page">
      <div className="section-wrap">
        <header className="page-hero-copy">
          <span className="section-kicker">DESIGN REVIEW · NOT LINKED FROM THE SITE</span>
          <h1>Pick the <span>HPL logo.</span></h1>
          <p>
            Four flat marks drawn in the site&apos;s own colours and style. Each is
            shown large, on the three backgrounds the site uses, and at the
            small sizes a logo has to survive. Choose one by setting{" "}
            <code>logo</code> in <code>src/lib/site.ts</code>.
          </p>
        </header>
        <ol className="lab-grid logo-grid">
          {logos.map(({ id, name, summary, note, Component }, index) => (
            <li className="lab-card" key={id} id={id}>
              <div className="logo-hero">
                <Component title={`${name} logo`} />
              </div>
              <div className="logo-swatches" aria-hidden="true">
                <span className="logo-swatch logo-on-paper"><Component /></span>
                <span className="logo-swatch logo-on-lime"><Component /></span>
                <span className="logo-swatch logo-on-forest logo-lockup">
                  <Component />
                  <span><strong>HPL <em>2027</em></strong><small>Healthcare Premier League</small></span>
                </span>
                <span className="logo-swatch logo-on-forest logo-tiny"><Component /><Component /></span>
              </div>
              <div className="lab-meta">
                <span className="lab-number">OPTION {index + 1}</span>
                {site.logo === id && (
                  <span className="lab-live"><Check size={13} aria-hidden="true" /> Live on the site</span>
                )}
                <h2>{name}</h2>
                <p>{summary}</p>
                <p className="lab-mood">{note}</p>
                <code className="lab-id">logo: &quot;{id}&quot;</code>
              </div>
            </li>
          ))}
        </ol>
        <p className="logo-original-note">
          To go back to the metallic crest, set <code>logo: &quot;original&quot;</code>.
        </p>
      </div>
    </main>
  );
}
