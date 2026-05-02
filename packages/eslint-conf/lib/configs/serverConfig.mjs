import { baseConfig } from './baseConfig.mjs';

export const serverConfig = [
    ...baseConfig,
    {
        files: ['apps/server/**/*.{ts,js}', 'packages/**/src/**/*.{ts,js}'],
        rules: {
            // server code may use console for logs; keep permissive
            'no-console': 'off'
        }
    }
];
