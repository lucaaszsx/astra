/**
 * @file CorsMiddleware.ts
 * @description Enables Cross-Origin Resource Sharing (CORS) for incoming HTTP requests.
 * Configures response headers to allow specific origins, methods, and headers.
 *
 * @author Lucas
 * @license MIT
 */

import { Request, Response, NextFunction } from 'express';
import { Middleware } from 'routing-controllers';
import cors, { CorsOptions } from 'cors';
import { Env } from '@/config/env';
import { Service } from 'typedi';

const { middlewares } = Env.Server;

@Middleware({ type: 'before' })
@Service()
export default class CorsMiddleware {
    private handler: (req: Request, res: Response, next: NextFunction) => void;

    constructor() {
        const options: CorsOptions = {
            origin: (origin, callback) => {
                const allowedOrigins = middlewares.cors.origins;

                if (!origin || allowedOrigins.includes(origin)) callback(null, true);
                else callback(null, false);
            },
            
            methods: middlewares.cors.methods,
            allowedHeaders: middlewares.cors.headers,
            credentials: middlewares.cors.credentials
        };

        this.handler = cors(options);
    }

    use(req: Request, res: Response, next: NextFunction): void {
        this.handler(req, res, next);
    }
}
