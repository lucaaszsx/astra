/**
 * @file types.ts
 * @description Shared type definitions for the auth lib.
 * @author Lucas
 * @license MIT
 */

/** Payload embedded in every signed access token. */
export interface AccessTokenPayload {
    sub: string;
    sessionId: string;
}

/** AccessTokenPayload after JWT verification — includes standard JWT claims. */
export interface DecodedAccessToken extends AccessTokenPayload {
    iat: number;
    exp: number;
}

/**
 * A token pair issued after a successful login or token rotation.
 * The access token is returned in the response body; the refresh token
 * is set as an httpOnly cookie by CookieService.
 */
export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}