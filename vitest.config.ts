import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.spec.ts'],
    exclude: ['node_modules/**', 'dist/**', '**/*.config.*', '**/generated/**', '**/seed.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.config.*',
        'src/**/*.spec.ts',
        'src/main/**',
        'src/config/**',
        'src/shared/**',
        'src/**/generated/**',
        'src/**/seed.ts',
        'src/shared/types/**',
        'src/**/dtos/**',
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
    },
  },
});
