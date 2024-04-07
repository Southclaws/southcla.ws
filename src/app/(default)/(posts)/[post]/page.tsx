import { getContent } from "@/content/content";
import { VStack } from "@/styled-system/jsx";

type Props = {
  params: {
    post: string;
  };
};

export default async function Page(props: Props) {
  const content = await getContent(props.params.post);

  return (
    <VStack>
      <h1>{content.metadata.title}</h1>

      {content.content}
    </VStack>
  );
}
