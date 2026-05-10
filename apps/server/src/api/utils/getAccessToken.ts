/**
 * @file getAccessToken.ts
 * @description Gets an access token from a request using the authorization header.
 * @author Lucas
 * @license MIT
 */

import type { Request } from 'express';

export function getAccessToken(req: Request): string | undefined {
    const header = req.headers.authorization;

    if (!header?.startsWith('Bearer ')) return undefined;

    return header.slice(7);
}