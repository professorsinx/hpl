import type { SponsorTier } from "@/types/database";

export const sponsorTiers: { id: SponsorTier; label: string; plural: string; blurb: string }[] = [
  { id: "title", label: "Title sponsor", plural: "Title sponsor", blurb: "The headline partner of HPL 2027." },
  { id: "associate", label: "Associate sponsor", plural: "Associate sponsors", blurb: "Standing beside the league all season." },
  { id: "category", label: "Category sponsor", plural: "Category sponsors", blurb: "Powering a part of every match day." },
  { id: "supporter", label: "Supporter", plural: "Supporters", blurb: "Friends of the league." },
];

export const tierRank = Object.fromEntries(sponsorTiers.map((tier, index) => [tier.id, index])) as Record<SponsorTier, number>;

export function tierLabel(tier: SponsorTier) {
  return sponsorTiers[tierRank[tier]].label;
}
