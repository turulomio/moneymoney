// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    alias: {
      '@/': new URL('./src/', import.meta.url).pathname, 
    },
    coverage: {
      provider: 'v8', // or 'v8'
      reporter: ['text', 'json', 'html'],
      exclude: [
        'src/rules.spec.js',
        'rules.spec.js',
        '*.spec.js',
      ],
    },
  },
})