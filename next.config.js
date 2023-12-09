const withMDX = require("@next/mdx")();

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

module.exports = withMDX(nextConfig);
