import { css, cx } from "@/styled-system/css";
import { VStack, styled } from "@/styled-system/jsx";
import Image from "next/image";
import { createReadStream } from "node:fs";
import path from "node:path";
import probe from "probe-image-size";
import { useId } from "react";
import { z } from "zod";

const ALIGNMENT_MAPPING = {
  left: "start",
  center: "center",
  right: "end",
} as const;

const ImageOptionSchema = z.object({
  size: z.enum(["small", "full"]).default("full"),
  align: z.enum(["left", "right", "center"]).default("center"),
  caption: z
    .string()
    .optional()
    .transform(
      (s) =>
        s && // cheeky hack to get escaped quotes and quote removal for free!
        (JSON.parse(s) as string),
    ),
  // Plain markdown alt text, when the alt isn't using the options syntax.
  alt: z.string().optional(),
});
type ImageOptions = z.infer<typeof ImageOptionSchema>;

const mediaImage = css({ borderRadius: "xl", boxShadow: "md", height: "auto" });
const fullWidth = css({ maxW: "full" });
const halfWidth = css({ maxW: "1/2" });

// Markdown sometimes references files by their filesystem path in public/.
export function publicPath(src: string) {
  return src.replace(/^(?:\.\/)?public\//, "/");
}

async function measure(src: string) {
  try {
    const file = path.join(process.cwd(), "public", decodeURI(src));
    return await probe(createReadStream(file));
  } catch {
    return undefined;
  }
}

export async function Media({ alt = "", src }: { alt?: string; src?: string }) {
  const options = getExtendedAttributes(alt);
  const url = publicPath(src ?? "");
  const size = url.startsWith("/") ? await measure(url) : undefined;

  return <MediaFigure options={options} src={url} size={size} />;
}

function MediaFigure({
  options,
  src,
  size,
}: {
  options: ImageOptions;
  src: string;
  size?: { width: number; height: number };
}) {
  const id = useId();
  const full = options.size === "full";
  const image = {
    src,
    alt: options.caption ?? options.alt ?? "",
    className: cx(mediaImage, full ? fullWidth : halfWidth),
    "aria-describedby": options.caption ? id : undefined,
  };

  return (
    <VStack w="full" alignItems={ALIGNMENT_MAPPING[options.align]}>
      {size ? (
        <Image
          {...image}
          width={size.width}
          height={size.height}
          sizes={
            full
              ? "(min-width: 768px) 736px, 100vw"
              : "(min-width: 768px) 368px, 50vw"
          }
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img {...image} alt={image.alt} loading="lazy" />
      )}

      {options.caption && (
        <styled.aside id={id} color="fg.muted">
          {options.caption}
        </styled.aside>
      )}
    </VStack>
  );
}

export function getExtendedAttributes(alt: string): ImageOptions {
  // Plain alt text (no "key=value" options) is passed through as-is.
  if (!alt.includes("=")) {
    return { size: "full", align: "center", caption: undefined, alt };
  }

  const params = Object.fromEntries(new URLSearchParams(alt).entries());

  return ImageOptionSchema.parse(params);
}
