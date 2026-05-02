/**
 * @fileoverview Middleware responsible for applying rate limiting to incoming requests.
 * Integrates configuration from environment variables and uses express-rate-limit.
 * @author Lucas
 * @license Apache-2.0
 */

import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';
import { TooManyRequestsException } from '../responses';
import { Env } from '@/config/env';
import { Service } from 'typedi';
import rateLimit from 'express-rate-limit';

const { middlewares } = Env.Server;

@Middleware({ type: 'before' })
@Service()
export default class RateLimitMiddleware implements ExpressMiddlewareInterface {
    private limiter = rateLimit({
        windowMs: middlewares.rateLimit.windowMs,
        max: middlewares.rateLimit.max,
        standardHeaders: middlewares.rateLimit.standardHeaders,
        legacyHeaders: middlewares.rateLimit.legacyHeaders,

        handler: () => {
            throw new TooManyRequestsException();
        }
    });

    use(req: Request, res: Response, next: NextFunction): void {
        this.limiter(req, res, next);
    }
}
