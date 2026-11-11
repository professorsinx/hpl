import type { Metadata } from "next";
import "@/styles/admin.css";

export const metadata: Metadata = {
  title: { default: "Organiser console", template: "%s · HPL organiser console" },
  robots: { index: false, follow: false },
};

// Every admin screen waits on the session, so none of it can be prefetched as
// an instant shell. Opt the whole area out of instant-navigation validation.
export const instant = false;

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <div className="adm">{children}</div>;
}
