// add reference to Vitest types if you are importing defineConfig from Vite
/// <reference types="vitest" />

/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configure Vite: https://vitejs.dev/config/
// Configure Vitest: https://vitest.dev/config/

export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: '[local]_[hash:base64:3]',
    },
  },
  test: {
    // use global to avoid globals imports (describe, test, expect)
    globals: true,
    coverage: {
      provider: 'c8', // or 'istanbul'
    },
  },
});
