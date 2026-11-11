import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";
import "@/styles/ui.css";
import "@/styles/pages.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description =
  "Beyond hospitals. United by cricket. Join Trichy's inter-hospital tennis-ball cricket league and World Cancer Day tribute, starting 4 February 2027.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.fullName}`,
    template: `%s | ${site.name}`,
  },
  description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: `${site.name} · ${site.fullName}`,
    title: `${site.name} | ${site.fullName}`,
    description,
    locale: "en_IN",
    images: [{ url: "/images/hpl-logo.jpeg", width: 1024, height: 501, alt: "Healthcare Premier League 2027 crest" }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0c211d",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
