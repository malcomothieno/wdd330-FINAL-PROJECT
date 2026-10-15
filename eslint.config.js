export default [
  {
    files: ['js/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { document: 'readonly', localStorage: 'readonly', fetch: 'readonly', console: 'readonly', Date: 'readonly', Math: 'readonly' }
    },
    rules: { 'no-unused-vars': 'warn', 'no-undef': 'error', eqeqeq: 'error', 'prefer-const': 'warn' }
  }
];
