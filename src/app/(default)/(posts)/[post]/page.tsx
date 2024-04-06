import { getContent } from "@/content/content";

type Props = {
  params: {
    post: string;
  };
};

export default async function Page(props: Props) {
  const content = await getContent(props.params.post);

  return <>{content.content}</>;
}
