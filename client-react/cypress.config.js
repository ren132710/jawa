import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    chromeWebSecurity: false,
    baseUrl: 'http://localhost:5173',
    viewport: 'ipad-2',
    slowTestThreshold: 1000, // default
  },
});
