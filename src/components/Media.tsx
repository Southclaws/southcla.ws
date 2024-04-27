import { VStack, styled } from "@/styled-system/jsx";
import { randomUUID } from "crypto";
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
        JSON.parse(s)
    ),
});
type ImageOptions = z.infer<typeof ImageOptionSchema>;

export function Media({ alt, ...props }: any) {
  const id = `image-caption-${randomUUID()}`;
  const options = getExtendedAttributes(alt);
  const full = options.size === "full";
  const align = ALIGNMENT_MAPPING[options.align];

  return (
    <VStack w="full" alignItems={align}>
      <styled.img
        borderRadius="xl"
        boxShadow="md"
        maxW={full ? "full" : "1/2"}
        alt={options.caption}
        aria-describedby={id}
        {...props}
      />

      {options.caption && (
        <styled.aside id={id} color="fg.muted">
          {options.caption}
        </styled.aside>
      )}
    </VStack>
  );
}

function getExtendedAttributes(alt: string): ImageOptions {
  const params = Object.fromEntries(new URLSearchParams(alt).entries());
  if (params == null)
    return {
      size: "full",
      align: "center",
      caption: alt,
    };

  const opts = ImageOptionSchema.parse(params);

  return opts;
}
