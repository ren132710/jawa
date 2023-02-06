import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    defaultCommandTimeout: 5000,
    chromeWebSecurity: false,
    baseUrl: 'http://localhost:5173',
    viewport: 'ipad-2',
    screenshotOnRunFailure: false,
    video: false,
    setupNodeEvents(on, config) {
      console.log('cypress config: ', config);
      // implement node event listeners here
    },
  },
});
