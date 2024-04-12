import { Box, styled } from "@/styled-system/jsx";

type Props = {
  url: string;
  title?: string;
  description?: string;
  image?: string;
};

export function LinkCard(props: Props) {
  return (
    <Box
      width="full"
      bgColor="bg.muted"
      borderRadius="md"
      p="2"
      boxShadow="sm"
      my="8"
    >
      <styled.h1 fontSize="heading6">
        <a href={props.url}>{props.title}</a>
      </styled.h1>

      <styled.h2
        fontSize="body"
        fontWeight="medium"
        color="fg.muted"
        lineClamp={1}
      >
        {props.url}
      </styled.h2>

      {props.description && (
        <styled.p lineClamp={1}>{props.description}</styled.p>
      )}
    </Box>
  );
}
