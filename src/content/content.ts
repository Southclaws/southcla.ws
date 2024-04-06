import { readFile } from "fs/promises";
import { glob } from "glob";
import { compileMDX } from "next-mdx-remote/rsc";
import path from "path";
import { cwd } from "process";
import { z } from "zod";

type Post = {
  metadata: Frontmatter;
  slug: string;
};

export type PageParameters = {
  slug: string;
};

export type ContentPageProps = {
  params: PageParameters;
  searchParams: Record<string, string | string[]>;
};

export const FrontmatterSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  date: z.date(),
});
export type Frontmatter = z.infer<typeof FrontmatterSchema>;

export async function getContent(slug: string) {
  const source = await readFile(
    path.join(cwd(), "pages", slug ?? "index") + ".md",
    "utf-8"
  );

  const { content, frontmatter } = await compileMDX({
    source,
    options: {
      parseFrontmatter: true,
    },
    components: {},
  });

  const metadata = FrontmatterSchema.parse(frontmatter);

  return { content, metadata };
}

export async function getPosts() {
  const paths = await glob("./pages/*.md");

  const posts = await Promise.all(
    paths.map(async (file) => {
      const slug = path.parse(file).name;
      const { metadata } = await getContent(slug);

      return { metadata, slug };
    })
  );

  console.log(paths, posts);

  return posts;
}
