import { PostReference } from "@/content/content";
import { styled } from "@/styled-system/jsx";
import { PostCard } from "./PostCard";

type Props = {
  posts: PostReference[];
};

export function PostCardList({ posts }: Props) {
  return (
    <styled.ul
      listStyle="none"
      margin="0"
      display="flex"
      flexDir="column"
      gap="4"
    >
      {posts.map((v) => (
        <styled.li key={v.slug} margin="0">
          <PostCard post={v} />
        </styled.li>
      ))}
    </styled.ul>
  );
}
