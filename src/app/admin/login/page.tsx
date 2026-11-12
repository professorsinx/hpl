import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LogoMark } from "@/components/brand/logos";
import { LoginForm } from "@/components/admin/login-form";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Sign in" };

export default function AdminLoginPage() {
  return (
    <main className="adm-login">
      <div className="adm-login-card">
        <LogoMark id={site.logo} className="adm-login-mark" />
        <span className="adm-kicker">HPL 2027 · ORGANISERS ONLY</span>
        <h1>Sign in to the console</h1>
        <p>Manage sponsors, the photo and video gallery, and team registrations.</p>
        <LoginForm />
        <Link className="adm-back" href="/">
          <ArrowLeft size={15} aria-hidden="true" /> Back to the website
        </Link>
      </div>
    </main>
  );
}
