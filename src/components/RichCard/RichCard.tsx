import { css } from "@/styled-system/css";
import { Box, styled } from "@/styled-system/jsx";
import { formatDistanceToNow } from "date-fns";
import Image, { getImageProps } from "next/image";
import Link from "next/link";

import styles from "./RichCard.module.css";

export type RichCardProps = {
  url: string;
  // The title's element, so cards fit the surrounding heading outline.
  heading?: "h2" | "h3" | "p";
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

// The card image is decorative (the title and description carry the meaning).
// Local images go through next/image; link previews from arbitrary third-party
// sites are lazy loaded as-is.
function CardImage({ image }: { image: string }) {
  if (image.startsWith("/")) {
    return (
      <Image src={image} alt="" fill sizes="(min-width: 768px) 240px, 30vw" />
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={image} alt="" loading="lazy" decoding="async" />;
}

// A tiny rendition is plenty for the heavily blurred backdrop, and as a CSS
// background it stays out of the accessibility tree.
function backdropURL(image: string) {
  if (!image.startsWith("/")) return image;

  return getImageProps({ src: image, alt: "", width: 64, height: 64 }).props
    .src;
}

// Same look whichever element the title is rendered as.
const titleStyle = css({
  fontFamily: "heading",
  fontSize: "lg",
  fontWeight: "black",
  lineHeight: "tight",
  textWrap: "balance",
  margin: "0",
});

export async function RichCard({
  url,
  heading: Heading = "p",
  title,
  description,
  timestamp,
  image,
}: RichCardProps) {
  return (
    <Article className={styles.article}>
      <Box className={styles.media}>{image && <CardImage image={image} />}</Box>

      <Box
        className={styles.mediaBackdrop}
        style={
          image
            ? { backgroundImage: `url(${JSON.stringify(backdropURL(image))})` }
            : undefined
        }
      />

      <Box className={styles.text}>
        <Heading className={titleStyle} data-card-title="">
          <Link className={css({ lineClamp: 2 })} href={url}>
            {title ?? url}
          </Link>
        </Heading>

        {timestamp && (
          <time dateTime={timestamp.toISOString()}>
            {formatDistanceToNow(timestamp, { addSuffix: true })}
          </time>
        )}

        <styled.p m="0" lineClamp={2}>
          {description}
        </styled.p>
      </Box>
    </Article>
  );
}
