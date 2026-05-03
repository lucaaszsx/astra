/**
 * @file RateLimitMiddleware.ts
 * @description Middleware responsible for applying rate limiting to incoming requests.
 * Integrates configuration from environment variables and uses express-rate-limit.
 * @author Lucas
 * @license MIT
 */

import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';
import { TooManyRequestsException } from '../responses';
import { Env } from '@/config/env';
import { Service } from 'typedi';
import rateLimit from 'express-rate-limit';

@Middleware({ type: 'before' })
@Service()
export default class RateLimitMiddleware implements ExpressMiddlewareInterface {
    private static readonly limiter = rateLimit({
        windowMs: Env.Server.middlewares.rateLimit.windowMs,
        max: Env.Server.middlewares.rateLimit.max,
        standardHeaders: Env.Server.middlewares.rateLimit.standardHeaders,
        legacyHeaders: Env.Server.middlewares.rateLimit.legacyHeaders,
        handler: (_req, _res, next) => next(new TooManyRequestsException()),
    });

    use(req: Request, res: Response, next: NextFunction): void {
        RateLimitMiddleware.limiter(req, res, next);
    }
}