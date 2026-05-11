import { resolve } from "path";
import CopyPlugin from "copy-webpack-plugin"

const blfWasmFile = resolve(
    "node_modules",
    "blf_wasm",
    "blf_wasm_bg.wasm"
  );
  

/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            { source: "/player/:path*", destination: "/halo3/player/:path*", permanent: true },
            { source: "/players", destination: "/halo3/players", permanent: true },
            { source: "/profile", destination: "/halo3/profile", permanent: true },
            { source: "/screenshots", destination: "/halo3/screenshots", permanent: true },
            { source: "/games", destination: "/halo3/games", permanent: true },
            { source: "/files", destination: "/halo3/files", permanent: true },
        ];
    },
    webpack: (
        config,
        options
      ) => {
        config.experiments.asyncWebAssembly = true
        if (!options.isServer) {
            config.plugins.push(
              new CopyPlugin({
                patterns: [
                  {
                    from: blfWasmFile,
                    to: "../public",
                  },
                ],
              })
            );
          }
          return config;
      },
};

export default nextConfig;
