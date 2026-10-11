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
          secure: false,
          configure: (proxy) => {
            proxy.on('proxyRes', (proxyRes) => {
              const setCookie = proxyRes.headers['set-cookie'];

              if (setCookie) {
                proxyRes.headers['set-cookie'] = setCookie.map((cookie) =>
                  cookie
                    .replace(/;\s*Secure/gi, '')
                    .replace(/SameSite=None/gi, 'SameSite=Lax')
                );
              }
            });
          }
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
