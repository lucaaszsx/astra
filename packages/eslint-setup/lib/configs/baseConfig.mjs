import turboPlugin from 'eslint-plugin-turbo';
import js from '@eslint/js';

export const baseConfig = [
    {
        ignores: [
            '**/node_modules/**',
            '**/dist/**',
            '**/build/**',
            '**/coverage/**',
            '**/.turbo/**'
        ]
    },

    js.configs.recommended,

    {
        plugins: {
            turbo: turboPlugin
        },
        rules: {
            'prettier/prettier': 'warn',
            'turbo/no-undeclared-env-vars': 'warn'
        }
    }
];
