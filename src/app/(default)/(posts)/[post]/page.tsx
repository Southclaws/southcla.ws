import { getContent } from "@/content/content";
import { VStack } from "@/styled-system/jsx";
import { notFound } from "next/navigation";

type Props = {
  params: {
    post: string;
  };
};

export default async function Page(props: Props) {
  if (props.params.post === "favicon.ico") {
    // TODO: Figure out why Next.js isn't providing this file before running
    // the route handler.
    return null;
  }

  try {
    const content = await getContent(props.params.post);

    return (
      <VStack className="typography" w="full" alignItems="start">
        <h1>{content.metadata.title}</h1>

        {content.content}
      </VStack>
    );
  } catch (e) {
    console.error(e);

    notFound();
  }
}
