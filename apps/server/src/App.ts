/**
 * @file App.ts
 * @description Application entry point, responsible for initializing loaders.
 * @author Lucas
 * @license MIT
 */

import 'reflect-metadata';
import 'dotenv/config';
import { DatabaseLoader, ServerLoader, LoggerLoader, IoCLoader } from './loaders';
import { bootstrapMicroframework } from 'microframework-w3tec';
import { Logger } from './lib/logger';

const logger = new Logger(__filename);

bootstrapMicroframework({
    loaders: [LoggerLoader, DatabaseLoader, IoCLoader, ServerLoader]
})
    .then(() => {
        logger.info('Application initialized successfully!');
    })
    .catch((err) => {
        logger.error('An error occurred during application initialization:', {
            error: err instanceof Error ? err.stack : err
        });
    });
