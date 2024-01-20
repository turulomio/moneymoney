const { defineConfig } = require("cypress")

module.exports = defineConfig({
  viewportHeight:1080,
  viewportWidth:1920,
  chromeWebSecurity: false,

  component: {
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
  },

  e2e: {
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on,config)
      // implement node event listeners here
      return config
    },
  },
});
