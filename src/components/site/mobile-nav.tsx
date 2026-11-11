"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog } from "@base-ui/react/dialog";
import { ArrowRight, Menu, X } from "lucide-react";
import { navLinks } from "@/lib/site";
import { useRegistration } from "@/components/registration/registration-provider";

/** Slide-down menu for small screens, with focus trapping and Esc to close. */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { openRegistration } = useRegistration();

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="menu-button" aria-label="Open menu">
        <Menu size={20} aria-hidden="true" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="menu-backdrop" />
        <Dialog.Popup className="menu-sheet">
          <div className="menu-sheet-head">
            <Dialog.Title className="menu-sheet-title">Menu</Dialog.Title>
            <Dialog.Close className="menu-button" aria-label="Close menu">
              <X size={20} aria-hidden="true" />
            </Dialog.Close>
          </div>
          <nav aria-label="Mobile navigation" className="menu-links">
            <Link href="/" onClick={() => setOpen(false)} aria-current={pathname === "/" ? "page" : undefined}>
              Home
            </Link>
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setOpen(false)} aria-current={href === pathname ? "page" : undefined}>
                {label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            className="button button-lime menu-cta"
            onClick={() => {
              setOpen(false);
              openRegistration();
            }}
          >
            Register your team <ArrowRight size={17} aria-hidden="true" />
          </button>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
