// add reference to Vitest types if you are importing defineConfig from Vite
/// <reference types="vitest" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Configure Vite: https://vitejs.dev/config/
// Configure Vitest: https://vitest.dev/config/

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.vitest': 'undefined', // ignore inline vitest code for builds
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // enables configured aliases from jsconfig.json
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: '[local]_[hash:base64:3]', // define the number of characters in the hash
    },
  },
  test: {
    includeSource: ['src/**/*.{js,ts}'], // so vitest can find inline vitest code
    coverage: {
      provider: 'c8', // or 'istanbul'
      reporter: ['text', 'text-summary', 'html'], // specify coverage output types
    },
  },
});
