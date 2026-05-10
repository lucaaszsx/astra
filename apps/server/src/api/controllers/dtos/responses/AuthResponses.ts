/**
 * @file AuthResponses.ts
 * @description Response DTO classes for auth endpoints.
 * @author Lucas
 * @license MIT
 */

export class AuthTokenResponse {
    public accessToken: string;
    public refreshToken?: string;

    constructor(data: { accessToken: string; refreshToken?: string }) {
        this.accessToken = data.accessToken;

        if (data.refreshToken !== undefined) this.refreshToken = data.refreshToken;
    }
}