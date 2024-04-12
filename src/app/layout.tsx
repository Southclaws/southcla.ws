import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import "./globals.css";
import { hedvig, inter, orbiter } from "@/app/fonts";

export const metadata: Metadata = {
  title: "barney's tech blog | southclaws",
  description:
    "multidisciplinary maker | this site is a never-ending exploration into the details",
  metadataBase: new URL("https://southcla.ws"),
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
