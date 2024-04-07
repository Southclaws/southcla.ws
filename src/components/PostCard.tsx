import { PostReference } from "@/content/content";
import { styled } from "@/styled-system/jsx";
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

      <p>{post.metadata.subtitle}</p>
    </styled.article>
  );
}
