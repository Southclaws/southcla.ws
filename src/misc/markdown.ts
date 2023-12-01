import { POST_METADATA } from "@/app/(default)/(posts)/meta";
import { glob } from "glob";
import { z } from "zod";

const FRONTMATTER_PATTERN = /\{\/\*\n(.*)\n\*\/\}/gms;

const FrontmatterSchema = z.object({
  title: z.string(),
  date: z.string().datetime(),
});
export type Frontmatter = z.infer<typeof FrontmatterSchema>;

type Post = {
  meta: Frontmatter;
  path: string;
};

export async function getPosts() {
  const paths = await glob("./src/app/**/*.mdx");

  const split = paths.map((file): Post => {
    const path = file // strip leading and trailing part of filepath to get the actual URL path.
      .replace("src/app/(default)/(posts)/", "")
      .replace("/page.mdx", "");

    const meta = POST_METADATA[path];

    return { path, meta };
  });

  // none of this works because of next.js bugs lmao
  //   const posts = paths.map((v) => {
  //     try {
  //       return processPost(v);
  //     } catch (e) {
  //       console.debug("Failed to process post", v, e);
  //       return {
  //         path: v,
  //       };
  //     }
  //   });

  return split;
}

// function processPost(v: string): Post {
//   const bytes = readFileSync(v).toString();
//   const capture = FRONTMATTER_PATTERN.exec(bytes);

//   console.log({ v, bytes, capture });

//   const text = capture?.[1];
//   const obj = parse(text ?? "");

//   const meta = FrontmatterSchema.parse(obj);

//   return { meta, path };
// }
