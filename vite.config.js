/// <reference types="vitest" />

// Plugins
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import eslintPlugin from 'vite-plugin-eslint';


export default defineConfig({
  plugins: [
    vue(),
    vuetify({
      autoImport: true,
    }),
    eslintPlugin(),
  ],
  define: { 
    'process.env': {},
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: true,
    __INTLIFY_PROD_DEVTOOLS__: false,
  },
  base: '/moneymoney',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  server: {
    port: 8006,
  },  
  test: {
    alias: {
      '@/': new URL('./src/', import.meta.url).pathname, 
    },
    globals:true,
    coverage: {
      provider: 'v8', // or 'v8'
      reporter: ['text'],
      exclude: [
        '**/*.spec.js',
      ],
    },
  },
})
