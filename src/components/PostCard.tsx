import { PostReference } from "@/content/content";
import { styled } from "@/styled-system/jsx";

import { RichCard } from "./RichCard/RichCard";

type Props = {
  post: PostReference;
};

const Article = styled("article", {
  base: {
    borderRadius: "md",
    bgColor: "bg.muted",
  },
});

export async function PostCard({ post }: Props) {
  return (
    <RichCard
      url={`/${post.slug}`}
      title={post.metadata.title}
      description={post.metadata.subtitle}
      timestamp={post.metadata.timestamp}
      image={post.metadata.hero}
    />
  );
}
