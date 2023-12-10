import remarkGfm from "remark-gfm";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  // Optionally, add any other Next.js config below

  async redirects() {
    return [
      {
        source: "/p/:slug*",
        destination: "/:slug*",
        permanent: true,
      },
    ];
  },
};

export default withMDX(nextConfig);
