import globals from "globals";
import pluginJs from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import pluginPlaywright from 'eslint-plugin-playwright';

export default [
  {
    ignores: ["dist/*", "test/**/*.js", "cypress/**", "coverage/**"],
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
  {
    files: ['playwright/tests/*.spec.js'],
    ...pluginPlaywright.configs['flat/recommended'],
  },
  {
    files: ['playwright.config.js', 'vite.config.js', 'eslint.config.mjs', 'src/scripts/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node, //Allow process variable
      }
    }
  },
  {
    rules: {
      "vue/multi-word-component-names": "off",
      "vue/no-v-model-argument": "warn",
      "vue/valid-v-slot": "off",
      "vue/no-unused-vars": "warn",

    }
  }

];

