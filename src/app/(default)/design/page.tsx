import { Box, HStack, VStack, styled } from "@/styled-system/jsx";

export default async function Page() {
  return (
    <Box margin="auto" maxW="prose">
      <VStack gap="0" py="4" alignItems="start">
        <HStack gap="0">
          <Box width="8" height="8" bgColor="accent.50" />
          <Box width="8" height="8" bgColor="accent.100" />
          <Box width="8" height="8" bgColor="accent.200" />
          <Box width="8" height="8" bgColor="accent.300" />
          <Box width="8" height="8" bgColor="accent.400" />
          <Box width="8" height="8" bgColor="accent.500" />
          <Box width="8" height="8" bgColor="accent.600" />
          <Box width="8" height="8" bgColor="accent.700" />
          <Box width="8" height="8" bgColor="accent.800" />
          <Box width="8" height="8" bgColor="accent.900" />
        </HStack>

        <HStack gap="0">
          <Box width="8" height="8" bgColor="offwhite.50" />
          <Box width="8" height="8" bgColor="offwhite.100" />
          <Box width="8" height="8" bgColor="offwhite.200" />
          <Box width="8" height="8" bgColor="offwhite.300" />
          <Box width="8" height="8" bgColor="offwhite.400" />
          <Box width="8" height="8" bgColor="offwhite.500" />
          <Box width="8" height="8" bgColor="offwhite.600" />
          <Box width="8" height="8" bgColor="offwhite.700" />
          <Box width="8" height="8" bgColor="offwhite.800" />
          <Box width="8" height="8" bgColor="offwhite.900" />
        </HStack>

        <HStack gap="0">
          <Box width="8" height="8" bgColor="offblack.50" />
          <Box width="8" height="8" bgColor="offblack.100" />
          <Box width="8" height="8" bgColor="offblack.200" />
          <Box width="8" height="8" bgColor="offblack.300" />
          <Box width="8" height="8" bgColor="offblack.400" />
          <Box width="8" height="8" bgColor="offblack.500" />
          <Box width="8" height="8" bgColor="offblack.600" />
          <Box width="8" height="8" bgColor="offblack.700" />
          <Box width="8" height="8" bgColor="offblack.800" />
          <Box width="8" height="8" bgColor="offblack.900" />
        </HStack>
      </VStack>

      <VStack gap="1" py="4" w="min" textWrap="nowrap">
        <Box p="2" w="full" borderRadius="sm" bgColor="bg" color="fg">
          <span>bg + fg</span>
        </Box>
        <Box p="2" w="full" borderRadius="sm" bgColor="bg" color="fg.muted">
          <span>bg + fg.muted</span>
        </Box>
        <Box p="2" w="full" borderRadius="sm" bgColor="bg.muted" color="fg">
          <span>bg.muted + fg</span>
        </Box>
        <Box
          p="2"
          w="full"
          borderRadius="sm"
          bgColor="bg.muted"
          color="fg.muted"
        >
          <span>bg.muted + fg.muted</span>
        </Box>
      </VStack>

      <article className="typography">
        <styled.h1 mr={{ base: "0", md: "-8" }}>heading level one</styled.h1>
        <h2>heading level two</h2>
        <p>Flygande bäckasiner söka hwila på mjuka tuvor</p>
        <h3>heading level three</h3>
        <p>Jackdaws love my big sphinx of quartz.</p>
        <h4>heading level four</h4>
        <p>Moi, je veux quinze clubs a golf et du whisky pur.</p>
        <h5>heading level five</h5>
        <p>Zwölf Boxkämpfer jagen Victor quer über den großen Sylter Deich.</p>
        <h6>heading level six</h6>
        <p>
          the quick brown fox jumps over the lackadaisical zebra, yes this is
          not an full pangram, but it's unique and that's what matters.
        </p>
      </article>

      <hr />

      <p>
        I'm a bit of a typography <strong>nerd</strong>, I <em>love</em>{" "}
        typefaces and experimenting with letterforms. This is my secret
        playground for testing out the type scales for this website. The
        typeface in use is TASA Orbiter for the headings which was designed by{" "}
        <a href="https://azwz.work/">Weizhong Zhang</a> with{" "}
        <a href="https://localremote.co/">Local Remote</a> for the Taiwan Space
        Agency .
      </p>

      <blockquote>
        Reading is a magical technology, the closest humans have come so far to
        inventing telepathy,
      </blockquote>

      <p>
        here is some <code>code</code>...
      </p>

      <pre>
        if this
        <br />
        then that
        <br />
        otherwise
        <br />
        as you are
        <br />
        return;
        <br />
      </pre>
    </Box>
  );
}
