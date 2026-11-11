import type { ReactNode } from "react";

/** The dark title band at the top of every inner page. */
export function PageHero({ kicker, title, children, aside }: { kicker: string; title: ReactNode; children: ReactNode; aside?: ReactNode }) {
  return (
    <section className="page-hero">
      <div className="section-wrap page-hero-inner">
        <div className="page-hero-copy">
          <span className="section-kicker">{kicker}</span>
          <h1>{title}</h1>
          <p>{children}</p>
        </div>
        {aside}
      </div>
    </section>
  );
}
