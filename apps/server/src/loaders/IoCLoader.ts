/**
 * @file IoCLoader.ts
 * @description Loader responsible for configuring dependency injection using TypeDI.
 *
 * @author Lucas
 * @license Apache-2.0
 */

import { useContainer as classValidatorUseContainer, Validator } from 'class-validator';
import { MicroframeworkSettings, MicroframeworkLoader } from 'microframework-w3tec';
import { useContainer as routingUseContainer } from 'routing-controllers';
import { Logger } from '@/lib/logger';
import { Container } from 'typedi';

export const IoCLoader: MicroframeworkLoader = async (
    settings?: MicroframeworkSettings
): Promise<void> => {
    const logger: Logger = new Logger(__filename);

    // Register global singleton services
    Container.set(Validator, new Validator());

    // Configure containers
    classValidatorUseContainer(Container);
    routingUseContainer(Container);

    logger.info('Dependency Injection initialized.');
};
