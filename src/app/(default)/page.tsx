import { PostCardList } from "@/components/PostCardList";
import { getPosts } from "@/content/content";
import { styled } from "@/styled-system/jsx";
import Link from "next/link";
import { Career } from "../../misc/Career";

export default async function Home() {
  const posts = await getPosts();

  return (
    <>
      <p>this is my tech blog.</p>
      <Career date={new Date()} />
      <p>this site is a never-ending exploration into the details.</p>

      <styled.nav display="flex" flexDir="column" gap="4">
        <styled.ul
          listStyle="none"
          margin="0"
          display="flex"
          flexDir="column"
          gap="2"
        >
          <styled.li margin="0">
            <Link className="link" href="https://blog.barney.is">
              tech, culture and design newsletter
            </Link>
          </styled.li>

          <styled.li margin="0">
            <Link className="link" href="https://barney.is">
              home page
            </Link>
          </styled.li>
        </styled.ul>

        <PostCardList posts={posts} />
      </styled.nav>
    </>
  );
}
