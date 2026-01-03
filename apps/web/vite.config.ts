import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    strictPort: true,
    port: Number(process.env.VITE_PORT) || 5173,
    hmr: { port: 24678 },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Estratégia de code splitting otimizada
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // React core - critical path
            if (id.includes('react/') || id.includes('react-dom/')) {
              return 'vendor-react';
            }
            // React Router - separate chunk
            if (id.includes('react-router-dom')) {
              return 'vendor-router';
            }
            // Recharts - heavy library, separate chunk (lazy loaded)
            if (id.includes('recharts')) {
              return 'vendor-charts';
            }
            // Lucide icons - separate chunk
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            // UI utilities
            if (
              id.includes('@radix-ui') ||
              id.includes('class-variance-authority') ||
              id.includes('clsx') ||
              id.includes('tailwind-merge')
            ) {
              return 'vendor-utils';
            }
          }
        },
        // Configurar tamanho máximo de chunk
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
    // Limites de tamanho com warnings
    chunkSizeWarningLimit: 500,
    // Usar minificação mais agressiva
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      format: {
        comments: false,
      },
    },
    // Target específico para reduzir transpilação
    target: 'esnext',
    // Relatório de tamanho de bundle
    reportCompressedSize: true,
  },
  // Otimização de dependências
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'recharts', 'lucide-react'],
  },
});
