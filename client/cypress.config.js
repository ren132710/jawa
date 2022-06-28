const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    chromeWebSecurity: false,
    baseUrl: 'http://localhost:1234',
    viewport: 'ipad-2',
    // viewportWidth: 700,
    // viewportHeight: 900,
    setupNodeEvents(on, config) {
      console.log('cypress config: ', config)
      // implement node event listeners here
    },
  },
})
