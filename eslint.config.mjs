import globals from 'globals'
import { fixupConfigRules, fixupPluginRules } from '@eslint/compat'
import react from 'eslint-plugin-react'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import reactRefresh from 'eslint-plugin-react-refresh'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
})

export default [
    {
        ignores: [
            'dist',
            'eslint.config.js',
            'node_modules',
            'amplify',
            '.idea',
            '.vscode',
            'public',
        ],
    },
    ...compat.extends('eslint:recommended'),
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.es2020,
                ...globals.commonjs,
            },
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
    },
    ...fixupConfigRules(
        compat.extends(
            'plugin:react/recommended',
            'plugin:react/jsx-runtime',
            'plugin:react-hooks/recommended',
            'plugin:jsx-a11y/recommended'
        )
    ).map((config) => ({
        ...config,
        files: ['**/*.{js,jsx,ts,tsx}'],
    })),
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        plugins: {
            'react': fixupPluginRules(react),
            'jsx-a11y': fixupPluginRules(jsxA11y),
            'react-refresh': fixupPluginRules(reactRefresh),
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
        },
    },
    ...fixupConfigRules(compat.extends('plugin:@typescript-eslint/recommended')).map((config) => ({
        ...config,
        files: ['**/*.{ts,tsx}'],
    })),
    {
        files: ['**/*.{ts,tsx}'],
        plugins: {
            '@typescript-eslint': fixupPluginRules(typescriptEslint),
        },
        languageOptions: {
            parser: tsParser,
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
]
