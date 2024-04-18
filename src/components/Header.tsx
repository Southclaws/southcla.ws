import { styled } from "@/styled-system/jsx";

import { css } from "@/styled-system/css";
import { hstack } from "@/styled-system/patterns";
import Link from "next/link";

const Title = styled("h1", {
  base: {
    fontSize: "header",
    color: "fg",
    lineHeight: "headerGroup",
  },
});

const homeAnchor = css({
  color: "fg",
  _hover: {
    textDecoration: "none",
    color: "fg.muted",
  },
});

const HeaderGroup = styled("hgroup", {
  base: {
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    gap: "headerGroup",
    mb: { base: "2", md: "4" },
  },
});

export function Header() {
  return (
    <styled.header
      className={hstack({
        justify: "space-between",
      })}
    >
      <HeaderGroup>
        <Title>
          <Link className={homeAnchor} href="/" title="Home page">
            southclaws
          </Link>
        </Title>
        <styled.p ml="0.5" mb="0" color="fg.muted">
          <a
            href="https://www.linkedin.com/in/southclaws/"
            title="My Linkedin profile"
          >
            barnaby keene
          </a>
          &nbsp;•&nbsp;
          <a href="https://twitter.com/southclaws" title="My Twitter profile">
            @southclaws
          </a>
        </styled.p>
      </HeaderGroup>
    </styled.header>
  );
}
