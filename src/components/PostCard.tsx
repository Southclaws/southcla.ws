import { PostReference } from "@/content/content";
import { Box, styled } from "@/styled-system/jsx";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

import styles from "./PostCard.module.css";

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
    <Article className={styles.article} boxShadow="sm">
      <Box className={styles.media}>
        {post.metadata.hero && <img src={post.metadata.hero} />}
      </Box>

      <Box className={styles.mediaBackdrop}>
        {post.metadata.hero && <img src={post.metadata.hero} />}
      </Box>

      <Box className={styles.text}>
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
      </Box>
    </Article>
  );
}
