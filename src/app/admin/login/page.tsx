import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function AdminLoginPage() {
  return (
    <main className="adm-login">
      <div className="adm-login-card">
        <span className="adm-login-mark">
          <Image src="/images/hpl-logo.jpeg" alt="" width={72} height={72} priority />
        </span>
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
