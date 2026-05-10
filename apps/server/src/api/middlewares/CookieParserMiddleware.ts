/**
 * @file CookieParserMiddleware.ts
 * @description Parses cookies from incoming HTTP requests and populates req.cookies.
 *
 * @author Lucas
 * @license MIT
 */

import { Request, Response, NextFunction } from 'express';
import { Middleware } from 'routing-controllers';
import { Env } from '@/config/env';
import { Service } from 'typedi';
import cookieParser from 'cookie-parser';

@Middleware({ type: 'before', priority: 8 })
@Service()
export default class CookieParserMiddleware {
    private static readonly handler = cookieParser(Env.Server.cookieSecret);

    use(req: Request, res: Response, next: NextFunction): void {
        CookieParserMiddleware.handler(req, res, next);
    }
}