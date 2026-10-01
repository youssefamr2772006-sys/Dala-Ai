import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  root: fileURLToPath(new URL('./src', import.meta.url)),
  base: command === 'build' ? '/Dala-Ai/' : '/',
  plugins: [react()],
  server: {
    open: true,
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
}));
