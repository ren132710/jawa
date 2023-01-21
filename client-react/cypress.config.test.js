// Unable to run cypress headless using Vite dev server
// Issue (start-server-and-test): https://github.com/bahmutov/start-server-and-test/issues/294
// Workaround: build the app first, then run cypress using vite preview pointing to the preview port

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    chromeWebSecurity: false,
    baseUrl: 'http://localhost:4173',
    screenshotOnRunFailure: false,
    video: false,
  },
});
