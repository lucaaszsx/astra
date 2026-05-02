/**
 * @file IoCLoader.ts
 * @description Loader responsible for configuring dependency injection using TypeDI.
 * @author Lucas
 * @license MIT
 */

import { useContainer as classValidatorUseContainer } from 'class-validator';
import { MicroframeworkSettings, MicroframeworkLoader } from 'microframework-w3tec';
import { useContainer as routingUseContainer } from 'routing-controllers';
import { Logger } from '@/lib/logger';
import { Container } from 'typedi';

export const IoCLoader: MicroframeworkLoader = async (
    _settings?: MicroframeworkSettings
): Promise<void> => {
    const logger: Logger = new Logger(__filename);

    try {
        classValidatorUseContainer(Container);
        routingUseContainer(Container);

        logger.info('Dependency Injection initialized.');
    } catch (error) {
        logger.error('Failed to initialize Dependency Injection.', { error });

        throw error;
    }
};
