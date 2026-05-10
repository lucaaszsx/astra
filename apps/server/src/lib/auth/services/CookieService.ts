/**
 * @file CookieService.ts
 * @description Manages the refresh token httpOnly cookie lifecycle.
 * Centralizes cookie name, options, and set/clear operations so no
 * other layer needs to know the cookie configuration details.
 * @author Lucas
 * @license MIT
 */

import type { Request, Response } from 'express';
import { TokenService } from './TokenService';
import { Env } from '@/config/env';

export const REFRESH_TOKEN_COOKIE = 'refresh_token';

export class CookieService {
    private static readonly signed = !!Env.Server.cookieSecret;

    /**
     * Sets the refresh token cookie on the response.
     * The cookie is httpOnly, secure in production, and signed if a cookie secret is configured.
     *
     * @param res - Express response object
     * @param token - Raw refresh token value (not the hash)
     */
    public static setRefreshToken(res: Response, token: string): void {
        res.cookie(REFRESH_TOKEN_COOKIE, token, {
            httpOnly: true,
            signed: CookieService.signed,
            secure: Env.node === 'prod',
            sameSite: 'strict',
            maxAge: TokenService.getRefreshTokenTtlMs()
        });
    }

    /**
     * Retrieves the refresh token from the request cookies.
     * Reads from signedCookies if a secret is configured, otherwise from cookies.
     * Returns undefined if the cookie is missing or the signature is invalid.
     *
     * @param req - Express request object
     * @returns The refresh token string, or undefined if not present/invalid
     */
    public static getRefreshToken(req: Request): string | undefined {
        if (CookieService.signed) {
            const value = req.signedCookies?.[REFRESH_TOKEN_COOKIE];
            return value === false ? undefined : value;
        }

        return req.cookies?.[REFRESH_TOKEN_COOKIE];
    }

    /**
     * Clears the refresh token cookie, effectively logging the client out from the cookie perspective.
     *
     * @param res - Express response object
     */
    public static clearRefreshToken(res: Response): void {
        res.clearCookie(REFRESH_TOKEN_COOKIE, {
            httpOnly: true,
            signed: CookieService.signed,
            secure: Env.node === 'prod',
            sameSite: 'strict'
        });
    }

    /**
     * Returns true when the request identifies itself as a mobile client.
     * 
     * @param req - Express request object
     */
    public static isMobileClient(req: Request): boolean {
        return req.headers['x-client-type'] === 'mobile';
    }
}