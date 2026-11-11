"use server";

import { refresh, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";
import { MEDIA_TAG } from "@/lib/data/media";
import { SPONSORS_TAG } from "@/lib/data/sponsors";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSessionClient } from "@/lib/supabase/server";
import {
  LOGO_MAX_BYTES,
  SPONSOR_LOGO_TYPES,
  fileExtension,
  parseYouTubeId,
  slugify,
  sponsorSchema,
} from "@/lib/validation";
import { BUCKETS, type PaymentStatus, type RegistrationStatus } from "@/types/database";

export type ActionState = { ok: boolean; message: string; fieldErrors?: Record<string, string> } | null;

const NOT_ALLOWED: ActionState = { ok: false, message: "Your session has expired. Please sign in again." };
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Every admin action starts here. The UI only hides controls; this is the
 * check that actually protects the data, and RLS backs it up in the database.
 */
async function adminClient() {
  const admin = await getAdmin();
  if (!admin) return null;
  return createSessionClient();
}

/* Session ───────────────────────────────────────────────────────────────── */

export async function signIn(_previous: ActionState, formData: FormData): Promise<ActionState> {
  if (!isSupabaseConfigured) {
    return { ok: false, message: "Supabase isn't configured. Add the keys to .env.local and restart." };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { ok: false, message: "Enter your email and password." };

  const supabase = await createSessionClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    // Deliberately vague: don't reveal whether the email exists.
    return { ok: false, message: "That email and password don't match an organiser account." };
  }

  const { data: membership, error: membershipError } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();
  if (membershipError) {
    await supabase.auth.signOut();
    return {
      ok: false,
      message: "The database isn't set up yet. Run the SQL file in supabase/migrations, then try again.",
    };
  }
  if (!membership) {
    await supabase.auth.signOut();
    return { ok: false, message: "This account doesn't have organiser access. Ask the digital team to add you." };
  }

  redirect("/admin");
}

export async function signOut() {
  if (isSupabaseConfigured) {
    const supabase = await createSessionClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}

/* Sponsors ──────────────────────────────────────────────────────────────── */

export async function saveSponsor(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await adminClient();
  if (!supabase) return NOT_ALLOWED;

  const id = String(formData.get("id") ?? "");
  const isEdit = id !== "";
  if (isEdit && !uuid.test(id)) return { ok: false, message: "Unknown sponsor." };

  const parsed = sponsorSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    tier: String(formData.get("tier") ?? ""),
    tagline: String(formData.get("tagline") ?? ""),
    description: String(formData.get("description") ?? ""),
    website_url: String(formData.get("website_url") ?? "").trim(),
    sort_order: String(formData.get("sort_order") ?? "0") || "0",
    is_published: formData.get("is_published") === "on",
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? "");
      if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    return { ok: false, message: "Please check the highlighted fields.", fieldErrors };
  }

  const logo = formData.get("logo");
  const hasLogo = logo instanceof File && logo.size > 0;
  if (hasLogo && !SPONSOR_LOGO_TYPES.includes(logo.type)) {
    return { ok: false, message: "Please check the logo.", fieldErrors: { logo: "Upload a PNG, JPG, WebP or SVG file." } };
  }
  if (hasLogo && logo.size > LOGO_MAX_BYTES) {
    return { ok: false, message: "Please check the logo.", fieldErrors: { logo: "The logo must be 2 MB or smaller." } };
  }

  let previousLogo: string | null = null;
  if (isEdit) {
    const { data: existing } = await supabase.from("sponsors").select("logo_path").eq("id", id).maybeSingle();
    if (!existing) return { ok: false, message: "This sponsor no longer exists. Refresh the page." };
    previousLogo = existing.logo_path;
  }

  let logoPath = previousLogo;
  if (hasLogo) {
    logoPath = `${crypto.randomUUID()}.${fileExtension(logo.type)}`;
    const { error } = await supabase.storage
      .from(BUCKETS.sponsorLogos)
      .upload(logoPath, logo, { contentType: logo.type, cacheControl: "31536000" });
    if (error) return { ok: false, message: `The logo couldn't be uploaded: ${error.message}` };
  } else if (formData.get("remove_logo") === "on") {
    logoPath = null;
  }

  const values = {
    ...parsed.data,
    tagline: parsed.data.tagline || null,
    website_url: parsed.data.website_url || null,
    logo_path: logoPath,
  };

  if (isEdit) {
    // The slug is the public anchor (/sponsors#slug); keep it stable on edit.
    const { error } = await supabase.from("sponsors").update(values).eq("id", id);
    if (error) return { ok: false, message: `Couldn't save: ${error.message}` };
  } else {
    const base = slugify(values.name);
    const { data: taken } = await supabase.from("sponsors").select("slug").like("slug", `${base}%`);
    const used = new Set((taken ?? []).map((row) => row.slug));
    let slug = base;
    for (let suffix = 2; used.has(slug); suffix++) slug = `${base}-${suffix}`;

    const { error } = await supabase.from("sponsors").insert({ ...values, slug });
    if (error) return { ok: false, message: `Couldn't save: ${error.message}` };
  }

  if (previousLogo && previousLogo !== logoPath) {
    await supabase.storage.from(BUCKETS.sponsorLogos).remove([previousLogo]);
  }

  updateTag(SPONSORS_TAG);
  refresh();
  return { ok: true, message: isEdit ? "Sponsor updated." : "Sponsor added." };
}

