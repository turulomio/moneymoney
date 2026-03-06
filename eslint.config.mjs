import globals from "globals";
import pluginJs from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import pluginPlaywright from 'eslint-plugin-playwright';
import pluginI18n from '@intlify/eslint-plugin-vue-i18n';

export default [
  {
    ignores: ["dist/*", "output/**"],
  },
  // 1. Apply recommended configs FIRST so they don't override your custom languageOptions
  pluginJs.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  ...pluginI18n.configs["flat/recommended"],

  // 2. Define your global language options AFTER recommended configs
  {
    languageOptions: { 
      globals: {
        ...globals.browser,
      },
      ecmaVersion: 2020,
      sourceType: "module", // Required for import.meta
    },
  },
  
  {
    plugins: {
      '@intlify/vue-i18n': pluginI18n,
    },
    settings: {
      'vue-i18n': {
        localeDir: './src/locales/**/*.{json,json5,yaml,yml}', 
        messageSyntaxVersion: '^9.0.0',
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
      
      "@intlify/vue-i18n/no-missing-keys": "error",
      "@intlify/vue-i18n/no-unused-keys": "warn",
      "@intlify/vue-i18n/no-duplicate-keys-in-locale": "error",
    }
  }
];
