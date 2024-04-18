import type { Metadata } from "./content";

const URL = process.env["VERCEL_URL"] ?? "http://localhost:3000";

export async function getPostMetadata(slug: string): Promise<Metadata> {
  const response = await fetch(`${URL}/meta?slug=${slug}`);
  const metadata = (await response.json()) as Metadata;

  return {
    ...metadata,
    hero: metadata.hero ? `${URL}${metadata.hero}` : undefined,
  };
}
