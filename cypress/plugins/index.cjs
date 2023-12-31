const { startDevServer } = require('@cypress/vite-dev-server');

module.exports = (on, config) => {
  on('dev-server:start', (options) => startDevServer({ options }));
  require('@cypress/code-coverage/task')(on, config);
  return config;
};

  
  console.log("PLGUINS INDEX:CJJS")