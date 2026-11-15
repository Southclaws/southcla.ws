import { site } from "@/config";
import { getPosts } from "@/content/content";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();

  return [
    { url: `${site.url}/` },
    ...posts.map(({ slug, metadata }) => ({
      url: `${site.url}/${slug}`,
      lastModified: metadata.timestamp,
    })),
  ];
}
