import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { navLinks, site } from "@/lib/site";
import { Brand } from "./brand";

export function SiteFooter() {
  const { chairman, registration, director } = site.contacts;
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-about">
          <Brand footer />
          <p>
            An inter-hospital tennis-ball cricket league and World Cancer Day
            tribute, organised by {site.host}, {site.hostAddress}.
          </p>
        </div>
        <nav className="footer-column" aria-label="Footer navigation">
          <h2>Explore</h2>
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="footer-column">
          <h2>Contact</h2>
          <a href={`tel:${registration.phone}`}>
            <Phone size={14} aria-hidden="true" /> Registration · {registration.display}
          </a>
          <a href={`tel:${chairman.phone}`}>
            <Phone size={14} aria-hidden="true" /> Chairman · {chairman.display}
          </a>
          <a href={`mailto:${director.email}`}>
            <Mail size={14} aria-hidden="true" /> {director.email}
          </a>
        </div>
      </div>
      <div className="footer-base">
        <span>© {site.name} · {site.fullName}</span>
        <Link href="/admin">Organiser login</Link>
      </div>
    </footer>
  );
}
