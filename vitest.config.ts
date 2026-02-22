import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    clearMocks: true,
    restoreMocks: true,
    exclude: ["**/node_modules/**", "**/dist/**", "playwright/**", "demo/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.ts", "src/**/*.tsx"],
      exclude: [
        "dist/**",
        "node_modules/**",
        "**/*.d.ts",
        "vitest.config.ts",
        "src/index.ts",
        "playwright/**",
      ],
    },
  },
});
