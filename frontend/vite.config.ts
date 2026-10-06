import { defineConfig } from 'vite'
import { reactRouter } from '@react-router/dev/vite'

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    plugins: [!process.env.VITEST ? reactRouter() : null],
    server: {
      proxy: {
        '/api': {
          target: 'https://localhost:443',
          secure: false
        }
      }
    },
    test: {
      environment: 'jsdom',
      globals: true,
      include: ['test/**/*test.tsx']
    }
  }
})
