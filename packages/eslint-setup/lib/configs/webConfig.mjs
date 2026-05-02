import { baseConfig } from './baseConfig.mjs';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import vitestPlugin from 'eslint-plugin-vitest';
import reactPlugin from 'eslint-plugin-react';

export const webConfig = [
    ...baseConfig,
    {
        files: ['apps/web/**/*.{ts,tsx,js,jsx}'],
        plugins: {
            'react': reactPlugin,
            'react-hooks': reactHooksPlugin,
            'vitest': vitestPlugin
        },
        settings: {
            react: { version: 'detect' }
        },
        rules: {
            'react/react-in-jsx-scope': 'off',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
            'vitest/no-disabled-tests': 'warn',
            'vitest/no-focused-tests': 'error'
        }
    }
];
