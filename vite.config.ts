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

function disableHmrClientPlugin(): Plugin {
  return {
    name: 'disable-hmr-client',
    enforce: 'post',
    apply: 'serve',
    transform(code, id) {
      if (id.endsWith('/vite/dist/client/client.mjs') || id.endsWith('\\vite\\dist\\client\\client.mjs')) {
        return code.replace(
          'transport.connect(createHMRHandler(handleMessage));',
          '/* HMR disabled */'
        );
      }
    },
  };
}

export default defineConfig({
  plugins: [serveSeoFilesPlugin(), disableHmrClientPlugin(), react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-charts': ['recharts'],
          'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
        },
      },
    },
  },
  server: {
    // HMR is disabled in AI Studio.
    hmr: false,
  },
});
