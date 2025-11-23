const { defineConfig } = require("cypress");
require("dotenv").config();

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    video: false,
    env: {
      auth0_test_email: process.env.AUTH0_TEST_EMAIL,
      auth0_test_password: process.env.AUTH0_TEST_PASSWORD,
    },
    screenshotOnRunFailure: false,
    setupNodeEvents(on, config) {
      // add code coverage task
      require("@cypress/code-coverage/task")(on, config);
      return config;
    },
    experimentalStudio: true,
  },
});
