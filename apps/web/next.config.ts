import type { NextConfig } from "next";
import path from "path";

const repoRoot = path.resolve(__dirname, "../..");

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/ui", "@repo/types"],
  turbopack: {
    root: repoRoot,
  },
};

export default nextConfig;
