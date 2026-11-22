import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';

function serveSeoFilesPlugin(): Plugin {
  const handleSeoRequest = (
    reqUrl: string | undefined,
    res: { statusCode: number; setHeader: (name: string, value: string) => void; end: (chunk?: string | Buffer) => void },
    next: () => void,
    baseDir: string,
  ) => {
    const pathname = (reqUrl || '').split('?')[0];
    if (pathname === '/sitemap.xml') {
      const filePath = path.resolve(baseDir, 'sitemap.xml');
      if (fs.existsSync(filePath)) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/xml; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
        res.end(fs.readFileSync(filePath, 'utf-8'));
        return;
      }
    }
    if (pathname === '/robots.txt') {
      const filePath = path.resolve(baseDir, 'robots.txt');
      if (fs.existsSync(filePath)) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
        res.end(fs.readFileSync(filePath, 'utf-8'));
        return;
      }
    }
    next();
  };

  return {
    name: 'serve-seo-files',
    configureServer(server) {
      const publicDir = path.resolve(__dirname, 'public');
      server.middlewares.use((req, res, next) => {
        handleSeoRequest(req.url, res, next, publicDir);
      });
    },
    configurePreviewServer(server) {
      const distDir = path.resolve(__dirname, 'dist');
      server.middlewares.use((req, res, next) => {
        handleSeoRequest(req.url, res, next, distDir);
      });
    },
  };
}

export default defineConfig({
  plugins: [serveSeoFilesPlugin(), react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    hmr: process.env.DISABLE_HMR !== 'true',
  },
});
