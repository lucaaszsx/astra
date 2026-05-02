/**
 * @file RequestContextMiddleware.ts
 * @description Middleware responsible for initializing per-request logging context via AsyncLocalStorage.
 * The identifier field is populated later by the authorization layer via loggerContext.updateContext().
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
            requestId: (req.headers['x-request-id'] as string) || uuidv4(),
            identifier: 'anonymous',
            method: req.method,
            path: req.path
        };

        res.setHeader('X-Request-Id', context.requestId);

        loggerContext.run(context, () => next());
    }
}
