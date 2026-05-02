/**
 * @file JSONParserMiddleware.ts
 * @description Parses incoming request bodies with JSON payloads, making them
 * available under `req.body`.
 * @author Lucas
 * @license Apache-2.0
 */

import { Request, Response, NextFunction } from 'express';
import { Middleware } from 'routing-controllers';
import { json } from 'body-parser';
import { Env } from '@/config/env';
import { Service } from 'typedi';

const { middlewares } = Env.Server;

@Middleware({ type: 'before' })
@Service()
export default class JSONParserMiddleware {
    private readonly parser: (req: Request, res: Response, next: NextFunction) => void;

    constructor() {
        this.parser = json({
            limit: middlewares.json.limit, // prevents overly large request bodies
            strict: true, // only parses valid JSON
            inflate: middlewares.json.inflate // supports gzip/deflate encoded bodies
        });
    }

    use(req: Request, res: Response, next: NextFunction): void {
        this.parser(req, res, next);
    }
}
