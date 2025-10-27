import { defineConfig } from 'vite';

export default defineConfig({
  base: '/planet-viewer/',
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});

