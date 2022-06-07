const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:1234',
    viewport: 'ipad-2',
    // viewportWidth: 700,
    // viewportHeight: 900,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
})
