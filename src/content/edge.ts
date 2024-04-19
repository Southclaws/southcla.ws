import config from "@/config";
import type { Metadata } from "./content";

const { baseURL } = config;

export async function getPostMetadata(slug: string): Promise<Metadata> {
  const response = await fetch(`${baseURL}/meta?slug=${slug}`);
  const metadata = (await response.json()) as Metadata;

  return {
    ...metadata,
    hero: metadata.hero ? `${baseURL}${metadata.hero}` : undefined,
  };
}
