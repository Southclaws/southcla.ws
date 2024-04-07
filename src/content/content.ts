import { readFile } from "fs/promises";
import { glob } from "glob";
import { compileMDX } from "next-mdx-remote/rsc";
import path from "path";
import { cwd } from "process";
import { z } from "zod";
import { useMDXComponents } from "./mdx-components";

export type Post = PostReference & {
  content: any;
};

export type PostReference = {
  metadata: Metadata;
  slug: string;
};

export type Metadata = Frontmatter & {
  timestamp: Date;
};

export const FrontmatterSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  hero: z.string().optional(),
});
export type Frontmatter = z.infer<typeof FrontmatterSchema>;

export async function getContent(slug: string): Promise<Post> {
  const root = path.join(cwd(), "pages");
  const filenamePattern = `* ${slug}.md`;
  const filepathPattern = path.join(root, filenamePattern);

  const results = await glob(filepathPattern);

  if (results.length !== 1) {
    throw new Error(`Unable to find file with pattern ${filenamePattern}`);
  }

  const filepath = path.parse(results[0]);
  const filename = filepath.base;
  const fullpath = path.join(root, filename);

  const { timestamp } = splitFilename(filename);

  const source = await readFile(fullpath);

  const { content, frontmatter } = await compileMDX({
    source,
    options: {
      parseFrontmatter: true,
    },
    components: useMDXComponents({}),
  });

  const postmeta = FrontmatterSchema.parse(frontmatter);

  const metadata = {
    ...postmeta,
    timestamp,
  } satisfies Metadata;

  return { content, metadata, slug };
}

export async function getPosts(): Promise<PostReference[]> {
  const paths = await glob("./pages/*.md");

  const posts = await Promise.all(
    paths.map(async (file) => {
      const filename = path.parse(file).name;
      const { name } = splitFilename(filename);

      const { slug, metadata } = await getContent(name);

      return { metadata, slug } satisfies PostReference;
    })
  );

  return posts;
}

// Expects a full file name, not a slug. Including the extension: ".md"
function splitFilename(filename: string) {
  const [date, name] = filename.split(" ");
  const timestamp = new Date(date);

  return { name, timestamp };
}
