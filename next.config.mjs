import { resolve } from "path";
import CopyPlugin from "copy-webpack-plugin"

const blfWasmFile = resolve(
    "node_modules",
    "blf_wasm",
    "blf_wasm_bg.wasm"
  );
  

/** @type {import('next').NextConfig} */
const nextConfig = {
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
