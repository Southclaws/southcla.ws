import { getContent, getPosts } from "@/content/content";
import { VStack, styled } from "@/styled-system/jsx";
import { formatDistanceToNow } from "date-fns";
import { Metadata } from "next";

type Props = {
  params: Promise<{
    post: string;
  }>;
};

// Posts are prerendered at build time and re-rendered in the background at
// most hourly, which keeps the relative "written ... ago" dates fresh.
export const revalidate = 3600;
export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map(({ slug }) => ({ post: slug }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { post } = await props.params;
  const { metadata } = await getContent(post);

  return {
    title: `${metadata.title} | barney's tech blog`,
    description: metadata.subtitle,
  };
}

export default async function Page(props: Props) {
  const { post } = await props.params;
  const { content, metadata } = await getContent(post);

  return (
    <VStack className="typography" w="full" alignItems="start">
      <VStack w="full" alignItems="start" gap="1" pb="6">
        <styled.h1 textWrap="balance">{metadata.title}</styled.h1>

        <aside>
          <p>{metadata.subtitle}</p>
        </aside>

        <time dateTime={metadata.timestamp.toISOString()}>
          written {formatDistanceToNow(metadata.timestamp, { addSuffix: true })}
        </time>

        <hr />
      </VStack>

      {content}
    </VStack>
  );
}
