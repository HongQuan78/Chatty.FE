import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendProxyTarget = env.VITE_BACKEND_PROXY_TARGET || 'https://localhost:7277'

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: backendProxyTarget,
          changeOrigin: true,
          secure: false,
        },
        '/uploads': {
          target: backendProxyTarget,
          changeOrigin: true,
          secure: false,
        },
        '/files': {
          target: backendProxyTarget,
          changeOrigin: true,
          secure: false,
        },
        '/hubs': {
          target: backendProxyTarget,
          changeOrigin: true,
          secure: false,
          ws: true,
        },
      },
    },
  }
})
