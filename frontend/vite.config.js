import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'http://machinelearning.local',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: '../backend/public',
    emptyOutDir: false,
  },
})
