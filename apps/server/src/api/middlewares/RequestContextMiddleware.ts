/**
 * @file RequestContextMiddleware.ts
 * @description Middleware responsible for setting up context application middleware.
 * @author Lucas
 * @license MIT
 */

import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers';
import { type RequestContext, loggerContext } from '@/lib/logger';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Service } from 'typedi';

@Middleware({ type: 'before' })
@Service()
export default class RequestContextMiddleware implements ExpressMiddlewareInterface {
    use(req: Request, res: Response, next: NextFunction): void {
        const context: RequestContext = {
            requestId: (req.headers['X-Request-Id'] || uuidv4()) as string,
            identifier: 'unknown',
            method: req.method,
            path: req.path
        };

        if (req.user?.id) context.identifier = req.user.id;

        res.header('X-Request-Id', context.requestId);

        loggerContext.run(context, () => next());
    }
}
