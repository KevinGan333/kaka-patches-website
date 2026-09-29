import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/blog/custom-patches-for-hats", destination: "/products/custom-patch-hats", permanent: true },
      {
        source: "/blog/how-to-find-a-reliable-custom-patches-direct-factory-partner",
        destination: "/blog/custom-patches-direct-factory",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
