import type { ReactNode } from "react";
import { TriangleAlert } from "lucide-react";

export function PageHead({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <header className="adm-head">
      <div>
        <h1>{title}</h1>
        <p>{children}</p>
      </div>
      {action}
    </header>
  );
}

/** Shown when a table can't be read, which almost always means the migration hasn't been run. */
export function SetupNotice({ detail }: { detail: string }) {
  return (
    <div className="adm-notice" role="alert">
      <TriangleAlert size={18} aria-hidden="true" />
      <div>
        <strong>The database isn&apos;t ready for this screen.</strong>
        <p>
          Run <code>supabase/migrations/20261111000000_cms_and_registration.sql</code> in the Supabase SQL editor, then reload.
        </p>
        <small>{detail}</small>
      </div>
    </div>
  );
}
