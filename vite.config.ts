import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Listen on all network interfaces
    port: 5173,        // Default Vite port
    strictPort: true,  // Fail if port is already in use
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return
          if (/[\\/](three|@react-three)[\\/]/.test(id)) return 'vendor-three'
          if (/[\\/](react|react-dom|react-router-dom|scheduler)[\\/]/.test(id)) return 'vendor-react'
          if (/[\\/](framer-motion|motion|lucide-react|@radix-ui)[\\/]/.test(id)) return 'vendor-ui'
        },
      },
    },
  },
})
