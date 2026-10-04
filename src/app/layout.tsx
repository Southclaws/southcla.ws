import { hedvig, inter, orbiter } from "@/app/fonts";
import { site } from "@/config";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  metadataBase: new URL(site.url),
  alternates: {
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${orbiter.variable} ${inter.variable} ${hedvig.variable}`}
    >
      <body>{children}</body>
      <Analytics />
    </html>
  );
}
