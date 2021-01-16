/* eslint-disable no-undef */

module.exports = {
  root: true,

  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'jest',
  ],

  parserOptions: {
    project: './tsconfig.json',
  },

  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
  ],

  env: {
    'jest/globals': true,
  },

  rules: {
    'comma-dangle': 'off',
    '@typescript-eslint/comma-dangle': ['error', 'only-multiline'],

    'comma-spacing': 'off',
    '@typescript-eslint/comma-spacing': ['error'],

    'no-throw-literal': 'off',
    '@typescript-eslint/no-throw-literal': ['error'],

    'quotes': 'off',
    '@typescript-eslint/quotes': ['error', 'single'],

    'semi': 'off',
    '@typescript-eslint/semi': ['error', 'always'],

    'space-before-function-paren': 'off',
    '@typescript-eslint/space-before-function-paren': ['error', 'always'],

    ///
    ///
    ///

    '@typescript-eslint/prefer-nullish-coalescing': ['error'],
    '@typescript-eslint/prefer-readonly': ['error'],
    '@typescript-eslint/promise-function-async': ['error'],
  },
};
