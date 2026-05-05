/**
 * @file AuthResponses.ts
 * @description Response DTO classes for auth endpoints.
 * @author Lucas
 * @license MIT
 */

export class LoginResponse {
    public accessToken: string;

    constructor(data: { accessToken: string }) {
        this.accessToken = data.accessToken;
    }
}
