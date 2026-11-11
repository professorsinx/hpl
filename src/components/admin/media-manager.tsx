"use client";

import { useActionState, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Check, CircleAlert, Eye, EyeOff, Film, LoaderCircle, Trash2, UploadCloud, Video } from "lucide-react";
import { addYouTubeVideo, deleteMedia, recordUploads, updateMedia, type ActionState, type UploadedMedia } from "@/app/admin/actions";
import { mediaUrl, youTubeThumbnail } from "@/lib/media";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { PHOTO_MAX_BYTES, PHOTO_TYPES, VIDEO_MAX_BYTES, VIDEO_TYPES, fileExtension } from "@/lib/validation";
import { BUCKETS, type MediaItem } from "@/types/database";
import { ConfirmButton } from "./confirm-button";
import { PageHead } from "./page-head";
import { useNotify } from "./toast";

type QueueItem = { id: string; name: string; status: "waiting" | "uploading" | "done" | "error"; detail?: string };

const megabytes = (bytes: number) => `${Math.round(bytes / 1024 / 1024)} MB`;

/** Pixel size of a photo, so the gallery can reserve space before it loads. */
async function measure(file: File) {
  try {
    const bitmap = await createImageBitmap(file);
    const size = { width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return size;
  } catch {
    return { width: null, height: null };
  }
}

export function MediaManager({ items }: { items: MediaItem[] }) {
  const notify = useNotify();
  const inputRef = useRef<HTMLInputElement>(null);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);

  const patch = (id: string, changes: Partial<QueueItem>) =>
    setQueue((current) => current.map((item) => (item.id === id ? { ...item, ...changes } : item)));

  /**
   * Files go straight from the browser to Supabase Storage (the admin's
   * session authorises it), so large videos never pass through this server.
   * Only the resulting paths are sent to the Server Action.
   */
  async function upload(files: File[]) {
    if (busy || files.length === 0) return;
    setBusy(true);

    const entries = files.slice(0, 40).map((file) => ({ file, id: crypto.randomUUID() }));
    setQueue(entries.map(({ file, id }) => ({ id, name: file.name, status: "waiting" })));

    const supabase = createBrowserSupabase();
    const uploaded: UploadedMedia[] = [];

    for (const { file, id } of entries) {
      const isPhoto = PHOTO_TYPES.includes(file.type);
      const isVideo = VIDEO_TYPES.includes(file.type);
      if (!isPhoto && !isVideo) {
        patch(id, { status: "error", detail: "Unsupported file type" });
        continue;
      }
      const limit = isPhoto ? PHOTO_MAX_BYTES : VIDEO_MAX_BYTES;
      if (file.size > limit) {
        patch(id, { status: "error", detail: `Larger than ${megabytes(limit)}` });
        continue;
      }

      patch(id, { status: "uploading" });
      const path = `${isPhoto ? "photos" : "videos"}/${id}.${fileExtension(file.type)}`;
      const { error } = await supabase.storage
        .from(BUCKETS.eventMedia)
        .upload(path, file, { contentType: file.type, cacheControl: "31536000" });
      if (error) {
        patch(id, { status: "error", detail: error.message });
        continue;
      }

      const size = isPhoto ? await measure(file) : { width: null, height: null };
      uploaded.push({ path, kind: isPhoto ? "photo" : "video", title: "", ...size });
      patch(id, { status: "done" });
    }

    if (uploaded.length > 0) notify(await recordUploads(uploaded));
    setBusy(false);
  }

  return (
    <>
      <PageHead title="Photos & videos">
        Event media for the public gallery. New uploads appear on the website immediately.
      </PageHead>

      <div className="adm-upload-grid">
        <div
          className="adm-dropzone"
          data-dragging={dragging || undefined}
          data-busy={busy || undefined}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            void upload(Array.from(event.dataTransfer.files));
          }}
        >
          <UploadCloud size={26} aria-hidden="true" />
          <strong>Drop photos and videos here</strong>
          <span>
            Photos: JPG, PNG or WebP up to {megabytes(PHOTO_MAX_BYTES)}. Videos: MP4, WebM or MOV up to {megabytes(VIDEO_MAX_BYTES)}.
          </span>
          <input
            ref={inputRef}
            className="sr-only"
            id="media-files"
            type="file"
            multiple
            accept={[...PHOTO_TYPES, ...VIDEO_TYPES].join(",")}
            onChange={(event) => {
              void upload(Array.from(event.target.files ?? []));
              event.target.value = "";
            }}
          />
          <button type="button" className="btn btn-primary" disabled={busy} onClick={() => inputRef.current?.click()}>
            {busy ? <LoaderCircle size={16} className="spin" aria-hidden="true" /> : <UploadCloud size={16} aria-hidden="true" />}
            {busy ? "Uploading…" : "Choose files"}
          </button>

          {queue.length > 0 && (
            <ul className="adm-queue" aria-live="polite">
              {queue.map((item) => (
                <li key={item.id} data-status={item.status}>
                  {item.status === "done" ? (
                    <Check size={14} aria-hidden="true" />
                  ) : item.status === "error" ? (
                    <CircleAlert size={14} aria-hidden="true" />
                  ) : (
                    <LoaderCircle size={14} className={item.status === "uploading" ? "spin" : undefined} aria-hidden="true" />
                  )}
                  <span>{item.name}</span>
                  <small>{item.detail ?? { waiting: "Waiting", uploading: "Uploading…", done: "Added", error: "Failed" }[item.status]}</small>
                </li>
              ))}
            </ul>
          )}
        </div>

        <YouTubeForm onSaved={notify} />
      </div>

      {items.length === 0 ? (
        <div className="adm-empty">
          <h2>The gallery is empty</h2>
          <p>Upload a few photos above and they&apos;ll appear at /gallery, and on the home page once there are three or more.</p>
        </div>
      ) : (
        <ul className="adm-media-grid">
          {items.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </ul>
      )}
    </>
  );
}

