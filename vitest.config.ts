import { defineConfig } from "vitest/config";
import { fileURLToPath } from "url";
import { dirname } from "path";

const root = dirname(fileURLToPath(new URL(".", import.meta.url)));

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
