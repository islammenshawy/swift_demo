import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// Vite config for building the standalone presentation player
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  build: {
    outDir: 'dist/standalone',
    lib: {
      entry: path.resolve(__dirname, 'src/standalone/entry.tsx'),
      name: 'StandalonePlayer',
      fileName: 'player',
      formats: ['iife'],
    },
    rollupOptions: {
      output: {
        // Inline all dependencies
        inlineDynamicImports: true,
        // Don't split chunks
        manualChunks: undefined,
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    // Generate a single file
    cssCodeSplit: false,
  },
});
