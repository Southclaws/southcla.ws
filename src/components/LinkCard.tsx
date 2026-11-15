import ogs from "open-graph-scraper-lite";
import { RichCard, RichCardProps } from "./RichCard/RichCard";

type Props = {
  url: string;
} & RichCardProps;

async function getPreview(url: string): Promise<Partial<RichCardProps>> {
  try {
    // Cache the preview for a day and never let a slow site hold up the page.
    const response = await fetch(url, {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(5000),
    });
    const html = await response.text();
    const link = await ogs({ html });

    return {
      title: link.result.ogTitle,
      description: link.result.ogDescription,
      image: link.result.ogImage?.[0]?.url,
    };
  } catch {
    return {};
  }
}

export async function LinkCard({ url, ...rest }: Props) {
  const preview = await getPreview(url);

  return <RichCard url={url} {...preview} {...rest} />;
}
