const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      // add code coverage task
      require("@cypress/code-coverage/task")(on, config);
      return config;
    },
    experimentalStudio: true,
  },
});
