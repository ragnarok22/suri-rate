import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    // Run in a single worker-thread to avoid sandbox kill(2) issues
    pool: "threads",
    maxWorkers: 1,
    isolate: false,
  },
  resolve: {},
  coverage: {
    provider: "v8",
    include: ["utils/**", "components/**", "app/**"],
    exclude: ["**/*.test.ts", "**/*.d.ts"],
  },
});
