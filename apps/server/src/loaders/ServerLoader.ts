/**
 * @file ServerLoader.ts
 * @description Initializes and configures the Express HTTP server via routing-controllers.
 * Registers controllers, middlewares, and shutdown hooks into the microframework context.
 * @author Lucas
 * @license MIT
 */

import { MicroframeworkSettings, MicroframeworkLoader } from 'microframework-w3tec';
import { Application as ExpressApplication } from 'express';
import { useExpressServer } from 'routing-controllers';
import { Logger } from '@/lib/logger';
import { Env } from '@/config/env';
import express from 'express';

export const ServerLoader: MicroframeworkLoader = async (
    settings?: MicroframeworkSettings
): Promise<void> => {
    const logger: Logger = new Logger(__filename);
    const app: ExpressApplication = express();

    // Register body parsers before routing-controllers to avoid stream conflicts
    app.use(express.json({
        limit: Env.Server.middlewares.json.limit,
        strict: true,
        inflate: Env.Server.middlewares.json.inflate,
    }));

    app.use(express.urlencoded({
        extended: true,
        limit: Env.Server.middlewares.urlencoded.limit,
    }));

    // Prevents routing-controllers from re-parsing the request body per-route via body-parser.
    // rc v0.11.x registers body-parser internally on every action that uses @Body(), which causes
    // "stream is not readable" errors when a parser has already consumed the stream.
    // Setting req._body = true signals body-parser that the body was already parsed, skipping re-read.
    app.use((req: express.Request, _res: express.Response, next: express.NextFunction) => {
        (req as any)._body = true;
        next();
    });

    // Enable trust proxy for accurate IP detection behind reverse proxies (nginx, load balancers)
    if (Env.node === 'prod') app.set('trust proxy', true);

    useExpressServer(app, {
        routePrefix: Env.Server.routePrefix,
        defaultErrorHandler: false,
        classTransformer: true,
        validation: true,
        cors: false,

        controllers: Env.App.dirs.controllers,
        middlewares: Env.App.dirs.middlewares,
        interceptors: Env.App.dirs.interceptors
    });

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