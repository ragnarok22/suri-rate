import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    // Run in a single worker-thread to avoid sandbox kill(2) issues
    pool: "threads",
    maxWorkers: 1,
    isolate: true,
    coverage: {
      provider: "v8",
      include: ["utils/**/*.ts", "components/**/*.tsx", "app/**/*.{ts,tsx}"],
      exclude: ["**/*.test.ts", "**/*.test.tsx", "**/*.d.ts"],
      reporter: ["text", "json"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