export async function deleteSponsor(id: string): Promise<ActionState> {
  const supabase = await adminClient();
  if (!supabase) return NOT_ALLOWED;
  if (!uuid.test(id)) return { ok: false, message: "Unknown sponsor." };

  const { data: sponsor } = await supabase.from("sponsors").select("logo_path").eq("id", id).maybeSingle();
  const { error } = await supabase.from("sponsors").delete().eq("id", id);
  if (error) return { ok: false, message: `Couldn't delete: ${error.message}` };
  if (sponsor?.logo_path) await supabase.storage.from(BUCKETS.sponsorLogos).remove([sponsor.logo_path]);

  updateTag(SPONSORS_TAG);
  refresh();
  return { ok: true, message: "Sponsor deleted." };
}

export async function setSponsorPublished(id: string, isPublished: boolean): Promise<ActionState> {
  const supabase = await adminClient();
  if (!supabase) return NOT_ALLOWED;
  if (!uuid.test(id)) return { ok: false, message: "Unknown sponsor." };

  const { error } = await supabase.from("sponsors").update({ is_published: isPublished }).eq("id", id);
  if (error) return { ok: false, message: `Couldn't update: ${error.message}` };

  updateTag(SPONSORS_TAG);
  refresh();
  return { ok: true, message: isPublished ? "Sponsor is now live." : "Sponsor hidden from the site." };
}

/* Media ─────────────────────────────────────────────────────────────────── */

export type UploadedMedia = { path: string; kind: "photo" | "video"; title: string; width: number | null; height: number | null };

const mediaPath = /^(photos\/[0-9a-f-]{36}\.(png|jpg|webp)|videos\/[0-9a-f-]{36}\.(mp4|webm|mov))$/;

/** Records files the browser has already uploaded straight to Storage. */
export async function recordUploads(uploads: UploadedMedia[]): Promise<ActionState> {
  const supabase = await adminClient();
  if (!supabase) return NOT_ALLOWED;
  if (!Array.isArray(uploads) || uploads.length === 0 || uploads.length > 40) {
    return { ok: false, message: "Nothing to save." };
  }

  const rows = [];
  for (const upload of uploads) {
    const expectedFolder = upload.kind === "photo" ? "photos/" : "videos/";
    if (!mediaPath.test(upload.path) || !upload.path.startsWith(expectedFolder)) {
      return { ok: false, message: "One of the files has an unexpected path." };
    }
    const dimension = (value: number | null) => (Number.isInteger(value) && value! > 0 && value! < 20000 ? value : null);
    rows.push({
      kind: upload.kind,
      source: "upload" as const,
      storage_path: upload.path,
      title: String(upload.title ?? "").trim().slice(0, 140) || null,
      width: dimension(upload.width),
      height: dimension(upload.height),
    });
  }

  const { error } = await supabase.from("media_items").insert(rows);
  if (error) return { ok: false, message: `Couldn't save: ${error.message}` };

  updateTag(MEDIA_TAG);
  refresh();
  return { ok: true, message: rows.length === 1 ? "1 item added to the gallery." : `${rows.length} items added to the gallery.` };
}

