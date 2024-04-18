import { styled } from "@/styled-system/jsx";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <styled.article
      className="content"
      display="flex"
      flexDir="column"
      w="full"
      overflow="hidden"
    >
      {children}

      <hr />
    </styled.article>
  );
}
