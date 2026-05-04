/**
 * @file IoCLoader.ts
 * @description Loader responsible for configuring dependency injection using TypeDI.
 * @author Lucas
 * @license MIT
 */


import { useContainer as classValidatorUseContainer, Validator } from 'class-validator';
import { MicroframeworkSettings, MicroframeworkLoader } from 'microframework-w3tec';
import { useContainer as routingUseContainer } from 'routing-controllers';
import { Logger } from '@/lib/logger';
import { Container } from 'typedi';

export const IoCLoader: MicroframeworkLoader = async (
    _settings?: MicroframeworkSettings
): Promise<void> => {
    const logger: Logger = new Logger(__filename);

    try {
        // Register global singleton services
        Container.set(Validator, new Validator());

        // Configure containers
        classValidatorUseContainer(Container);
        routingUseContainer(Container);

        // Register class-validator constraints
        registerConstraintClasses();

        logger.info('Dependency Injection initialized.');
    } catch (error) {
        logger.error('Failed to initialize Dependency Injection.', { error });

        throw error;
    }
};

/**
 * Register constraint classes in the TypeDI container
 * This prevents "Service with identifier was not found" errors
 */
function registerConstraintClasses() {
    const originalGet = Container.get.bind(Container);

    Container.get = function <T = any>(id: any): T {
        try {
            return originalGet(id);
        } catch (error: unknown) {
            if (
                error &&
                typeof error === 'object' &&
                'name' in error &&
                error.name === 'ServiceNotFoundError' &&
                (typeof id === 'function' || (typeof id === 'string' && id.includes('Constraint')))
            ) {
                if (typeof id === 'function') {
                    const instance = new id();
                    Container.set(id, instance);
                    return instance;
                }
            }
            throw error;
        }
    };
}