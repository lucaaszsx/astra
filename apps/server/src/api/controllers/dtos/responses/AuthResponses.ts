/**
 * @file AuthResponses.ts
 * @description Response DTO classes for auth endpoints.
 * @author Lucas
 * @license MIT
 */

import { PrivateUserModel } from './models';

export class RegisterUserResponse {
    public user: PrivateUserModel;

    constructor(data: RegisterUserResponse) {
        this.user = data.user;
    }
}