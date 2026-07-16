import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/blog/how-to-find-a-reliable-custom-patches-direct-factory-partner",
        destination: "/blog/custom-patches-direct-factory",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
