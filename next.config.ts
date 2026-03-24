import type { NextConfig } from "next";

/**
 * For GitHub Pages project sites, set BASE_PATH to the repo name, e.g. /camino-weather
 * The deploy workflow sets this automatically; leave unset for local dev and user sites.
 */
const basePath = process.env.BASE_PATH?.trim() || "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};

export default nextConfig;
