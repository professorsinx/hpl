import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="status-page">
      <span className="section-kicker">404 · WIDE OF THE CREASE</span>
      <h1>That one got past <span>the keeper.</span></h1>
      <p>The page you&apos;re looking for has moved or never existed.</p>
      <Link className="button button-lime" href="/">
        Back to HPL 2027 <ArrowRight size={17} aria-hidden="true" />
      </Link>
    </main>
  );
}
