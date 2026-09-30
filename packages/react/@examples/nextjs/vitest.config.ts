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
    // Real-control workflow suites mount many portals and navigate repeatedly.
    // Bound concurrency and allow the same budget as the longer launch cases.
    maxWorkers: 2,
    testTimeout: 15_000,
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['node_modules/**', '.next/**', 'out/**'],
  },
});
