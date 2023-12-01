import { styled } from "@/styled-system/jsx";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <styled.article display="flex" flexDir="column" gap="2">
      <Link className="link" href="/">
        &larr;&nbsp;Back
      </Link>

      {children}
    </styled.article>
  );
}
