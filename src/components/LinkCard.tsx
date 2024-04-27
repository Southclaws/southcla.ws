import ogs from "open-graph-scraper-lite";
import { RichCard, RichCardProps } from "./RichCard/RichCard";

type Props = {
  url: string;
} & RichCardProps;

export async function LinkCard({ url, ...rest }: Props) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const link = await ogs({ html });

    return (
      <RichCard
        url={url}
        title={link.result.ogTitle}
        description={link.result.ogDescription}
        image={link.result.ogImage?.[0].url}
        {...rest}
      />
    );
  } catch (_) {
    return <RichCard url={url} {...rest} />;
  }
}
