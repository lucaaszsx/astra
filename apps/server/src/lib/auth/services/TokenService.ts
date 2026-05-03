/**
 * @file TokenService.ts
 * @description Handles generation and verification of access tokens (JWT) and
 * refresh tokens (SHA-256 hash of a random UUID stored in the database).
 * @author Lucas
 * @license MIT
 */

import type { AccessTokenPayload, TokenPair } from '../types';
import { createHash, randomUUID } from 'node:crypto';
import { Env } from '@/config/env';
import jwt from 'jsonwebtoken';
import ms from 'ms';

/**
 * Generates and verifies tokens for the access + refresh token rotation flow.
 *
 * Access tokens are short-lived JWTs signed with JWT_ACCESS_SECRET.
 * Refresh tokens are opaque SHA-256 hashes of random UUIDs — never JWTs —
 * stored in the database so they can be individually revoked.
 */
export class TokenService {
    /**
     * Signs a new access token for the given payload.
     * Expiry is driven by JWT_ACCESS_EXPIRES_IN (e.g. "15m").
     */
    public static signAccessToken(payload: AccessTokenPayload): string {
        return jwt.sign(payload, Env.Jwt.accessSecret, {
            expiresIn: Env.Jwt.accessExpiresIn as ms.StringValue
        });
    }

    /**
     * Verifies an access token and returns its decoded payload.
     * Throws a JsonWebTokenError or TokenExpiredError on failure.
     */
    public static verifyAccessToken(token: string): AccessTokenPayload {
        return jwt.verify(token, Env.Jwt.accessSecret) as AccessTokenPayload;
    }

    /**
     * Generates an opaque refresh token.
     * Returns both the raw token (to be set in the cookie) and its SHA-256
     * hash (to be stored in the database — never store the raw value).
     */
    public static generateRefreshToken(): { raw: string; hashed: string } {
        const raw = randomUUID();
        const hashed = createHash('sha256').update(raw).digest('hex');

        return { raw, hashed };
    }

    /**
     * Hashes a raw refresh token for database lookup.
     * Used when validating an incoming cookie value against stored hashes.
     */
    public static hashRefreshToken(raw: string): string {
        return createHash('sha256').update(raw).digest('hex');
    }

    /**
     * Returns the refresh token TTL in milliseconds,
     * derived from JWT_REFRESH_EXPIRES_IN (e.g. "7d").
     */
    public static getRefreshTokenTtlMs(): number {
        return ms(Env.Jwt.refreshExpiresIn as ms.StringValue);
    }

    /**
     * Issues a full token pair for a given user session.
     * The refresh token returned here is the raw value, its needed to hash it before
     * persisting to the database.
     */
    public static issueTokenPair(payload: AccessTokenPayload): TokenPair & { refreshTokenHashed: string } {
        const accessToken = TokenService.signAccessToken(payload);
        const { raw, hashed } = TokenService.generateRefreshToken();

        return { accessToken, refreshToken: raw, refreshTokenHashed: hashed };
    }
}