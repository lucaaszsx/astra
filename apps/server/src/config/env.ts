/**
 * @file env.ts
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

const Server = {
    port: getEnvVariable('SERVER_PORT'),
    baseUrl: getEnvVariable('SERVER_BASE_URL'),
    routePrefix: getEnvOptional('SERVER_ROUTE_PREFIX'),
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
    },

    get url(): string {
        const { baseUrl, routePrefix } = this;
        let url = `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}`;

        if (routePrefix) url += `/${routePrefix.startsWith('/') ? routePrefix.slice(1) : routePrefix}`;

        return url;
    }
};

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
        entities: parseEnvArray('APP_DIRS_ENTITIES', parsePath),
        migrations: parseEnvArray('APP_DIRS_MIGRATIONS', parsePath),
        subscribers: parseEnvArray('APP_DIRS_SUBSCRIBERS', parsePath)
    }
};

const R2 = {
    accessKeyId: getEnvVariable('R2_ACCESS_KEY_ID'),
    secretAccessKey: getEnvVariable('R2_SECRET_ACESS_KEY'),
    accountId: getEnvVariable('R2_ACCOUNT_ID'),
    bucket: getEnvVariable('R2_BUCKET_NAME'),
    endpoint: getEnvVariable('R2_ENDPOINT'),
    publicEndpoint: getEnvOptional('R2_PUB_ENDPOINT'),
    region: getEnvVariable('R2_REGION')
};

const Pg = {
    type: getEnvVariable('DATABASE_TYPE'),
    host: getEnvVariable('DATABASE_HOST'),
    port: getEnvVariable('DATABASE_PORT', EnvType.Int),
    username: getEnvVariable('DATABASE_USERNAME'),
    password: getEnvVariable('DATABASE_PASSWORD'),
    database: getEnvVariable('DATABASE_NAME'),
    synchronize: getEnvVariable('DATABASE_SYNCHRONIZE', EnvType.Bool),
    logging: getEnvVariable('DATABASE_LOGGING', EnvType.Bool),

    get url(): string {
        return `${this.type}://${this.username}:${this.password}@${this.host}:${this.port}/${this.database}`;
    }
};

const Smtp = {
    host: getEnvVariable('SMTP_HOST'),
    port: getEnvVariable('SMTP_PORT', EnvType.Int),
    secure: getEnvVariable('SMTP_SECURE', EnvType.Bool),
    name: getEnvVariable('SMTP_NAME'),
    user: getEnvVariable('SMTP_USER'),
    pass: getEnvVariable('SMTP_PASS'),
    from: getEnvVariable('SMTP_FROM')
};

const Jwt = {
    accessSecret: getEnvVariable('JWT_ACCESS_SECRET'),
    refreshSecret: getEnvVariable('JWT_REFRESH_SECRET'),
    accessExpiresIn: getEnvVariable('JWT_ACCESS_EXPIRES_IN'),
    refreshExpiresIn: getEnvVariable('JWT_REFRESH_EXPIRES_IN')
};

const Auth = {
    codeExpiresIn: getEnvVariable('AUTH_CODE_EXPIRES_IN')
};

export const Env = {
    node: getEnvVariable('NODE_ENV'),

    Server,
    App,
    R2,
    Pg,
    Smtp,
    Jwt,
    Auth
};