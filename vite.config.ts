
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Важно для корректной работы на GitHub Pages и Vercel
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
});
