import type { NextConfig } from "next";
import type { Compilation, Compiler } from "webpack";
import fs from "node:fs";
import path from "node:path";

/**
 * For GitHub Pages project sites, set BASE_PATH to the repo name, e.g. /camino-weather
 * The deploy workflow sets this automatically; leave unset for local dev and user sites.
 */
const basePath = process.env.BASE_PATH?.trim() || "";

/**
 * YAML / GPX are read via fs, so they are not Webpack module dependencies by default.
 * In dev, changed data files would not trigger a rebuild until this list is wired in.
 */
function collectDataDependencyFiles(projectRoot: string): string[] {
  const dataRoot = path.join(projectRoot, "data");
  if (!fs.existsSync(dataRoot)) return [];

  const out: string[] = [];
  const walk = (dir: string) => {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) walk(full);
      else out.push(full);
    }
  };
  walk(dataRoot);
  return out;
}

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  webpack: (config, { dev, dir }) => {
    if (dev) {
      config.plugins!.push(
        new (class WatchCaminoDataPlugin {
          apply(compiler: Compiler) {
            compiler.hooks.make.tapAsync(
              "WatchCaminoDataPlugin",
              (compilation: Compilation, callback) => {
                for (const f of collectDataDependencyFiles(dir)) {
                  compilation.fileDependencies.add(f);
                }
                callback();
              },
            );
          }
        })(),
      );
    }
    return config;
  },
};

export default nextConfig;
