import type { Metadata } from "next";
import { Check } from "lucide-react";
import { scenes } from "@/components/scenes";
import { SceneLab } from "@/components/scenes/scene-lab";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hero animation picker",
  robots: { index: false, follow: false },
};

export default function AnimationsPage() {
  return (
    <main id="main-content" tabIndex={-1} className="lab-page">
      <div className="section-wrap">
        <header className="page-hero-copy">
          <span className="section-kicker">DESIGN REVIEW · NOT LINKED FROM THE SITE</span>
          <h1>Pick the hero <span>animation.</span></h1>
          <p>
            Four looping scenes built for the home page hero, each starring
            healthcare workers with bat and ball. Choose one and it goes live
            by changing a single line: <code>heroScene</code> in <code>src/lib/site.ts</code>.
          </p>
        </header>
        <SceneLab>
          <ol className="lab-grid">
            {scenes.map(({ id, name, summary, mood, Component }, index) => (
              <li className="lab-card" key={id} id={id}>
                <div className="lab-stage">
                  <Component />
                </div>
                <div className="lab-meta">
                  <span className="lab-number">OPTION {index + 1}</span>
                  {site.heroScene === id && (
                    <span className="lab-live"><Check size={13} aria-hidden="true" /> Live on the home page</span>
                  )}
                  <h2>{name}</h2>
                  <p>{summary}</p>
                  <p className="lab-mood">{mood}</p>
                  <code className="lab-id">heroScene: &quot;{id}&quot;</code>
                </div>
              </li>
            ))}
          </ol>
        </SceneLab>
      </div>
    </main>
  );
}
