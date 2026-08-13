import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import stylistic from '@stylistic/eslint-plugin'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginPrettier from 'eslint-plugin-prettier'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTypescript,
  react.configs.flat.recommended,
  reactHooks.configs.flat.recommended,
  stylistic.configs.recommended,
  eslintConfigPrettier,
  {
    plugins: {
      prettier: eslintPluginPrettier
    },
    rules: {
      'prettier/prettier': 'error',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'type'],
          pathGroups: [
            { pattern: 'react', group: 'external', position: 'before' },
            { pattern: 'next', group: 'external', position: 'before' },
            { pattern: 'next/**', group: 'external', position: 'before' },
            { pattern: '@/shared/**', group: 'internal', position: 'before' },
            { pattern: '@/**', group: 'internal', position: 'after' }
          ],
          pathGroupsExcludedImportTypes: ['react', 'next', 'type'],
          'newlines-between': 'ignore'
        }
      ],
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-proptypes': 'error',
      'jsx-a11y/aria-unsupported-elements': 'error',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/role-supports-aria-props': 'error',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true
        }
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^\\.\\.?/(?!.*\\.css$)',
              message: 'Use the @/ alias, not relative imports.'
            }
          ]
        }
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }]
    }
  },
  globalIgnores(['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
  {
    files: ['**/__tests__/**', 'tests/**'],
    rules: {
      'import/order': 'off'
    }
  }
])

export default eslintConfig
