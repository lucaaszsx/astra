/**
 * @file DatabaseLoader.ts
 * @description Initializes PostgreSQL connection using TypeORM.
 * @author Lucas
 * @license MIT
 */

import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { appDataSource } from '@/database/AppDataSource';
import { Logger } from '@/lib/logger';

export const DatabaseLoader: MicroframeworkLoader = async (
    settings?: MicroframeworkSettings
): Promise<void> => {
    const logger = new Logger(__filename);

    try {
        await appDataSource.initialize();

        logger.info('Database connection established.');

        if (settings) {
            settings.setData('dataSource', appDataSource);

            settings.onShutdown(async () => {
                if (appDataSource?.isInitialized) {
                    await appDataSource.destroy();

                    logger.info('Database connection closed.');
                }
            });
        }
    } catch (error) {
        logger.error('Failed to initialize database connection.');

        throw error; // Throws the error again so that it can be handled
    }
};
