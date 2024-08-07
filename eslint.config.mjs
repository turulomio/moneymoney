import globals from "globals";
import pluginJs from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import pluginCypress from "eslint-plugin-cypress";


// console.log("GLOBALS", globals.browser)
// console.log("PLUGINCYPRESS", pluginCypress)
// console.log("GLOBALSCYPRESS", pluginCypress.environments.globals.globals
// )

export default [
  {
    languageOptions: { 
      globals: {
        ...globals.browser,
        ...pluginCypress.environments.globals.globals,// LA tuve que localizar apelo, aun no funciona, esperar futras versiones
      }
    },
  },
  pluginJs.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  {
    rules: {
      "vue/multi-word-component-names": "off",
      "vue/no-v-model-argument": "warn",
      "vue/valid-v-slot": "off",
      "vue/no-unused-vars": "warn",

    }
  }

];

