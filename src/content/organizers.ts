/**
 * Organising committee. Names and roles are as confirmed by the committee;
 * every `bio`, and any contact marked `placeholder`, is dummy copy to be
 * replaced before launch.
 */

export type Organizer = {
  role: string;
  name: string;
  /** One line on what this person owns for the tournament. */
  remit: string;
  bio: string;
  phone?: string;
  email?: string;
  /** True while the details shown are stand-ins. */
  placeholder?: boolean;
};

export const leadership: Organizer[] = [
  {
    role: "Tournament Chairman",
    name: "Dr GGR",
    remit: "Vision, patron and guest relations",
    bio: "Sets the direction for HPL and champions its World Cancer Day cause across Trichy's healthcare community.",
    phone: "+919363112508",
  },
  {
    role: "Tournament Director",
    name: "ARA",
    remit: "Overall planning and final decisions",
    bio: "Runs the tournament end to end, from the first fixture draft to the final presentation ceremony.",
    email: "rajuarumugham@gmail.com",
  },
  {
    role: "Organising Secretary",
    name: "Dr Banu Chander",
    remit: "Registrations and hospital coordination",
    bio: "The single point of contact for every participating hospital, from team entry to match-day queries.",
    phone: "+917373731008",
  },
];

export const committee: Organizer[] = [
  {
    role: "Sponsorship SPOC",
    name: "Dr Harshavardhanan",
    remit: "Sponsor partnerships",
    bio: "Leads sponsor outreach and makes sure every partner's support is seen on and off the field.",
    placeholder: true,
  },
  {
    role: "Branding Champ",
    name: "G.S Mithravadhana",
    remit: "Identity, jerseys and match-day look",
    bio: "Owns how HPL looks and feels, from the crest and jerseys to banners, trophies and certificates.",
    placeholder: true,
  },
  {
    role: "Tournament Treasurer",
    name: "Geetha",
    remit: "Budget, entry fees and accounts",
    bio: "Keeps the books: entry fees, sponsor funds, receipts and the final statement of accounts.",
    placeholder: true,
  },
  {
    role: "Digital Team",
    name: "Yuvaraj",
    remit: "Website and online registration",
    bio: "Builds and runs the HPL website, online registration and the digital side of match day.",
    placeholder: true,
  },
  {
    role: "Digital Team",
    name: "Thiru",
    remit: "Social media and live updates",
    bio: "Brings the league to your phone with scores, stories and highlights through the season.",
    placeholder: true,
  },
  {
    role: "Tech Support",
    name: "Sivaramakrishnan",
    remit: "Systems and on-ground tech",
    bio: "Keeps scoring, displays and every match-day system running without a hitch.",
    placeholder: true,
  },
];

export function initials(name: string) {
  const parts = name.replace(/\./g, " ").split(/\s+/).filter(Boolean);
  const meaningful = parts.filter((part) => !/^dr$/i.test(part));
  const source = meaningful.length ? meaningful : parts;
  if (source.length === 1) return source[0].slice(0, 2).toUpperCase();
  return (source[0][0] + source[source.length - 1][0]).toUpperCase();
}
