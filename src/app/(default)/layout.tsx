import { Box, VStack, styled } from "@/styled-system/jsx";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

import "../code-dark.css";
import "../code-light.css";

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
          <Header />
          <styled.main w="full">{children}</styled.main>
        </VStack>

        <Footer />
      </Box>
    </Box>
  );
}
