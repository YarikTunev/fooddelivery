import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://fooddelivery.s99220rx.beget.tech',
        changeOrigin: true,
      },
      '/images': {
        target: 'http://fooddelivery.s99220rx.beget.tech',
        changeOrigin: true,
      }
    }
  }
})