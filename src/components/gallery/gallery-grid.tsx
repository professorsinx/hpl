"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Dialog } from "@base-ui/react/dialog";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { mediaUrl, youTubeEmbed, youTubeThumbnail } from "@/lib/media";
import type { MediaItem } from "@/types/database";

type Filter = "all" | "photo" | "video";

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "photo", label: "Photos" },
  { id: "video", label: "Videos" },
];

/** Filterable media grid with a keyboard-friendly lightbox. */
export function GalleryGrid({ items }: { items: MediaItem[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [activeId, setActiveId] = useState<string | null>(null);

  const visible = useMemo(() => (filter === "all" ? items : items.filter((item) => item.kind === filter)), [items, filter]);
  const counts = useMemo(
    () => ({ all: items.length, photo: items.filter((item) => item.kind === "photo").length, video: items.filter((item) => item.kind === "video").length }),
    [items],
  );

  const activeIndex = visible.findIndex((item) => item.id === activeId);
  const active = activeIndex >= 0 ? visible[activeIndex] : null;
  const step = (direction: 1 | -1) => {
    if (activeIndex < 0) return;
    setActiveId(visible[(activeIndex + direction + visible.length) % visible.length].id);
  };

  return (
    <>
      {counts.photo > 0 && counts.video > 0 && (
        <div className="gallery-filters" role="group" aria-label="Filter the gallery">
          {filters.map(({ id, label }) => (
            <button key={id} type="button" className="chip" aria-pressed={filter === id} onClick={() => setFilter(id)}>
              {label} <span>{counts[id]}</span>
            </button>
          ))}
        </div>
      )}

      <ul className="gallery-grid">
        {visible.map((item) => (
          <li key={item.id}>
            <button type="button" className="gallery-tile" onClick={() => setActiveId(item.id)} aria-label={`Open ${item.kind}${item.title ? `: ${item.title}` : ""}`}>
              <Thumbnail item={item} />
              {item.kind === "video" && (
                <span className="gallery-play" aria-hidden="true">
                  <Play size={20} fill="currentColor" />
                </span>
              )}
              {item.title && <span className="gallery-caption">{item.title}</span>}
            </button>
          </li>
        ))}
      </ul>

      <Dialog.Root open={Boolean(active)} onOpenChange={(open) => !open && setActiveId(null)}>
        <Dialog.Portal>
          <Dialog.Backdrop className="lightbox-backdrop" />
          <Dialog.Popup
            className="lightbox"
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") step(1);
              if (event.key === "ArrowLeft") step(-1);
            }}
          >
            <Dialog.Title className="sr-only">{active?.title ?? (active?.kind === "video" ? "Video" : "Photo")}</Dialog.Title>
            <Dialog.Close className="lightbox-button lightbox-close" aria-label="Close">
              <X size={20} aria-hidden="true" />
            </Dialog.Close>
            {visible.length > 1 && (
              <>
                <button type="button" className="lightbox-button lightbox-prev" onClick={() => step(-1)} aria-label="Previous">
                  <ChevronLeft size={22} aria-hidden="true" />
                </button>
                <button type="button" className="lightbox-button lightbox-next" onClick={() => step(1)} aria-label="Next">
                  <ChevronRight size={22} aria-hidden="true" />
                </button>
              </>
            )}
            {active && (
              <figure className="lightbox-figure" key={active.id}>
                <Viewer item={active} />
                <figcaption>
                  {active.title && <strong>{active.title}</strong>}
                  <span>
                    {activeIndex + 1} of {visible.length}
                  </span>
                </figcaption>
              </figure>
            )}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

function Thumbnail({ item }: { item: MediaItem }) {
  if (item.source === "youtube" && item.youtube_id) {
    return <Image src={youTubeThumbnail(item.youtube_id)} alt="" width={480} height={360} sizes="(max-width: 680px) 50vw, 25vw" />;
  }
  const src = mediaUrl(item);
  if (!src) return null;
  if (item.kind === "video") {
    // The first frame doubles as the poster; only metadata is fetched.
    return <video src={`${src}#t=0.1`} preload="metadata" muted playsInline tabIndex={-1} />;
  }
  return <Image src={src} alt={item.title ?? ""} width={item.width ?? 800} height={item.height ?? 600} sizes="(max-width: 680px) 50vw, (max-width: 980px) 33vw, 25vw" />;
}

function Viewer({ item }: { item: MediaItem }) {
  if (item.source === "youtube" && item.youtube_id) {
    return (
      <iframe
        className="lightbox-frame"
        src={youTubeEmbed(item.youtube_id)}
        title={item.title ?? "Video"}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    );
  }
  const src = mediaUrl(item);
  if (!src) return null;
  if (item.kind === "video") {
    return <video className="lightbox-video" src={src} controls autoPlay playsInline />;
  }
  return <Image className="lightbox-image" src={src} alt={item.title ?? ""} width={item.width ?? 1600} height={item.height ?? 1200} sizes="100vw" priority />;
}
