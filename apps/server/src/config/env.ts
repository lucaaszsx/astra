/**
 * @file EnvConfig.ts
 * @description Centralized runtime configuration using validated environment variables.
 * @author Lucas
 * @license MIT
 */

import {
    getEnvVariable,
    getEnvOptional,
    parseEnvArray,
    getEnvPath,
    parsePath,
    EnvType
} from '@/lib/env';

/**
 * Server configuration
 */
const Server = {
    port: getEnvVariable('SERVER_PORT'),
    baseUrl: getEnvVariable('SERVER_BASE_URL'),
    routePrefix: getEnvVariable('SERVER_ROUTE_PREFIX'),
    middlewares: {
        cors: {
            origins: parseEnvArray('SERVER_CORS_ORIGINS'),
            methods: parseEnvArray('SERVER_CORS_METHODS'),
            headers: parseEnvArray('SERVER_CORS_HEADERS'),
            credentials: getEnvVariable('SERVER_CORS_CREDENTIALS', EnvType.Bool)
        },
        rateLimit: {
            windowMs: getEnvVariable('SERVER_RATE_LIMIT_WINDOW', EnvType.Int),
            max: getEnvVariable('SERVER_RATE_LIMIT_REQUESTS', EnvType.Int),
            standardHeaders: getEnvVariable('SERVER_RATE_LIMIT_STANDARD_HEADERS', EnvType.Bool),
            legacyHeaders: getEnvVariable('SERVER_RATE_LIMIT_LEGACY_HEADERS', EnvType.Bool)
        },
        json: {
            limit: getEnvVariable('SERVER_JSON_LIMIT'),
            inflate: getEnvVariable('SERVER_JSON_INFLATE')
        },
        urlencoded: {
            limit: getEnvVariable('SERVER_URLENCODED_LIMIT')
        }
    }
};

/**
 * Application configuration
 */
const App = {
    logs: {
        level: getEnvVariable('APP_LOG_LEVEL'),
        dirname: getEnvPath('APP_LOG_FOLDER'),
        maxSize: getEnvVariable('APP_LOG_FILE_MAX_SIZE'),
        maxFiles: getEnvVariable('APP_LOG_MAX_FILES')
    },
    dirs: {
        controllers: parseEnvArray('APP_DIRS_CONTROLLERS', parsePath),
        middlewares: parseEnvArray('APP_DIRS_MIDDLEWARES', parsePath),

        entities:    parseEnvArray('APP_DIRS_ENTITIES', parsePath),
        migrations:  parseEnvArray('APP_DIRS_MIGRATIONS', parsePath),
        subscribers: parseEnvArray('APP_DIRS_SUBSCRIBERS', parsePath)
    }
};

/**
 * External R2 storage configuration
 */
const R2 = {
    accessKeyId: getEnvVariable('EXTERNAL_R2_ACCESS_KEY_ID'),
    secretAccessKey: getEnvVariable('EXTERNAL_R2_SECRET_ACESS_KEY'),
    accountId: getEnvVariable('EXTERNAL_R2_ACCOUNT_ID'),
    bucket: getEnvVariable('EXTERNAL_R2_BUCKET_NAME'),
    endpoint: getEnvVariable('EXTERNAL_R2_ENDPOINT'),
    publicEndpoint: getEnvOptional('EXTERNAL_R2_PUB_ENDPOINT'),
    region: getEnvVariable('EXTERNAL_R2_REGION')
};

/**
 * Database configuration
 */
const Pg = {
    type: getEnvVariable('DATABASE_TYPE'),
    host: getEnvVariable('DATABASE_HOST'),
    port: getEnvVariable('DATABASE_PORT', EnvType.Int),
    username: getEnvVariable('DATABASE_USERNAME'),
    password: getEnvVariable('DATABASE_PASSWORD'),
    database: getEnvVariable('DATABASE_NAME'),
    synchronize: getEnvVariable('DATABASE_SYNCHRONIZE'),
    logging: getEnvVariable('DATABASE_LOGGING', EnvType.Bool)
};

// Configurations exports
export const Env = {
    node: getEnvVariable('NODE_ENV'),

    Server,
    App,
    R2,
    Pg
};