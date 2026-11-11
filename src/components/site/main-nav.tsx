"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/site";

/** Desktop navigation. Marks the current page for assistive tech and styling. */
export function MainNav() {
  const pathname = usePathname();
  return (
    <nav className="main-nav" aria-label="Main navigation">
      {navLinks.map(({ href, label }) => (
        <Link key={href} href={href} aria-current={href === pathname ? "page" : undefined}>
          {label}
        </Link>
      ))}
    </nav>
  );
}
