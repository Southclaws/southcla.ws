import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Inter, Hedvig_Letters_Serif } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const orbiter = localFont({
  src: "./TASAOrbiterVF.woff2",
  preload: true,
  variable: "--font-orbiter",
});

const inter = Inter({
  subsets: ["latin"],
  preload: true,
  variable: "--font-inter",
});

const hedvig = Hedvig_Letters_Serif({
  subsets: ["latin"],
  preload: true,
  variable: "--font-hedvig",
});

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
