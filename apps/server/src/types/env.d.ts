/**
 * @file env.d.ts
 * @description Type augmentation for Node.js process.env.
 * Provides IntelliSense and type safety for all environment variables used in the application.
 * Values are always strings when read from process.env — parsing is handled in config/env.ts.
 * @author Lucas
 * @license MIT
 */

declare namespace NodeJS {
    interface ProcessEnv {
        // ────────────────────────────────
        // General
        // ────────────────────────────────
        NODE_ENV: 'dev' | 'prod' | 'test';

        // ────────────────────────────────
        // Server
        // ────────────────────────────────
        SERVER_PORT: string;
        SERVER_BASE_URL: string;
        SERVER_ROUTE_PREFIX: string;

        // CORS
        SERVER_CORS_ORIGINS: string;
        SERVER_CORS_METHODS: string;
        SERVER_CORS_HEADERS: string;
        SERVER_CORS_CREDENTIALS: string;

        // Rate limiting
        SERVER_RATE_LIMIT_WINDOW: string;
        SERVER_RATE_LIMIT_REQUESTS: string;
        SERVER_RATE_LIMIT_STANDARD_HEADERS: string;
        SERVER_RATE_LIMIT_LEGACY_HEADERS: string;

        // Body parser
        SERVER_JSON_LIMIT: string;
        SERVER_JSON_INFLATE: string;
        SERVER_URLENCODED_LIMIT: string;

        // ────────────────────────────────
        // Application
        // ────────────────────────────────
        APP_LOG_LEVEL: string;
        APP_LOG_FOLDER: string;
        APP_LOG_FILE_MAX_SIZE: string;
        APP_LOG_MAX_FILES: string;

        APP_DIRS_CONTROLLERS: string;
        APP_DIRS_MIDDLEWARES: string;
        APP_DIRS_ENTITIES: string;
        APP_DIRS_MIGRATIONS: string;
        APP_DIRS_SUBSCRIBERS: string;

        // ────────────────────────────────
        // Database
        // ────────────────────────────────
        DATABASE_TYPE: string;
        DATABASE_HOST: string;
        DATABASE_PORT: string;
        DATABASE_USERNAME: string;
        DATABASE_PASSWORD: string;
        DATABASE_NAME: string;
        DATABASE_SYNCHRONIZE: string;
        DATABASE_LOGGING: string;

        // ────────────────────────────────
        // Cloudflare R2
        // ────────────────────────────────
        EXTERNAL_R2_ACCESS_KEY_ID: string;
        EXTERNAL_R2_SECRET_ACESS_KEY: string;
        EXTERNAL_R2_ACCOUNT_ID: string;
        EXTERNAL_R2_BUCKET_NAME: string;
        EXTERNAL_R2_ENDPOINT: string;
        EXTERNAL_R2_PUB_ENDPOINT?: string;
        EXTERNAL_R2_REGION: string;

        // ────────────────────────────────
        // JWT
        // ────────────────────────────────
        JWT_ACCESS_SECRET: string;
        JWT_REFRESH_SECRET: string;
        JWT_ACCESS_EXPIRES_IN: string;
        JWT_REFRESH_EXPIRES_IN: string;
    }
}
