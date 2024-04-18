import { Box, VStack, styled } from "@/styled-system/jsx";

import "../code-dark.css";
import "../code-light.css";

const HeaderGroup = styled("hgroup", {
  base: {
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    gap: "headerGroup",
    mb: { base: "8", md: "4" },
  },
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      display="flex"
      flexDir="column"
      alignItems="center"
      height="full"
      width="full"
      minH="dvh"
      p="sm.fluid"
    >
      <Box
        flex="1"
        display="flex"
        flexDir="column"
        justifyContent="space-between"
        gap="4"
        width="full"
        maxW="breakpoint-md"
        p="sm.fluid"
      >
        <VStack alignItems="start">
          <header>
            <HeaderGroup>
              <styled.h1 fontSize="header" color="fg" lineHeight="headerGroup">
                southclaws
              </styled.h1>
              <styled.p ml="0.5" color="fg.muted">
                barnaby keene •{" "}
                <a href="https://twitter.com/southclaws">@southclaws</a>
              </styled.p>
            </HeaderGroup>
          </header>

          <styled.main w="full">{children}</styled.main>
        </VStack>

        <footer>
          <styled.p fontSize="xs">
            designed while sat in the barbican on saturday the twenty third of
            september two thousand twenty three. email me at hey.com, my
            username is barney.
          </styled.p>
        </footer>
      </Box>
    </Box>
  );
}
