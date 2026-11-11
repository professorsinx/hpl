export type SponsorTier = "title" | "associate" | "category" | "supporter";

export type Sponsor = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  slug: string;
  tier: SponsorTier;
  tagline: string | null;
  description: string;
  website_url: string | null;
  logo_path: string | null;
  sort_order: number;
  is_published: boolean;
};

export type MediaKind = "photo" | "video";
export type MediaSource = "upload" | "youtube";

export type MediaItem = {
  id: string;
  created_at: string;
  kind: MediaKind;
  source: MediaSource;
  storage_path: string | null;
  youtube_id: string | null;
  title: string | null;
  width: number | null;
  height: number | null;
  sort_order: number;
  is_published: boolean;
};

export type RegistrationStatus = "pending_verification" | "verified" | "rejected";
export type PaymentStatus = "submitted" | "verified" | "failed";

export type Team = {
  id: string;
  created_at: string;
  team_name: string;
  hospital_name: string;
  hospital_address: string | null;
  hospital_logo_path: string | null;
  captain_name: string;
  captain_phone: string;
  captain_email: string;
  vice_captain_name: string;
  vice_captain_phone: string | null;
  registration_status: RegistrationStatus;
  payment_status: PaymentStatus;
  payment_utr: string;
  entry_fee_amount: number;
  admin_notes: string | null;
};

export const BUCKETS = {
  sponsorLogos: "sponsor-logos",
  eventMedia: "event-media",
  hospitalLogos: "hospital-logos",
} as const;

export type Bucket = (typeof BUCKETS)[keyof typeof BUCKETS];
