import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Plugin to strip sourcemap comments from lucide-react to avoid ENOENT warnings
const stripLucideSourcemapPlugin = {
  name: 'strip-lucide-sourcemap',
  apply: 'serve' as const,
  enforce: 'pre' as const,
  transform(code: string, id: string) {
    if (
      id.includes('lucide-react/dist/esm') ||
      id.includes('tailwind-merge/dist') ||
      id.includes('@radix-ui/react-slot/dist') ||
      id.includes('fast-equals/dist/es') ||
      id.includes('cookie/dist')
    ) {
      return {
        code: code.replace(/\/\/# sourceMappingURL=.*$/gm, ''),
        map: null,
      };
    }
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [stripLucideSourcemapPlugin, react(), tailwindcss()],
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
    // Usar minificação via esbuild (compatível com opções de "drop")
    minify: true,
    // Target específico para reduzir transpilação
    target: 'esnext',
    // Relatório de tamanho de bundle
    reportCompressedSize: true,
  },
  // Otimização de dependências
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'recharts', 'cookie'],
    exclude: ['lucide-react', 'tailwind-merge', '@radix-ui/react-slot', 'fast-equals'], // Exclude to ensure transform plugin always runs
  },
});
