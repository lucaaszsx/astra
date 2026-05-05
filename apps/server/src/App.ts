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
import { appendFileSync, mkdirSync } from 'node:fs';
import { Logger } from './lib/logger';

const logger = new Logger(__filename);

bootstrapMicroframework({
    loaders: [LoggerLoader, DatabaseLoader, IoCLoader, ServerLoader]
})
    .then(() => {
        logger.info('Application initialized successfully!');
    })
    .catch((err) => {
        const message = err instanceof Error ? err.stack : String(err);
        const entry = `[${new Date().toISOString()}] [FATAL] ${message}\n`;

        console.error(entry);

        try {
            mkdirSync('logs', { recursive: true });
            appendFileSync('logs/fatal.log', entry);
        } catch {}

        process.exit(1);
    });