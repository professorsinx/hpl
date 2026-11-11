import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getMedia } from "@/lib/data/media";
import { mediaUrl } from "@/lib/media";

/** A strip of the latest photos on the home page. Renders nothing until there are some. */
export async function GalleryTeaser() {
  const photos = (await getMedia()).filter((item) => item.kind === "photo" && item.storage_path).slice(0, 5);
  if (photos.length < 3) return null;

  return (
    <section className="teaser-section" aria-labelledby="teaser-title">
      <div className="section-wrap">
        <div className="section-heading">
          <div>
            <span className="section-kicker">FROM THE GROUND</span>
            <h2 id="teaser-title">
              Moments from <span>HPL.</span>
            </h2>
          </div>
          <Link className="underlined-link" href="/gallery">
            Open the gallery <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <ul className="teaser-grid">
          {photos.map((photo) => (
            <li key={photo.id}>
              <Link href="/gallery" aria-label={photo.title ?? "Open the gallery"}>
                <Image src={mediaUrl(photo)!} alt={photo.title ?? ""} fill sizes="(max-width: 680px) 50vw, 20vw" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
