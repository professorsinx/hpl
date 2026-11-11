import type { Metadata } from "next";
import { Camera } from "lucide-react";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { PageHero } from "@/components/site/page-hero";
import { getMedia } from "@/lib/data/media";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos and videos from the Healthcare Premier League: match days, team huddles and the moments in between.",
};

export default async function GalleryPage() {
  const items = await getMedia();

  return (
    <main id="main-content" tabIndex={-1}>
      <PageHero kicker="PHOTOS & VIDEOS" title={<>The league, <span>in pictures.</span></>}>
        Match days, team huddles and everything in between. New moments are
        added by the organising team through the season.
      </PageHero>

      <section className="section-wrap page-section">
        {items.length > 0 ? (
          <GalleryGrid items={items} />
        ) : (
          <div className="empty-state">
            <span className="empty-icon"><Camera size={24} aria-hidden="true" /></span>
            <h2>The first photos are on their way.</h2>
            <p>
              The gallery opens with the tournament on 4 February 2027. Check
              back after the first ball is bowled.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
