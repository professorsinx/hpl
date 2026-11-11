import { z } from "zod";

/** Shared by the browser form and the Server Action, so the rules can't drift. */

const trimmed = (min: number, max: number, label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .min(min, `${label} must be at least ${min} characters`)
    .max(max, `${label} must be ${max} characters or fewer`);

const indianMobile = z
  .string()
  .trim()
  .transform((value) => value.replace(/[\s-]/g, "").replace(/^(\+?91|0)(?=\d{10}$)/, ""))
  .pipe(z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"));

export const registrationSchema = z.object({
  hospital_name: trimmed(2, 140, "Hospital name"),
  hospital_address: trimmed(2, 300, "Hospital location"),
  team_name: trimmed(2, 80, "Team name"),
  captain_name: trimmed(2, 80, "Captain's name"),
  captain_phone: indianMobile,
  captain_email: z.string().trim().toLowerCase().max(160).pipe(z.email("Enter a valid email address")),
  vice_captain_name: trimmed(2, 80, "Vice-captain's name"),
  vice_captain_phone: z.union([z.literal(""), indianMobile]),
  payment_utr: z
    .string()
    .transform((value) => value.replace(/\s/g, ""))
    .pipe(z.string().regex(/^\d{12}$/, "The UPI reference (UTR) is a 12-digit number")),
  eligibility_confirmed: z.literal(true, "Please confirm your team's eligibility"),
});

export type RegistrationInput = z.input<typeof registrationSchema>;
export type RegistrationField = keyof RegistrationInput;

/** Fields validated at each step of the registration dialog. */
export const registrationSteps: RegistrationField[][] = [
  ["hospital_name", "hospital_address", "team_name"],
  ["captain_name", "captain_phone", "captain_email", "vice_captain_name", "vice_captain_phone"],
  ["payment_utr", "eligibility_confirmed"],
];

export const LOGO_MAX_BYTES = 2 * 1024 * 1024;
export const HOSPITAL_LOGO_TYPES = ["image/png", "image/jpeg", "image/webp"];
export const SPONSOR_LOGO_TYPES = [...HOSPITAL_LOGO_TYPES, "image/svg+xml"];

export const PHOTO_TYPES = ["image/png", "image/jpeg", "image/webp"];
export const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
export const PHOTO_MAX_BYTES = 12 * 1024 * 1024;
export const VIDEO_MAX_BYTES = 50 * 1024 * 1024;

export function fileExtension(type: string) {
  return (
    {
      "image/png": "png",
      "image/jpeg": "jpg",
      "image/webp": "webp",
      "image/svg+xml": "svg",
      "video/mp4": "mp4",
      "video/webm": "webm",
      "video/quicktime": "mov",
    }[type] ?? null
  );
}

export const sponsorSchema = z.object({
  name: trimmed(2, 120, "Name"),
  tier: z.enum(["title", "associate", "category", "supporter"]),
  tagline: z.string().trim().max(160, "Tagline must be 160 characters or fewer"),
  description: z.string().trim().max(4000, "Description must be 4,000 characters or fewer"),
  website_url: z.union([
    z.literal(""),
    z
      .string()
      .trim()
      .max(300)
      .transform((value) => (/^https?:\/\//i.test(value) ? value : `https://${value}`))
      .pipe(z.url("Enter a valid website address")),
  ]),
  sort_order: z.coerce.number().int().min(0).max(9999),
  is_published: z.boolean(),
});

export function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "sponsor"
  );
}

/** Accepts any common YouTube URL (or a bare id) and returns the 11-char id. */
export function parseYouTubeId(input: string) {
  const value = input.trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(value)) return value;
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^(www\.|m\.)/, "");
    let id: string | null = null;
    if (host === "youtu.be") id = url.pathname.slice(1).split("/")[0];
    else if (host === "youtube.com" || host === "youtube-nocookie.com") {
      const [, first, second] = url.pathname.split("/");
      id = first === "watch" ? url.searchParams.get("v") : ["embed", "shorts", "live"].includes(first) ? second : null;
    }
    return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}
