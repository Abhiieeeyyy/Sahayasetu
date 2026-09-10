/**
 * Vite Configuration for SahayaSetu Disaster Recovery Platform
 * 
 * This file configures the build tool, development server, and React JSX transformations.
 * It ensures fast hot-module-replacement (HMR) and optimized frontend asset handling.
 */
import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function spaStaticRoutesPlugin(): Plugin {
  return {
    name: 'spa-static-routes',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const indexHtmlPath = path.join(distDir, 'index.html');
      if (!fs.existsSync(indexHtmlPath)) return;

      const htmlContent = fs.readFileSync(indexHtmlPath, 'utf-8');

      // 1. Generate 404.html for SPA fallback on Render/GitHub Pages
      fs.writeFileSync(path.join(distDir, '404.html'), htmlContent);

      // 2. Generate physical directory entrypoints so /superadmin and /regionaladmin never 404
      const routes = ['superadmin', 'regionaladmin', 'regional-admin'];
      for (const route of routes) {
        const routeDir = path.join(distDir, route);
        if (!fs.existsSync(routeDir)) {
          fs.mkdirSync(routeDir, { recursive: true });
        }
        fs.writeFileSync(path.join(routeDir, 'index.html'), htmlContent);
      }
    }
  };
}

export default defineConfig({
  plugins: [react(), spaStaticRoutesPlugin()],
  server: {
    port: 5173,
    host: true,
    open: false
  }
});

