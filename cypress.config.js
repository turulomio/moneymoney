import { defineConfig } from "cypress";
import codeCoverageTask from '@cypress/code-coverage/task.js';
export default defineConfig({
  viewportWidth: 1920,
  viewportHeight: 1080,

  e2e: {
    baseUrl:"http://127.0.0.1:8006/moneymoney",
    setupNodeEvents(on, config) {
      codeCoverageTask(on, config);
      return config
    },
  },
  component: {
    devServer: {
      framework: "vue",
      bundler: "vite"
    },
    // supportFile:false,
  "env": {
    "cypress/globals": true
  }
  },
});
