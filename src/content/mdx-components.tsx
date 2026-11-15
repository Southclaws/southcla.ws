"use server";

import { LinkCard } from "@/components/LinkCard";
import { Media } from "@/components/Media";
import { toHtml } from "hast-util-to-html";
import type { MDXComponents } from "mdx/types";
import React, { ReactElement } from "react";
import { refractor } from "refractor";
import css from "refractor/css";
import go from "refractor/go";
import tsx from "refractor/tsx";

refractor.register(css);
refractor.register(tsx);
refractor.register(go);

const allLanguages = Object.fromEntries(
  refractor.listLanguages().map((v) => [v, true]),
);

export async function getMDXComponents(
  components: MDXComponents,
): Promise<MDXComponents> {
  return {
    pre: ({ children, ...props }) => {
      const childProps = children as ReactElement<{
        children: string;
        className?: string;
      }>;
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
    img: ({ src, alt }) => (
      <Media src={typeof src === "string" ? src : undefined} alt={alt} />
    ),
    p: async (props) => {
      // Images render as block-level figures, which are not allowed inside a
      // <p>: the browser would restructure the HTML and break hydration.
      const hasMedia = React.Children.toArray(props.children).some(
        (child) =>
          React.isValidElement<{ src?: unknown }>(child) &&
          typeof child.props.src === "string",
      );
      if (hasMedia) return <>{props.children}</>;

      try {
        if (React.Children.count(props.children) === 1) {
          const s = React.Children.toArray(props.children)[0]?.toString();

          const parsed = new URL(s);

          return <LinkCard url={parsed.href} />;
        }
      } catch {}

      return <p {...props} />;
    },
    ...components,
  };
}
