import { Box, styled } from "@/styled-system/jsx";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

import styles from "./RichCard.module.css";
import { css } from "@/styled-system/css";

export type RichCardProps = {
  url: string;
  title?: string;
  description?: string;
  timestamp?: Date;
  image?: string;
};

const Article = styled("article", {
  base: {
    width: "full",
    borderRadius: "md",
    bgColor: "bg.muted",
    boxShadow: "md",
  },
});

export async function RichCard({
  url,
  title,
  description,
  timestamp,
  image,
}: RichCardProps) {
  return (
    <Article className={styles.article}>
      <Box className={styles.media}>{image && <img src={image} />}</Box>

      <Box className={styles.mediaBackdrop}>{image && <img src={image} />}</Box>

      <Box className={styles.text}>
        <styled.h1 fontSize="lg">
          <Link className={css({ lineClamp: 2 })} href={url}>
            {title ?? url}
          </Link>
        </styled.h1>

        {timestamp && (
          <time>{formatDistanceToNow(timestamp, { addSuffix: true })}</time>
        )}

        <styled.p m="0" lineClamp={2}>
          {description}
        </styled.p>
      </Box>
    </Article>
  );
}
