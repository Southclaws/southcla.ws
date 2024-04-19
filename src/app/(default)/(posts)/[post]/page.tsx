import { getContent } from "@/content/content";
import { VStack, styled } from "@/styled-system/jsx";
import { formatDistanceToNow } from "date-fns";
import { notFound } from "next/navigation";

type Props = {
  params: {
    post: string;
  };
};

export async function generateMetadata(props: Props) {
  try {
    const { metadata } = await getContent(props.params.post);
    return {
      title: `${metadata.title} | barney's tech blog`,
      description: metadata.subtitle,
    };
  } catch (_) {
    return undefined;
  }
}

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
          <styled.h1 textWrap="balance">{metadata.title}</styled.h1>

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
