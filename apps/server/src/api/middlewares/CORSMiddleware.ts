/**
 * @file CORSMiddleware.ts
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
    private static readonly handler = cors({
        origin: (origin, callback) => {
            const allowedOrigins = Env.Server.middlewares.cors.origins;

            if (!origin || allowedOrigins.includes(origin)) callback(null, true);
            else callback(null, false);
        },
        
        methods: Env.Server.middlewares.cors.methods,
        allowedHeaders: Env.Server.middlewares.cors.headers,
        credentials: Env.Server.middlewares.cors.credentials,
    } satisfies CorsOptions);

    use(req: Request, res: Response, next: NextFunction): void {
        CorsMiddleware.handler(req, res, next);
    }
}