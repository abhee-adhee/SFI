import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: false,
    // Mock `server-only` so it's a no-op in test context
    // (it normally throws if imported outside of a Next.js server environment)
    server: {
      deps: {
        inline: ['server-only'],
      },
    },
  },
  resolve: {
    alias: {
      // Resolve @/ to src/
      '@': path.resolve(import.meta.dirname, 'src'),
      // Stub server-only as an empty module
      'server-only': path.resolve(import.meta.dirname, 'tests/__mocks__/server-only.ts'),
    },
  },
});
