/**
 * @file DatabaseLoader.ts
 * @description Initializes PostgreSQL connection using TypeORM.
 * Retries with exponential backoff to tolerate transient startup delays.
 * @author Lucas
 * @license MIT
 */

import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { appDataSource } from '@/database/AppDataSource';
import { Logger } from '@/lib/logger';

const RETRYABLE_CODES = new Set([
    'ECONNREFUSED',
    'ECONNRESET',
    'ETIMEDOUT',
    'ENOTFOUND',
    'EAI_AGAIN'
]);

const RETRYABLE_PG_MESSAGES = [
    'too many clients',
    'connection timeout',
    'terminating connection due to administrator command'
];

const MAX_RETRIES = 5;
const BASE_DELAY = 1000; // ms

export const DatabaseLoader: MicroframeworkLoader = async (
    settings?: MicroframeworkSettings
): Promise<void> => {
    const logger = new Logger(__filename);

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            await appDataSource.initialize();
            logger.info('Database connection established.');
            break;
        } catch (error) {
            const isLastAttempt = attempt === MAX_RETRIES;

            if (!isRetryable(error)) {
                logger.error('Non-retryable database error. Aborting.', { error });
                throw error;
            }

            if (isLastAttempt) {
                logger.error('Failed to initialize database connection.', { error });
                throw error;
            }

            const delay = BASE_DELAY * 2 ** (attempt - 1);

            logger.warn(
                `Database connection attempt ${attempt}/${MAX_RETRIES} failed. Retrying in ${delay}ms...`
            );

            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }

    settings.setData('dataSource', appDataSource);
    settings.onShutdown(async () => {
        if (appDataSource.isInitialized) {
            await appDataSource.destroy();
            logger.info('Database connection closed.');
        }
    });
};

const isRetryable = (error: unknown): boolean => {
    if (!(error instanceof Error)) return false;

    // Node.js network-level errors
    if ('code' in error && RETRYABLE_CODES.has((error as NodeJS.ErrnoException).code ?? ''))
        return true;

    // PostgreSQL message-level errors
    return RETRYABLE_PG_MESSAGES.some((msg) => error.message.toLowerCase().includes(msg));
};