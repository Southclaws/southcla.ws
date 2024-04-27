import { LinkCard } from "@/components/LinkCard";
import { PostCardList } from "@/components/PostCardList";
import { getPosts } from "@/content/content";
import { styled } from "@/styled-system/jsx";
import { Career } from "../../misc/Career";

export default async function Home() {
  const posts = await getPosts();

  return (
    <>
      <p>this is my tech blog.</p>
      <Career date={new Date()} />
      <p>this site is a never-ending exploration into the details.</p>

      <styled.nav display="flex" flexDir="column" gap="4" my="4">
        <styled.h2 fontSize="heading2">My internet presence</styled.h2>

        <styled.ul
          listStyle="none"
          margin="0"
          display="flex"
          flexDir="column"
          gap="2"
        >
          <styled.li margin="0">
            <LinkCard
              url="https://barney.is"
              title="My home page and collection of work"
              description="If you're interested in working with me, come on over."
            />
          </styled.li>

          <styled.li margin="0">
            <LinkCard
              url="https://blog.barney.is"
              title="My once-in-a-blue-moon newsletter"
            />
          </styled.li>
        </styled.ul>

        <styled.h2 fontSize="heading2">My technical writings</styled.h2>
        <p>
          these are articles I've written on technical subjects, I mostly cover
          web technologies and how design intertwines with our tools.
        </p>

        <PostCardList posts={posts} />
      </styled.nav>
    </>
  );
}
