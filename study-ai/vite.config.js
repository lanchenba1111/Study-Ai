import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // This helps if you're developing on a local network or tablet
    host: true,
    port: 5173,
  },
  define: {
    // Ensures global is defined for certain markdown libraries
    'global': 'window',
  },
  resolve: {
    alias: {
      // Useful if you have deep folder structures in src
      '@': '/src',
    },
  },
  // Optimizes the build for the heavy markdown/katex libraries
  optimizeDeps: {
    include: ['react-markdown', 'remark-gfm', 'remark-math', 'rehype-katex'],
  },
});