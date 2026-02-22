import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    core: "src/core.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: false,
  minify: true,
  treeshake: true,
  splitting: false,
  target: "es2020",
  outDir: "dist",
  outExtension({ format }) {
    return {
      js: format === "cjs" ? ".cjs" : ".mjs",
    };
  },
});
