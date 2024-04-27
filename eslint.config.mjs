import globals from "globals";
import pluginJs from "@eslint/js";
import pluginVue from "eslint-plugin-vue";


export default [
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  {
    rules: {
      "vue/multi-word-component-names": "off",
      "vue/no-v-model-argument": "warn",
      "vue/valid-v-slot": "off",
      "js/no-unused-expressions": "warn",
      "vue/no-unused-vars": "warn",

    }
  }

];

