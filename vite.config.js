import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 3500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            const normalizedId = id.replace(/\\/g, '/')
            const cleanPath = normalizedId.split('/node_modules/').pop()
            const packageSegment = cleanPath.includes('@')
              ? cleanPath.startsWith('@')
                ? cleanPath.split('/').slice(0, 2).join('/')
                : cleanPath.split('/')[0]
              : cleanPath.split('/')[0]
            const safePackage = packageSegment.replace(/[^a-zA-Z0-9@_.-]/g, '-')

            if (
              normalizedId.includes('node_modules/vue/') ||
              normalizedId.includes('node_modules/@vue/') ||
              normalizedId.includes('node_modules/vue-router/') ||
              normalizedId.includes('node_modules/pinia/')
            ) {
              return 'vendor-vue'
            }

            if (normalizedId.includes('node_modules/axios')) {
              return 'vendor-axios'
            }
            if (normalizedId.includes('node_modules/chart') || normalizedId.includes('node_modules/apexcharts')) {
              return 'vendor-chart'
            }

            return `npm-${safePackage}`
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
