import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { terminalLogger } from './vite-plugins/terminal-logger'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    terminalLogger(), // Add terminal logger plugin
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3001,
    host: true,
    open: true,
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        ws: true, // Enable WebSocket proxying
        timeout: 60000, // Increase timeout to 60 seconds
        rewrite: (path) => path, // Don't rewrite, keep /api/v1 in path
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.error('❌ Proxy error:', err.message)
            console.error('   Make sure the backend server is running on', process.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:3000')
          })
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('📡 Proxying request:', req.method, req.url, 'to', proxyReq.path)
          })
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('✅ Proxy response:', req.method, req.url, '->', proxyRes.statusCode)
          })
        }
      },
      '/uploads': {
        target: process.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        ws: true,
        timeout: 60000,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.error('❌ Uploads proxy error:', err.message)
          })
        }
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'axios', 'pinia'],
          'admin': []
        }
      }
    }
  }
})

