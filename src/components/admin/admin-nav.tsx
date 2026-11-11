"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, Handshake, Images, LayoutDashboard } from "lucide-react";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/registrations", label: "Registrations", icon: ClipboardList },
  { href: "/admin/sponsors", label: "Sponsors", icon: Handshake },
  { href: "/admin/media", label: "Photos & videos", icon: Images },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="adm-nav" aria-label="Console">
      {links.map(({ href, label, icon: Icon }) => (
        <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}>
          <Icon size={17} aria-hidden="true" />
          {label}
        </Link>
      ))}
    </nav>
  );
}
