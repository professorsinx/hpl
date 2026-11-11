import { storageUrl } from "@/lib/supabase/env";
import { BUCKETS, type MediaItem } from "@/types/database";

/** The public file URL for an uploaded photo or video. */
export function mediaUrl(item: Pick<MediaItem, "storage_path">) {
  return storageUrl(BUCKETS.eventMedia, item.storage_path);
}

export function youTubeThumbnail(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export function youTubeEmbed(id: string) {
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
}
