// Plugins
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import eslintPlugin from 'vite-plugin-eslint'
import istanbul from 'vite-plugin-istanbul';

const plugins = [
  vue(),
  // VueDevTools(),
  vuetify({
    autoImport: true,
  }),
  eslintPlugin(),
  istanbul({
        include: 'src/**/*.{js,vue}',
        exclude: ['node_modules', 'src/main.ts'],
        extension: ['.js', '.vue'],
        forceBuild: true,
      }),
]

export default defineConfig({
  plugins,
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
    host: "127.0.0.1",
    port: 8006,
  },  
  test: { // To use with vitest but better with nyc
    globals: true,
    // environment: 'jsdom',
    alias: {
      '@/': new URL('./src/', import.meta.url).pathname,
    },
    include: ['**/*.test.js'],
    exclude: ['node_modules', 'dist', '**/examples/**', 'test'],
    coverage: {
      provider: 'istanbul',
      reporter: ['html', 'text', 'lcov'],
      include: ['src/**/*.js'],
      exclude: [
        'src/scripts/**',
        '**/*.spec.js'
      ]
    }
  },
  build: {
    sourcemap: "true", // Options: true, 'inline', 'hidden'
  },
})
