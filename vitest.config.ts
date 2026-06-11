import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  test: {
    globals: true,
    include: ['tests/**/*.test.{ts,tsx}'],
    setupFiles: ['./tests/setup.ts'],
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      include: ['src/**'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/index.ts',
        'src/**/types.ts',
        'src/**/constants.ts',
        'src/styles/**',
        'src/**/.gitkeep',
        'src/main.tsx', // Entry point, not testable in jsdom
        'src/components/scene/Scene.tsx', // R3F component requiring WebGL context
        'src/components/scene/GridFloor.tsx', // R3F component requiring WebGL context
        'src/components/pieces/', // R3F piece mesh components (WebGL-only rendering)
        'src/components/physics/', // R3F physics components (require Canvas context)
      ],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  },
});
