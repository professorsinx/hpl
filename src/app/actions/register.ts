"use server";

import { registrationPhase, site } from "@/lib/site";
import { createPublicClient } from "@/lib/supabase/public";
import {
  HOSPITAL_LOGO_TYPES,
  LOGO_MAX_BYTES,
  fileExtension,
  registrationSchema,
  type RegistrationField,
} from "@/lib/validation";
import { BUCKETS } from "@/types/database";

export type RegistrationResult =
  | { ok: true; reference: string; teamName: string }
  | { ok: false; message: string; fieldErrors?: Partial<Record<RegistrationField | "hospital_logo", string>> };

const GENERIC_ERROR =
  "We couldn't save your registration just now. Your payment is safe: please try again in a minute, or call the organisers.";

/**
 * Public team registration. Everything the browser sends is re-validated
 * here; the database then enforces the same rules again through constraints
 * and row level security, so a hand-crafted request gains nothing.
 */
export async function registerTeam(formData: FormData): Promise<RegistrationResult> {
  const phase = registrationPhase(Date.now());
  if (phase === "upcoming") {
    return { ok: false, message: `Registration opens on ${site.registration.opensLabel}.` };
  }
  if (phase === "closed") {
    return { ok: false, message: `Registration closed on ${site.registration.closesLabel}.` };
  }

  // Honeypot: real visitors never see or fill this field.
  if (String(formData.get("company_website") ?? "") !== "") {
    return { ok: true, reference: "HPL-RECEIVED", teamName: "" };
  }

  const text = (name: string) => String(formData.get(name) ?? "");
  const parsed = registrationSchema.safeParse({
    hospital_name: text("hospital_name"),
    hospital_address: text("hospital_address"),
    team_name: text("team_name"),
    captain_name: text("captain_name"),
    captain_phone: text("captain_phone"),
    captain_email: text("captain_email"),
    vice_captain_name: text("vice_captain_name"),
    vice_captain_phone: text("vice_captain_phone"),
    payment_utr: text("payment_utr"),
    eligibility_confirmed: formData.get("eligibility_confirmed") === "true",
  });

  if (!parsed.success) {
    const fieldErrors: Partial<Record<RegistrationField, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as RegistrationField | undefined;
      if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    return { ok: false, message: "Please check the highlighted details.", fieldErrors };
  }

  const logo = formData.get("hospital_logo");
  const hasLogo = logo instanceof File && logo.size > 0;
  if (hasLogo) {
    if (!HOSPITAL_LOGO_TYPES.includes(logo.type)) {
      return { ok: false, message: "Please check the logo.", fieldErrors: { hospital_logo: "Upload a PNG, JPG or WebP image." } };
    }
    if (logo.size > LOGO_MAX_BYTES) {
      return { ok: false, message: "Please check the logo.", fieldErrors: { hospital_logo: "The logo must be 2 MB or smaller." } };
    }
  }

  const supabase = createPublicClient();
  if (!supabase) return { ok: false, message: GENERIC_ERROR };

  const id = crypto.randomUUID();
  let logoPath: string | null = null;

  if (hasLogo) {
    logoPath = `${id}.${fileExtension(logo.type)}`;
    const { error } = await supabase.storage
      .from(BUCKETS.hospitalLogos)
      .upload(logoPath, logo, { contentType: logo.type, cacheControl: "31536000" });
    if (error) {
      console.error("[register] logo upload failed:", error.message);
      return {
        ok: false,
        message: "We couldn't upload the logo. Try a different image, or remove it and send it to the organisers later.",
        fieldErrors: { hospital_logo: "Upload failed. Please try another image." },
      };
    }
  }

  const { eligibility_confirmed: _confirmed, vice_captain_phone, ...team } = parsed.data;
  void _confirmed;

  // No `.select()`: visitors are allowed to insert a registration, never to read one.
  const { error } = await supabase.from("teams").insert({
    id,
    ...team,
    vice_captain_phone: vice_captain_phone || null,
    hospital_logo_path: logoPath,
    entry_fee_amount: site.entryFee,
  });

  if (error) {
    if (error.code === "23505") {
      return {
        ok: false,
        message: "This UPI reference has already been used for a registration.",
        fieldErrors: {
          payment_utr: "This reference is already registered. If that was you, there's no need to submit again.",
        },
      };
    }
    console.error("[register] insert failed:", error.code, error.message);
    return { ok: false, message: GENERIC_ERROR };
  }

  return { ok: true, reference: `HPL-${id.slice(0, 8).toUpperCase()}`, teamName: team.team_name };
}
