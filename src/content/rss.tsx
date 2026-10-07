import { getExtendedAttributes } from "@/components/Media";
import { site } from "@/config";
import { getContent, getPosts } from "./content";
import type { MDXComponents } from "mdx/types";

function absoluteURL(value: string, base = `${site.url}/`) {
  // Markdown sometimes uses filesystem paths into public/.
  return new URL(value.replace(/^(?:\.\/)?public\//, "/"), base).href;
}

function escapeXML(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function getRSS() {
  const { renderToStaticMarkup } = await import("react-dom/server");
  const posts = (await getPosts()).sort(
    (a, b) => b.metadata.timestamp.getTime() - a.metadata.timestamp.getTime(),
  );

  const items = await Promise.all(
    posts.map(async ({ slug }) => {
      const url = absoluteURL(slug);
      const components: MDXComponents = {
        a: ({ href, ...props }) => (
          <a {...props} href={href ? absoluteURL(href, url) : undefined} />
        ),
        p: ({ children, ...props }) => (
          <p {...props}>
            {typeof children === "string" &&
            /^https?:\/\/\S+$/.test(children) ? (
              <a href={children}>{children}</a>
            ) : (
              children
            )}
          </p>
        ),
        img: ({ src, alt = "", ...props }) => {
          const { caption } = getExtendedAttributes(alt);
          return (
            <span>
              <img
                {...props}
                loading="lazy"
                src={src ? absoluteURL(src) : undefined}
                alt={caption ?? alt}
              />
              {caption && (
                <>
                  <br />
                  <em>{caption}</em>
                </>
              )}
            </span>
          );
        },
      };
      const { content, metadata } = await getContent(slug, components);
      // Literal JSX video tags bypass MDX component overrides.
      const html = renderToStaticMarkup(content).replace(
        /<video\b[^>]*>[\s\S]*?<\/video>/g,
        `<a href="${escapeXML(url)}">Watch this video on the blog</a>`,
      );

      return `<item>
<title>${escapeXML(metadata.title)}</title>
<link>${escapeXML(url)}</link>
<guid isPermaLink="true">${escapeXML(url)}</guid>
<pubDate>${metadata.timestamp.toUTCString()}</pubDate>
<description>${escapeXML(html)}</description>
</item>`;
    }),
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${escapeXML(site.title)}</title>
<link>${site.url}</link>
<description>${escapeXML(site.description)}</description>
<language>en</language>
<atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml" />
${items.join("\n")}
</channel>
</rss>`;
}
