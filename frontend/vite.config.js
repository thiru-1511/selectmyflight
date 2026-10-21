import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const duffelToken = env.VITE_DUFFEL_TOKEN || process.env.VITE_DUFFEL_TOKEN || ''

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/duffel-api': {
          target: 'https://api.duffel.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/duffel-api/, ''),
          headers: {
            'Authorization': `Bearer ${duffelToken}`,
            'Duffel-Version': 'v2',
            'Accept': 'application/json'
          }
        }
      }
    }
  }
})
