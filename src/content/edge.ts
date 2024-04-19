"use server";

import { getBaseURL } from "@/config";
import type { Metadata } from "./content";
import { headers } from "next/headers";

export async function getPostMetadata(slug: string): Promise<Metadata> {
  const host = headers().get("host") ?? "localhost:3000";
  const baseURL = getBaseURL(host);
  const response = await fetch(`${baseURL}/meta?slug=${slug}`);

  const metadata = (await response.json()) as Metadata;

  return {
    ...metadata,
    hero: metadata.hero ? `${baseURL}${metadata.hero}` : undefined,
  };
}
