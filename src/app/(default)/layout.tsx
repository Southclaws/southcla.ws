import { Box, VStack, styled } from "@/styled-system/jsx";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Box maxW="breakpoint-md" p="md.fluid" height="full" mx="auto">
      <Box
        display="flex"
        flexDir="column"
        justifyContent="space-between"
        gap="4"
        height="full"
        marginX="auto"
        background="outline"
        p="md.fluid"
      >
        <VStack alignItems="start">
          <header>
            <styled.hgroup mb={{ base: "8", md: "4" }}>
              <styled.h1 fontSize="header" color="fg">
                southclaws
              </styled.h1>
              <styled.p ml="0.5" color="fg.muted">
                barnaby keene • @southclaws
              </styled.p>
            </styled.hgroup>
          </header>

          <styled.main maxW="full">{children}</styled.main>
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
