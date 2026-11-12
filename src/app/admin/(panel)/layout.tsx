import { Suspense } from "react";
import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { signOut } from "@/app/admin/actions";
import { AdminNav } from "@/components/admin/admin-nav";
import { ToastProvider } from "@/components/admin/toast";
import { LogoMark } from "@/components/brand/logos";
import { requireAdmin } from "@/lib/auth";
import { site } from "@/lib/site";

async function SignedInAs() {
  const admin = await requireAdmin();
  return <span className="adm-user" title={admin.email}>{admin.email}</span>;
}

function PanelSkeleton() {
  return (
    <div className="adm-skeleton" aria-busy="true" aria-label="Loading">
      <span /><span /><span />
    </div>
  );
}

export default function PanelLayout({ children }: LayoutProps<"/admin">) {
  return (
    <ToastProvider>
      <div className="adm-shell">
        <aside className="adm-side">
          <Link className="adm-brand" href="/admin">
            <LogoMark id={site.logo} className="adm-brand-mark" />
            <span>
              <strong>HPL 2027</strong>
              <small>Organiser console</small>
            </span>
          </Link>
          <AdminNav />
          <div className="adm-side-foot">
            <Suspense fallback={<span className="adm-user">&nbsp;</span>}>
              <SignedInAs />
            </Suspense>
            <Link href="/" target="_blank" className="adm-side-link">
              <ExternalLink size={15} aria-hidden="true" /> View website
            </Link>
            <form action={signOut}>
              <button type="submit" className="adm-side-link">
                <LogOut size={15} aria-hidden="true" /> Sign out
              </button>
            </form>
          </div>
        </aside>
        <main className="adm-main">
          <Suspense fallback={<PanelSkeleton />}>{children}</Suspense>
        </main>
      </div>
    </ToastProvider>
  );
}
