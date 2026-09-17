import { defineConfig, loadEnv } from 'vite'
import { reactRouter } from '@react-router/dev/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [!process.env.VITEST ? reactRouter() : null],
    server: {
      proxy: {
        '/tour/': {
          target: env.VITE_API_TARGET || 'http://localhost:443',
          changeOrigin: true,
        },
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      include: ['test/**/*test.tsx']
    }
  }
})
