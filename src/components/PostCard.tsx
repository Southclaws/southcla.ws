import { PostReference } from "@/content/content";
import { styled } from "@/styled-system/jsx";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

type Props = {
  post: PostReference;
};

export function PostCard({ post }: Props) {
  return (
    <styled.article p="2" borderRadius="md" bgColor="bg.muted">
      <styled.h1 fontSize="lg">
        <Link href={`/${post.slug}`}>{post.metadata.title}</Link>
      </styled.h1>

      <styled.time color="fg.muted">
        written{" "}
        {formatDistanceToNow(post.metadata.timestamp, { addSuffix: true })}
      </styled.time>

      <styled.p m="0">{post.metadata.subtitle}</styled.p>
    </styled.article>
  );
}
