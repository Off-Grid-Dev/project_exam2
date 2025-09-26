/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  base: '/project_exam2',
  plugins: [react(), tailwindcss()],
  test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './setupTests.ts',
        coverage: {
          provider: 'istanbul',
          reporter: ['text', 'lcov', 'html'],
          reportsDirectory: 'coverage',
          all: true,
          include: ['src/**/*.{ts,tsx,js,jsx}'],
          exclude: ['**/*.test.*', 'src/**/__tests__/**', 'src/main.*', 'src/vite-env.d.ts', 'node_modules/**', 'dist/**'],
        },
      },
});
