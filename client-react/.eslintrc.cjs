module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb',
    'airbnb/hooks',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:cypress/recommended',
    'plugin:prettier/recommended', // list prettier plugin last to avoid conflicts
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', 'prettier'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'no-console': 'off',
    'consistent-return': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'no-use-before-define': ['error', { functions: false }],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'import/no-unresolved': 'off', // getting false positives with vite and @ alias
    'no-unused-expressions': [
      'warn',
      { allowShortCircuit: true, allowTernary: true },
    ],
    'import/extensions': [
      'error',
      'never',
      {
        ignorePackages: true,
        pattern: {
          css: 'always',
        },
      },
    ],
  },
};
