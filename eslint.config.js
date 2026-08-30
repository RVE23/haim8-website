import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  // Serverless functions and the /clarifi static pages are plain browser/Node
  // scripts, not React — the React-specific rules don't apply and api/ needs
  // Node globals (process, console).
  {
    files: ['api/**/*.{js,mjs}'],
    languageOptions: { globals: globals.node },
    extends: [js.configs.recommended],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
  {
    files: ['public/clarifi/**/*.js'],
    languageOptions: { globals: globals.browser, sourceType: 'script' },
    extends: [js.configs.recommended],
    rules: {
      'react-refresh/only-export-components': 'off',
      // capture.js wraps every localStorage access in a bare try/catch: the API
      // throws outright in private browsing, and there is nothing to do about it
      // but carry on without persistence. Deliberate, so allow it here only.
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-unused-vars': ['error', { caughtErrors: 'none' }],
    },
  },
])
