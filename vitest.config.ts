import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    // Run in a single worker-thread to avoid sandbox kill(2) issues
    pool: "threads",
    maxWorkers: 1,
    isolate: false,
    coverage: {
      provider: "v8",
      include: ["utils/**/*.ts", "components/**/*.tsx", "app/**/*.{ts,tsx}"],
      exclude: ["**/*.test.ts", "**/*.d.ts"],
      reporter: ["text", "json"],
    },
  },
  resolve: {},
});
