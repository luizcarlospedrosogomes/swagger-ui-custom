import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy'; 
import path from 'path';

export default defineConfig({
 // base: '/swagger-custom/',
  plugins: [react(),
    viteStaticCopy({
      targets: [
        {
          src: './src/swagger-custom-config.json',
          dest: '' // raiz da dist
        }
      ]
      })
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'), // Vite vai processar HTML + JS
    },
  },
  server: {
    port: 3000, // opcional: porta do Vite
    proxy: {
      // redireciona chamadas da UI para o servidor Node/Express
      '/api': {
        target: 'http://localhost:4004', // onde seu backend está rodando
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
