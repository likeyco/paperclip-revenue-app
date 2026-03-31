import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/paperclip-revenue-app",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
