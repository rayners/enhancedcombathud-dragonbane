import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
    include: ["test/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "html"],
      exclude: [
        "test/",
        "dist/",
        "node_modules/",
        "**/*.d.ts",
        "vite.config.ts",
        "vitest.config.ts",
      ],
    },
  },
});
