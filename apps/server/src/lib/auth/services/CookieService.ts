/**
 * @file CookieService.ts
 * @description Manages the refresh token httpOnly cookie lifecycle.
 * Centralizes cookie name, options, and set/clear operations so no
 * other layer needs to know the cookie configuration details.
 * @author Lucas
 * @license MIT
 */

import { TokenService } from './TokenService';
import { Env } from '@/config/env';
import type { Response } from 'express';

export const REFRESH_TOKEN_COOKIE = 'refresh_token';

export class CookieService {
    /**
     * Sets the refresh token cookie on the response.
     * The cookie is httpOnly, preventing client-side JS from accessing it.
     * Secure flag is enabled in production only.
     *
     * @param res - Express response object
     * @param token - Raw refresh token value (not the hash)
     */
    public static setRefreshToken(res: Response, token: string): void {
        res.cookie(REFRESH_TOKEN_COOKIE, token, {
            httpOnly: true,
            secure: Env.node === 'prod',
            sameSite: 'strict',
            maxAge: TokenService.getRefreshTokenTtlMs()
        });
    }

    /**
     * Clears the refresh token cookie, effectively logging the client out
     * from the cookie perspective.
     *
     * @param res - Express response object
     */
    public static clearRefreshToken(res: Response): void {
        res.clearCookie(REFRESH_TOKEN_COOKIE, {
            httpOnly: true,
            secure: Env.node === 'prod',
            sameSite: 'strict'
        });
    }
}