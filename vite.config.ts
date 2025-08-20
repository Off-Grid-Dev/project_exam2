/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

const repository = '/project_exam2/';

// https://vite.dev/config/
export default defineConfig({
  base: repository,
  plugins: [react(), tailwindcss()],
  test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './setupTests.ts',
      },
});
