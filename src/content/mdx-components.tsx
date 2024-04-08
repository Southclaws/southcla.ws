import { toHtml } from "hast-util-to-html";
import type { MDXComponents } from "mdx/types";
import { ReactElement } from "react";
import { refractor } from "refractor";
import css from "refractor/lang/css.js";
import tsx from "refractor/lang/tsx";
import go from "refractor/lang/go";

refractor.register(css);
refractor.register(tsx);
refractor.register(go);

const allLanguages = Object.fromEntries(
  refractor.listLanguages().map((v) => [v, true])
);

export function useMDXComponents(components: MDXComponents): MDXComponents {
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
    ...components,
  };
}
