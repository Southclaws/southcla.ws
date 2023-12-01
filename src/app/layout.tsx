import type { Metadata } from "next";
import { Inter } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Barney",
  description: "Multidisciplinary maker",
  metadataBase: new URL("https://barney.is"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${orbiter.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
