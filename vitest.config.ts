import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const root = dirname(fileURLToPath(new URL('.', import.meta.url)));

export default defineConfig({
  test: {
    environment: 'node',
  },
  css: {
    postcss: null,
  },
  resolve: {
    alias: {
      '@': root,
    },
  },
});
