import { defineConfig } from 'vite'
import { reactRouter } from '@react-router/dev/vite'

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    plugins: [!process.env.VITEST ? reactRouter() : null],
    test: {
      environment: 'jsdom',
      globals: true,
      include: ['test/**/*test.tsx']
    }
  }
})
