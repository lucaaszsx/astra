/**
 * @file ServerLoader.ts
 * @description Initializes and configures the Express HTTP server via routing-controllers.
 * Registers controllers, middlewares, and shutdown hooks into the microframework context.
 * @author Lucas
 * @license MIT
 */

import { MicroframeworkSettings, MicroframeworkLoader } from 'microframework-w3tec';
import { Application as ExpressApplication } from 'express';
import { createExpressServer } from 'routing-controllers';
import { Logger } from '@/lib/logger';
import { Env } from '@/config/env';

export const ServerLoader: MicroframeworkLoader = async (
    settings?: MicroframeworkSettings
): Promise<void> => {
    const logger: Logger = new Logger(__filename);

    const app: ExpressApplication = createExpressServer({
        routePrefix: Env.Server.routePrefix,
        defaultErrorHandler: false,
        classTransformer: true,
        validation: true,
        cors: false,
        controllers: Env.App.dirs.controllers,
        middlewares: Env.App.dirs.middlewares
    });

    // Enable trust proxy for accurate IP detection behind reverse proxies (nginx, load balancers)
    if (Env.node === 'prod') app.set('trust proxy', true);

    const { port } = Env.Server;

    const server = await new Promise<ReturnType<ExpressApplication['listen']>>(
        (resolve, reject) => {
            const s = app.listen(port, '0.0.0.0', () => resolve(s));
            s.on('error', reject);
        }
    );

    logger.info(`Server started on port ${port}.`);

    if (settings) {
        settings.setData('server', server);
        settings.setData('app', app);

        settings.onShutdown(() => {
            return new Promise<void>((resolve, reject) => {
                server.close((err) => (err ? reject(err) : resolve()));
            });
        });
    }
};
