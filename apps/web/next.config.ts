import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@personal-website/engine",
    "@personal-website/blocks",
    "@personal-website/ui",
  ],
  turbopack: {
    root: path.resolve(__dirname, "../.."),
  },
  devIndicators: false,
};

export default nextConfig;
