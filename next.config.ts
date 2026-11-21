import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // The stylesheet is small; inlining it removes the render-blocking
    // request from the critical path.
    inlineCss: true,
  },

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

export default nextConfig;
