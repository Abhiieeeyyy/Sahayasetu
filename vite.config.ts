/**
 * Vite Configuration for SahayaSetu Disaster Recovery Platform
 * 
 * This file configures the build tool, development server, and React JSX transformations.
 * It ensures fast hot-module-replacement (HMR) and optimized frontend asset handling.
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    open: false
  }
});
