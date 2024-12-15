import eslintRecommended from '@eslint/js'
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser'

export default [
  eslintRecommended.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
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
    ignores: ['node_modules/**/*',"**/build/**/*"],

    rules: {
  },
  }
]