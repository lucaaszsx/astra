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

            if (settings) {
                settings.setData('dataSource', appDataSource);

                settings.onShutdown(async () => {
                    if (appDataSource.isInitialized) {
                        await appDataSource.destroy();

                        logger.info('Database connection closed.');
                    }
                });
            }

            return;
        } catch (error) {
            const isLastAttempt = attempt === MAX_RETRIES;

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
};
