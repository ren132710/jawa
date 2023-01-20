// add reference to Vitest types if you are importing defineConfig from Vite
/// <reference types="vitest" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Configure Vite: https://vitejs.dev/config/
// Configure Vitest: https://vitest.dev/config/

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: '[local]_[hash:base64:3]',
    },
  },
  test: {
    coverage: {
      provider: 'c8', // or 'istanbul'
    },
  },
});
