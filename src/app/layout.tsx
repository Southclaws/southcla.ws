import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import "./globals.css";
import { hedvig, inter, orbiter } from "@/app/fonts";
import config from "@/config";

export const metadata: Metadata = {
  title: "barney's tech blog",
  description:
    "I'm a multidisciplinary maker. this site is a never-ending exploration into the details. aka southclaws.",
  metadataBase: new URL(config.baseURL),
};

console.log("using base url", metadata.metadataBase?.toString());

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
