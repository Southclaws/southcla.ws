import { styled } from "@/styled-system/jsx";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <styled.article
      className="content"
      display="flex"
      flexDir="column"
      w="full"
      overflow="hidden"
    >
      <Link className="link" href="/">
        &larr;&nbsp;Back
      </Link>

      {children}

      <hr />
    </styled.article>
  );
}
