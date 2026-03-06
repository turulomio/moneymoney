import globals from "globals";
import pluginJs from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import pluginPlaywright from 'eslint-plugin-playwright';
import pluginI18n from '@intlify/eslint-plugin-vue-i18n'; // 1. Import the plugin

export default [
  {
    ignores: ["dist/*", "output/**"],
  },
  {
    languageOptions: { 
      globals: {
        ...globals.browser,
      }
    },
  },
  pluginJs.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  
  // 2. Define the i18n settings and plugin registration
  {
    plugins: {
      '@intlify/vue-i18n': pluginI18n,
    },
    settings: {
      '@intlify/vue-i18n': {
        // Adjust this path to where your JSON/YAML translation files actually live
        localeDir: './src/locales/*.{json,json5,yaml,yml}', 
        messageSyntaxVersion: '^9.0.0', // Standard for Vue 3
      },
    },
  },

  {
    files: ['playwright/tests/*.spec.js'],
    ...pluginPlaywright.configs['flat/recommended'],
  },
  {
    files: ['playwright.config.js', 'vite.config.js', 'eslint.config.mjs', 'src/scripts/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      }
    }
  },
  {
    rules: {
      "vue/multi-word-component-names": "off",
      "vue/no-v-model-argument": "warn",
      "vue/valid-v-slot": "off",
      "vue/no-unused-vars": "warn",
      
      // 3. Updated i18n rules with correct severity levels
      "@intlify/vue-i18n/no-missing-keys": "error",
      "@intlify/vue-i18n/no-unused-keys": "warn",
      "@intlify/vue-i18n/no-duplicate-keys-in-locale": "error",
    }
  }
];