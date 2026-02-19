import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    rules: {
      // Disable set-state-in-effect rule as our PWA hydration patterns are intentional
      "react-hooks/set-state-in-effect": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Ignore hand-crafted service worker (plain JS, not TS):
    "public/sw.js",
    // Ignore coverage output:
    "coverage/**",
    // Ignore scratch/debug files:
    "index.js",
  ]),
]);

export default eslintConfig;
