import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Dev proxy: only used when VITE_API_BASE is not set to a full URL
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE || 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
