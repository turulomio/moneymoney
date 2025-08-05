
import { startDevServer } from '@cypress/vite-dev-server';
import codeCoverageTask from '@cypress/code-coverage/task.js';

export default (on, config) => {
  on('dev-server:start', (options) => startDevServer({ options }));
  codeCoverageTask(on, config);
  return config;
};