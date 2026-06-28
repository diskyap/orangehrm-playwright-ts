const tseslint = require('typescript-eslint')
const prettierPlugin = require('eslint-plugin-prettier')
const prettierConfig = require('eslint-config-prettier')

module.exports = tseslint.config({

    files: ['**/*.ts'],

    languageOptions: {
        parser: tseslint.parser
    },

    plugins: {
        prettier: prettierPlugin
    },

    extends: [
        ...tseslint.configs.recommended,
        prettierConfig
    ],

    rules: {

        semi: ['error', 'never'],

        quotes: ['error', 'single'],

        '@typescript-eslint/no-explicit-any': 'warn',

        'comma-dangle': ['error', 'never'],

        'prettier/prettier': [
            'error',
            {
                semi: false,
                singleQuote: true,
                trailingComma: 'none',
                tabWidth: 4,
                printWidth: 120,
                arrowParens: 'always'
            }
        ]
    }
})