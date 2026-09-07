import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: [
      // Package-style imports resolve to the parent package source
      // (source-integration playground; see README "Dependency model").
      { find: /^@egose\/shadcn-theme\/(.*)$/, replacement: fileURLToPath(new URL('../../$1', import.meta.url)) },
      { find: /^@\/(.*)$/, replacement: fileURLToPath(new URL('./$1', import.meta.url)) },
    ],
  },
  test: {
    environment: 'jsdom',
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['node_modules/**', '.next/**', 'out/**'],
  },
});
