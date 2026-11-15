---
title: How to read Markdown frontmatter in Next.js edge functions
subtitle: Working around `Can't resolve 'fs/promises'` while trying to read Markdown files from Next.js "opengraph-image" files.
hero: "/images/southclaws_seagulls_in_the_sky_0c75b4fb-ace4-4e79-a3bd-216c0fde2cf6.png"
---

`
This blog, like many others, is built on simple Markdown files. It's also built with Next.js which makes certain things really easy to achieve.

One of those things is opengraph meta images. These things:

![2024-04-19-15-35-33](/images/2024-04-19-15-35-33.png)

Where obviously I want to source that data from the posts themselves - the frontmatter at the top:

```yaml
---
title: Fluid typography kerning in CSS
subtitle: Taking fluid typography one step further by meticulously controlling kerning pairs.
hero: /images/southclaws_purple_and_blue_mountain_scenery_behind_the_screen_i_31127cb3-ef1a-4226-8b16-15d10328e4f2.png
---
```

Now for the text metadata, it's quite simple:

```ts
export async function generateMetadata(props: Props) {
  try {
    const { metadata } = await getContent(props.params.post);
    return {
      title: `${metadata.title} | barney's tech blog`,
      description: metadata.subtitle,
    };
  } catch (_) {
    return undefined;
  }
}
```

You can browse the code [here](<https://github.com/Southclaws/southcla.ws/blob/321bf7088f58b8e2fc3c4cb9dd43007afb689a78/src/app/(default)/(posts)/%5Bpost%5D/page.tsx#L12-L22>)

What `getContent` does is quite simple:

- reads the markdown file
- parses it using [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote)

Now I wanted to grab the title and hero image to use in the [opengraph-image file](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image) which should be simple, call `getContent(props.params.post)` with the slug extracted from the request, get the title/image and use those with [Satori](https://github.com/vercel/satori/) to generate an image.

```ts
export default async function Image(props: Props) {
  const { metadata } = await getContent(props.params.post);
```

But when I tried this, I saw:

```
Module not found: Can't resolve 'fs/promises'
> 1 | import { readFile } from "fs/promises";
    | ^
  2 | import { glob } from "glob";
  3 | import { compileMDX } from "next-mdx-remote/rsc";
  4 | import path from "path";
```

Of course, the images are running in an "edge" context, meaning they will be deployed to serverless functions which is a slightly different environment to regular Node.js code and there are [quite a few APIs missing](https://edge-runtime.vercel.app/features/available-apis#unsupported-apis). Notably this:

> Native Node.js APIs are not supported. For example, you can't read or write to the filesystem

And of course my `getContent` function uses a file read API which is not available in this environment.

## Opt out of Edge

One way to avoid this is to simply opt out of using edge compute to render opengraph images. That's a simple solution:

```ts
export const runtime = "nodejs";
```

However, I wanted to keep using edge compute for this as it does cost less and those images are generated and cached closer to readers, resulting in a faster load time.

## Getting creative

I didn't want to write a whole new approach to reading the file etc, it _is_ possible via `fetch` and `import.meta.url` in theory but the way my blog is set up, I don't know the exact file name in advance due to how I'm storing the date in the filename. So this isn't ideal.

Instead, I wrote a simple API endpoint [`/meta?slug=the-post-slug`](https://github.com/Southclaws/southcla.ws/blob/321bf7088f58b8e2fc3c4cb9dd43007afb689a78/src/app/meta/route.ts#L10) which just calls `getContent` and uses the regular Node.js file system APIs that I already have.

Then, when the [opengraph-image handler](<https://github.com/Southclaws/southcla.ws/blob/321bf7088f58b8e2fc3c4cb9dd43007afb689a78/src/app/(default)/(posts)/%5Bpost%5D/opengraph-image.tsx#L29>) is hit, it simply [makes a `fetch` call](https://github.com/Southclaws/southcla.ws/blob/321bf7088f58b8e2fc3c4cb9dd43007afb689a78/src/content/edge.ts#L10) to this endpoint to get the metadata.

---

Next.js is really amazing, the ability to throw these building blocks together and end up with a site that is performant is powerful.
