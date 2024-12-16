const eslintRecommended = require('@eslint/js');
const typescriptPlugin = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser')

module.exports [
  eslintRecommended.configs.recommended,
  {
    files: ['**/*.ts'],
    plugins: {
      '@typescript-eslint': typescriptPlugin
    },
    languageOptions: {
      parser: typescriptParser,
      ecmaVersion: 'latest',
      sourceType: 'module',

      globals: {
        browser: true,
        node: true
      }
    },
    ignores: ['node_modules/**/*',"/build/**/*"],

    rules: {
  },
  }
]