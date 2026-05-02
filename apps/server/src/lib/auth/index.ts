/**
 * @file index.ts
 * @description Authentication utilities: JWT signing/verification and refresh token hashing.
 * @author Lucas
 * @license MIT
 */

import jwt, { type SignOptions, type JwtPayload } from 'jsonwebtoken';
import { Env } from '@/config/env';
import * as crypto from 'crypto';

export interface AccessTokenPayload {
    sub: string; // user id
}

export interface RefreshTokenPayload {
    sub:       string; // user id
    sessionId: string;
}

export interface TokenPair {
    accessToken:  string;
    refreshToken: string;
}

/**
 * Signs a JWT access token for the given user.
 */
export function signAccessToken(userId: string): string {
    const payload: AccessTokenPayload = { sub: userId };
    const options: SignOptions = { expiresIn: Env.Jwt.accessExpiresIn as any };

    return jwt.sign(payload, Env.Jwt.accessSecret, options);
}

/**
 * Signs a JWT refresh token tied to a specific session.
 */
export function signRefreshToken(userId: string, sessionId: string): string {
    const payload: RefreshTokenPayload = { sub: userId, sessionId };
    const options: SignOptions = { expiresIn: Env.Jwt.refreshExpiresIn as any };

    return jwt.sign(payload, Env.Jwt.refreshSecret, options);
}

/**
 * Verifies and decodes an access token.
 * Throws if the token is invalid or expired.
 */
export function verifyAccessToken(token: string): AccessTokenPayload {
    return jwt.verify(token, Env.Jwt.accessSecret) as AccessTokenPayload;
}

/**
 * Verifies and decodes a refresh token.
 * Throws if the token is invalid or expired.
 */
export function verifyRefreshToken(token: string): RefreshTokenPayload {
    return jwt.verify(token, Env.Jwt.refreshSecret) as RefreshTokenPayload;
}

/**
 * Generates a cryptographically secure random refresh token string.
 */
export function generateRefreshTokenValue(): string {
    return crypto.randomBytes(64).toString('hex');
}

/**
 * Hashes a refresh token value with SHA-256 for safe storage.
 */
export function hashRefreshToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Calculates the expiry Date for a refresh token based on JWT_REFRESH_EXPIRES_IN.
 * Supports formats: 7d, 24h, 60m, 3600s.
 */
export function getRefreshTokenExpiry(): Date {
    const raw   = Env.Jwt.refreshExpiresIn;
    const unit  = raw.slice(-1);
    const value = parseInt(raw.slice(0, -1), 10);

    const ms: Record<string, number> = {
        d: 86_400_000,
        h: 3_600_000,
        m: 60_000,
        s: 1_000
    };

    if (!ms[unit] || isNaN(value)) {
        throw new Error(`Invalid JWT_REFRESH_EXPIRES_IN format: "${raw}". Expected e.g. "7d", "24h".`);
    }

    return new Date(Date.now() + value * ms[unit]);
}