export async function addYouTubeVideo(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await adminClient();
  if (!supabase) return NOT_ALLOWED;

  const youtubeId = parseYouTubeId(String(formData.get("url") ?? ""));
  if (!youtubeId) {
    return { ok: false, message: "Please check the link.", fieldErrors: { url: "Paste a YouTube link, e.g. https://youtu.be/…" } };
  }
  const title = String(formData.get("title") ?? "").trim().slice(0, 140) || null;

  const { error } = await supabase.from("media_items").insert({ kind: "video", source: "youtube", youtube_id: youtubeId, title });
  if (error) return { ok: false, message: `Couldn't save: ${error.message}` };

  updateTag(MEDIA_TAG);
  refresh();
  return { ok: true, message: "Video added to the gallery." };
}

export async function updateMedia(id: string, changes: { title?: string; is_published?: boolean }): Promise<ActionState> {
  const supabase = await adminClient();
  if (!supabase) return NOT_ALLOWED;
  if (!uuid.test(id)) return { ok: false, message: "Unknown item." };

  const values: { title?: string | null; is_published?: boolean } = {};
  if (typeof changes.title === "string") values.title = changes.title.trim().slice(0, 140) || null;
  if (typeof changes.is_published === "boolean") values.is_published = changes.is_published;
  if (Object.keys(values).length === 0) return { ok: false, message: "Nothing to change." };

  const { error } = await supabase.from("media_items").update(values).eq("id", id);
  if (error) return { ok: false, message: `Couldn't update: ${error.message}` };

  updateTag(MEDIA_TAG);
  refresh();
  return { ok: true, message: "Saved." };
}

export async function deleteMedia(id: string): Promise<ActionState> {
  const supabase = await adminClient();
  if (!supabase) return NOT_ALLOWED;
  if (!uuid.test(id)) return { ok: false, message: "Unknown item." };

  const { data: item } = await supabase.from("media_items").select("storage_path").eq("id", id).maybeSingle();
  const { error } = await supabase.from("media_items").delete().eq("id", id);
  if (error) return { ok: false, message: `Couldn't delete: ${error.message}` };
  if (item?.storage_path) await supabase.storage.from(BUCKETS.eventMedia).remove([item.storage_path]);

  updateTag(MEDIA_TAG);
  refresh();
  return { ok: true, message: "Removed from the gallery." };
}

/* Registrations ─────────────────────────────────────────────────────────── */

const decisions: Record<string, { registration_status: RegistrationStatus; payment_status: PaymentStatus; message: string }> = {
  verify: { registration_status: "verified", payment_status: "verified", message: "Payment verified. Team confirmed." },
  reject: { registration_status: "rejected", payment_status: "failed", message: "Registration rejected." },
  reset: { registration_status: "pending_verification", payment_status: "submitted", message: "Moved back to pending." },
};

export async function decideRegistration(id: string, decision: "verify" | "reject" | "reset"): Promise<ActionState> {
  const supabase = await adminClient();
  if (!supabase) return NOT_ALLOWED;
  const outcome = decisions[decision];
  if (!uuid.test(id) || !outcome) return { ok: false, message: "Unknown registration." };

  const { message, ...values } = outcome;
  const { error } = await supabase.from("teams").update(values).eq("id", id);
  if (error) return { ok: false, message: `Couldn't update: ${error.message}` };

  refresh();
  return { ok: true, message };
}

export async function saveRegistrationNote(id: string, note: string): Promise<ActionState> {
  const supabase = await adminClient();
  if (!supabase) return NOT_ALLOWED;
  if (!uuid.test(id)) return { ok: false, message: "Unknown registration." };

  const { error } = await supabase.from("teams").update({ admin_notes: note.trim().slice(0, 1000) || null }).eq("id", id);
  if (error) return { ok: false, message: `Couldn't save the note: ${error.message}` };

  refresh();
  return { ok: true, message: "Note saved." };
}
