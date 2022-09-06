const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    fixturesFolder: false,
    supportFile: false,
    viewportWidth: 300,
    viewportHeight: 300,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
})
