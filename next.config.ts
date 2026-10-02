import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Restricted Windows hosts may disallow child processes. Next can perform
  // the same type checking and prerendering in worker threads instead.
  // Vercel's Linux build uses the standard defaults.
  ...(process.platform === "win32"
    ? { experimental: { workerThreads: true, useTypeScriptCli: false, cpus: 2 } }
    : {}),
};

export default nextConfig;
