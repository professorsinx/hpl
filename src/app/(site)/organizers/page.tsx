import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { committee, initials, leadership, type Organizer } from "@/content/organizers";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Organisers",
  description: "Meet the organising committee behind the Healthcare Premier League 2027.",
};

function formatPhone(phone: string) {
  const digits = phone.replace(/^\+91/, "");
  return `${digits.slice(0, 5)} ${digits.slice(5)}`;
}

function OrganizerCard({ person, lead = false }: { person: Organizer; lead?: boolean }) {
  return (
    <li className={lead ? "person-card person-card-lead" : "person-card"}>
      <div className="person-top">
        <span className="person-avatar" aria-hidden="true">{initials(person.name)}</span>
        <div>
          <span className="person-role">{person.role}</span>
          <h3>{person.name}</h3>
        </div>
      </div>
      <p className="person-remit">{person.remit}</p>
      <p className="person-bio">{person.bio}</p>
      <div className="person-contact">
        {person.phone && (
          <a href={`tel:${person.phone}`}>
            <Phone size={14} aria-hidden="true" /> {formatPhone(person.phone)}
          </a>
        )}
        {person.email && (
          <a href={`mailto:${person.email}`}>
            <Mail size={14} aria-hidden="true" /> {person.email}
          </a>
        )}
        {!person.phone && !person.email && <span className="person-pending">Contact details to be announced</span>}
      </div>
    </li>
  );
}

export default function OrganizersPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <PageHero kicker="THE ORGANISING COMMITTEE" title={<>The team <span>behind the league.</span></>}>
        HPL begins as a district tournament with a national ambition. These
        are the people at {site.host} building it, match by match.
      </PageHero>

      <section className="section-wrap page-section" aria-labelledby="leadership-title">
        <header className="tier-head">
          <h2 id="leadership-title">Tournament leadership</h2>
          <p>Setting the direction and running the show.</p>
        </header>
        <ul className="people-grid people-grid-lead">
          {leadership.map((person) => (
            <OrganizerCard key={person.name} person={person} lead />
          ))}
        </ul>
      </section>

      <section className="people-band" aria-labelledby="committee-title">
        <div className="section-wrap">
          <header className="tier-head">
            <h2 id="committee-title">Core committee</h2>
            <p>Sponsorship, branding, finance, digital and tech.</p>
          </header>
          <ul className="people-grid">
            {committee.map((person) => (
              <OrganizerCard key={person.name} person={person} />
            ))}
          </ul>
          <p className="people-note">
            Profiles and contact details on this page are being finalised and will be updated by the committee.
          </p>
        </div>
      </section>
    </main>
  );
}
