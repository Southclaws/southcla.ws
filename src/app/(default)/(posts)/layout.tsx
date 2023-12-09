import { styled } from "@/styled-system/jsx";
import Link from "next/link";
import "./article.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <styled.article className="content" display="flex" flexDir="column" gap="8">
      <Link className="link" href="/">
        &larr;&nbsp;Back
      </Link>

      {children}
    </styled.article>
  );
}
