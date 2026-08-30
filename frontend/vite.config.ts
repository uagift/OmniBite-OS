import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in development containers via DISABLE_HMR env var.
      // File watching is managed to prevent unnecessary rebuilds during fast code updates.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is active to save container CPU cycles.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