function YouTubeForm({ onSaved }: { onSaved: (result: ActionState) => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(async (previous: ActionState, formData: FormData) => {
    const result = await addYouTubeVideo(previous, formData);
    if (result?.ok) {
      onSaved(result);
      formRef.current?.reset();
    }
    return result;
  }, null);

  return (
    <form ref={formRef} action={action} className="adm-card adm-youtube">
      <h2><Video size={18} aria-hidden="true" /> Add a YouTube video</h2>
      <p>Best for longer highlights: nothing to upload, and it streams smoothly on any connection.</p>
      <div className="field">
        <label htmlFor="youtube-url">YouTube link</label>
        <input id="youtube-url" name="url" inputMode="url" placeholder="https://youtu.be/…" required aria-invalid={Boolean(state?.fieldErrors?.url)} />
        {state?.fieldErrors?.url && <p className="field-error" role="alert">{state.fieldErrors.url}</p>}
      </div>
      <div className="field">
        <label htmlFor="youtube-title">Caption <span className="field-optional">Optional</span></label>
        <input id="youtube-title" name="title" maxLength={140} placeholder="e.g. Final over, semi-final 1" />
      </div>
      {state && !state.ok && !state.fieldErrors && (
        <p className="form-alert" role="alert"><CircleAlert size={16} aria-hidden="true" />{state.message}</p>
      )}
      <button type="submit" className="btn btn-outline" disabled={pending}>
        {pending && <LoaderCircle size={16} className="spin" aria-hidden="true" />}
        Add video
      </button>
    </form>
  );
}

function MediaCard({ item }: { item: MediaItem }) {
  const notify = useNotify();
  const [pending, startTransition] = useTransition();
  const [title, setTitle] = useState(item.title ?? "");
  const src = mediaUrl(item);

  const saveTitle = () => {
    if (title.trim() === (item.title ?? "")) return;
    startTransition(async () => notify(await updateMedia(item.id, { title })));
  };

  return (
    <li className="adm-media" data-muted={!item.is_published || undefined}>
      <div className="adm-media-thumb">
        {item.source === "youtube" && item.youtube_id ? (
          <Image src={youTubeThumbnail(item.youtube_id)} alt="" fill sizes="240px" />
        ) : item.kind === "video" && src ? (
          <video src={`${src}#t=0.1`} preload="metadata" muted playsInline />
        ) : src ? (
          <Image src={src} alt="" fill sizes="240px" />
        ) : null}
        <span className="adm-badge" data-tone={item.kind}>
          {item.kind === "video" ? <Film size={12} aria-hidden="true" /> : null}
          {item.source === "youtube" ? "YouTube" : item.kind === "video" ? "Video" : "Photo"}
        </span>
        {!item.is_published && <span className="adm-badge" data-tone="hidden">Hidden</span>}
      </div>
      <div className="adm-media-body">
        <label className="sr-only" htmlFor={`caption-${item.id}`}>Caption</label>
        <input
          id={`caption-${item.id}`}
          value={title}
          maxLength={140}
          placeholder="Add a caption"
          onChange={(event) => setTitle(event.target.value)}
          onBlur={saveTitle}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.currentTarget.blur();
          }}
        />
        <div className="adm-row-actions">
          {pending && <LoaderCircle size={15} className="spin" aria-hidden="true" />}
          <button
            type="button"
            className="icon-btn"
            aria-label={item.is_published ? "Hide from the gallery" : "Show in the gallery"}
            title={item.is_published ? "Hide from the gallery" : "Show in the gallery"}
            onClick={() => startTransition(async () => notify(await updateMedia(item.id, { is_published: !item.is_published })))}
          >
            {item.is_published ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
          </button>
          <ConfirmButton
            className="icon-btn icon-btn-danger"
            label="Delete"
            title={`Delete this ${item.kind}?`}
            description="It is removed from the gallery and deleted from storage. This can't be undone."
            confirmLabel="Delete"
            onConfirm={async () => notify(await deleteMedia(item.id))}
          >
            <Trash2 size={16} aria-hidden="true" />
          </ConfirmButton>
        </div>
      </div>
    </li>
  );
}
