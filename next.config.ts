import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // typescript: {
  //   ignoreBuildErrors: true,
  // },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },

  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
