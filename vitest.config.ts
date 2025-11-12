import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    // Run in a single worker-thread to avoid sandbox kill(2) issues
    pool: "threads",
    poolOptions: {
      threads: { singleThread: true },
    },
  },
  resolve: {},
});
