"use server";

import { LinkCard } from "@/components/LinkCard/LinkCard";
import { Media } from "@/components/Media";
import { toHtml } from "hast-util-to-html";
import type { MDXComponents } from "mdx/types";
import ogs from "open-graph-scraper-lite";
import React, { ReactElement } from "react";
import { refractor } from "refractor";
import css from "refractor/lang/css.js";
import go from "refractor/lang/go";
import tsx from "refractor/lang/tsx";

refractor.register(css);
refractor.register(tsx);
refractor.register(go);

const allLanguages = Object.fromEntries(
  refractor.listLanguages().map((v) => [v, true])
);

export async function useMDXComponents(
  components: MDXComponents
): Promise<MDXComponents> {
  return {
    pre: ({ children, ...props }) => {
      const childProps = children as ReactElement;
      const content = childProps.props.children;
      const className = childProps.props["className"];
      const language = className?.replace("language-", "") ?? "";

      if (language && allLanguages[language]) {
        const tree = refractor.highlight(content, language);
        const html = toHtml(tree as any);
        return (
          <pre {...props} className={`language-${language}`}>
            <code dangerouslySetInnerHTML={{ __html: html }} />
          </pre>
        );
      }

      return (
        <pre className="language-none" {...props}>
          {children}
        </pre>
      );
    },
    a: (props) => <a target="_blank" {...props} />,
    code: (props) => <code>{props.children}</code>,
    img: (props) => <Media {...props} />,
    p: async (props) => {
      try {
        if (React.Children.count(props.children) === 1) {
          const s = React.Children.toArray(props.children)[0]?.toString();

          const parsed = new URL(s);
          const response = await fetch(parsed.href);

          const link = await ogs({
            html: await response.text(),
          });

          return (
            <LinkCard
              url={parsed.href}
              title={link.result.ogTitle}
              description={link.result.ogDescription}
              image={link.result.ogImage?.[0].url}
            />
          );
        }
      } catch {}

      return <p {...props} />;
    },
    ...components,
  };
}
