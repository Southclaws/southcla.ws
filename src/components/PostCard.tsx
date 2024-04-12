import { PostReference } from "@/content/content";
import { styled } from "@/styled-system/jsx";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

type Props = {
  post: PostReference;
};

export async function PostCard({ post }: Props) {
  return (
    <styled.article p="2" borderRadius="md" bgColor="bg.muted">
      <styled.h1 fontSize="lg">
        <Link href={`/${post.slug}`}>{post.metadata.title}</Link>
      </styled.h1>

      <time>
        written{" "}
        {formatDistanceToNow(post.metadata.timestamp, { addSuffix: true })}
      </time>

      <styled.p m="0" lineClamp={1}>
        {post.metadata.subtitle}
      </styled.p>
    </styled.article>
  );
}
