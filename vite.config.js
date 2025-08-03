/// <reference types="vitest" />

// Plugins
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import eslintPlugin from 'vite-plugin-eslint';
import istanbul from 'vite-plugin-istanbul';
// import VueDevTools from 'vite-plugin-vue-devtools'

const plugins = [
  vue(),
  // VueDevTools(),
  vuetify({
    autoImport: true,
  }),
  eslintPlugin(),
];

// Condicionalmente agrega el plugin istanbul
// if (process.env.DISABLE_COVERAGE !== 'true') {
  plugins.push(
    istanbul({
      include: 'src/**/*', // specify the files you want to instrument
      exclude: ['node_modules', 'test/*', 'cypress', 'playwrigth/e2e'],
      extension: ['.js', '.vue'], // include your file extensions
      playwright: true,
    }))
  // );


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
  // test: {
  //   alias: {
  //     '@/': new URL('./src/', import.meta.url).pathname, 
  //   },
  //   include: ['**/*.{test,spec}.{js,ts,jsx,tsx}'],
  //   exclude: ['node_modules', 'dist', '**/examples/**', 'cypress','test'],
  //   coverage: {
  //     reporter: ['html','text'],
  //     // Include specific files or patterns
  //     include: ['src/functions.js','src/types.js'],

  //     // Exclude specific files or patterns
  //     exclude: [
  //       '**/*.spec.js',
  //     ],
  //   }
  // },
  build: {
    sourcemap: "true", // Options: true, 'inline', 'hidden'
  },
})
