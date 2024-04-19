import { hedvig, inter, orbiter } from "@/app/fonts";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "barney's tech blog",
  description:
    "I'm a multidisciplinary maker. this site is a never-ending exploration into the details. aka southclaws.",
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
