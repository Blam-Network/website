import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

const swcDecorators = {
  legacyDecorator: false,
  decoratorVersion: "2022-03" as const,
  decoratorMetadata: false,
  useDefineForClassFields: true,
};

export default defineConfig({
  plugins: [
    swc.vite({
      jsc: {
        parser: {
          syntax: "typescript",
          decorators: true,
        },
        transform: swcDecorators,
        target: "es2022",
      },
    }),
  ],
  test: {
    include: ["src/**/*.test.ts"],
    deps: {
      optimizer: {
        swc: {
          jsc: {
            parser: { syntax: "typescript", decorators: true },
            transform: swcDecorators,
            target: "es2022",
          },
        },
      },
    },
  },
});
