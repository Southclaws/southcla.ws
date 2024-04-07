import { getContent } from "@/content/content";
import { VStack } from "@/styled-system/jsx";
import { formatDistanceToNow } from "date-fns";
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
    const { content, metadata } = await getContent(props.params.post);

    return (
      <VStack className="typography" w="full" alignItems="start">
        <VStack w="full" alignItems="start" gap="1" pb="6">
          <h1>{metadata.title}</h1>

          <aside>
            <p>{metadata.subtitle}</p>
          </aside>

          <time>
            written{" "}
            {formatDistanceToNow(metadata.timestamp, { addSuffix: true })}
          </time>

          <hr />
        </VStack>

        {content}
      </VStack>
    );
  } catch (e) {
    console.error(e);

    notFound();
  }
}
