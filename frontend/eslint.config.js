let typescripteslint = require('@typescript-eslint/eslint-plugin');
let parser = require('@typescript-eslint/parser');
let recommended = require('@eslint/js');
let onlywarn = require('eslint-plugin-only-warn');
module.exports = {
  plugins: {
    '@typescript-eslint': typescripteslint,
    typescripteslint,
    onlywarn
  },
  languageOptions: {
    sourceType: 'module',
    parser: parser,
    parserOptions: {
      tsconfigRootDir: './',
      project: './tsconfig.json'
    }
  },
  ignores: ['node_modules', 'dist'],
  files: ['**/*.ts', '**/*.tsx'],
  rules: {
    ...recommended.rules,
    ...typescripteslint.configs.recommended.rules
  }
};