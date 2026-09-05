import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Genta Music Player — frontend build config.
// The dev server proxies /api/* to the local Express backend so the
// YouTube Data API key is NEVER exposed to the browser.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true
      }
    }
  }
})
