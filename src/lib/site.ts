/**
 * Single source of truth for tournament facts that appear in more than one
 * place. Change a date or the fee here and every page follows.
 */

import type { LogoId } from "@/components/brand/logos";
import type { SceneId } from "@/components/scenes";

export const site = {
  name: "HPL 2027",
  fullName: "Healthcare Premier League",
  tagline: "Beyond hospitals. United by cricket.",
  host: "Harshamitra Hospital",
  hostAddress: "Nagamangalam, Trichy",
  /** Add the hospital's website here to turn its name into a link. */
  hostUrl: "",
  city: "Trichy, Tamil Nadu",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  /**
   * The animated scene shown in the home page hero. Preview all four at
   * /animations and set the winner here.
   */
  heroScene: "cover-drive" as SceneId,

  /**
   * The logo used in the header, footer, hero badge and organiser console.
   * Preview the options at /logos. "original" restores the metallic crest.
   */
  logo: "ribbon-bat" as LogoId,

  entryFee: 10_000,

  registration: {
    // IST (UTC+05:30). Closing is inclusive of the whole of 15 January.
    opensAt: "2026-11-14T00:00:00+05:30",
    closesAt: "2027-01-15T23:59:59+05:30",
    opensLabel: "14 November 2026",
    closesLabel: "15 January 2027",
  },

  payment: {
    upiId: process.env.NEXT_PUBLIC_UPI_ID ?? "",
    payeeName: process.env.NEXT_PUBLIC_UPI_PAYEE_NAME ?? "HPL 2027",
  },

  contacts: {
    registration: { name: "Dr Banuchandar", phone: "+917373731008", display: "73737 31008" },
    chairman: { name: "Dr GGR", phone: "+919363112508", display: "93631 12508" },
    director: { name: "Raju Arumugham (Ara)", email: "rajuarumugham@gmail.com" },
  },
} as const;

export const navLinks = [
  { href: "/#tournament", label: "Tournament" },
  { href: "/#eligibility", label: "Who can play" },
  { href: "/#dates", label: "Key dates" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/organizers", label: "Organisers" },
  { href: "/gallery", label: "Gallery" },
] as const;

export type RegistrationPhase = "upcoming" | "open" | "closed";

/**
 * Where we are in the registration window. Outside production the window is
 * always treated as open so the flow can be tested at any time.
 */
export function registrationPhase(now: number): RegistrationPhase {
  if (process.env.NODE_ENV !== "production") return "open";
  if (now < Date.parse(site.registration.opensAt)) return "upcoming";
  if (now > Date.parse(site.registration.closesAt)) return "closed";
  return "open";
}

export const isPreviewRegistration = process.env.NODE_ENV !== "production";

export function formatInr(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

/** NPCI deep link understood by every UPI app (GPay, PhonePe, Paytm, BHIM…). */
export function upiPayLink({ note }: { note: string }) {
  const { upiId, payeeName } = site.payment;
  if (!upiId) return null;
  const params = new URLSearchParams({
    pa: upiId,
    pn: payeeName,
    am: site.entryFee.toFixed(2),
    cu: "INR",
    tn: note.slice(0, 60),
  });
  // UPI apps expect %20 rather than "+" for spaces.
  return `upi://pay?${params.toString().replace(/\+/g, "%20")}`;
}
