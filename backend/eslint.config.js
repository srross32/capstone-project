let recommended = require('@eslint/js');
module.exports = {
  languageOptions: {
    sourceType: 'module'
  },
  ignores: ['node_modules', 'dist'],
  files: ['**/*.js'],
  rules: {
    ...recommended.rules
  }
};
