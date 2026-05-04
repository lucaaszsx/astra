/**
 * @file AuthRequests.ts
 * @description Request DTO classes for auth endpoints.
 * @author Lucas
 * @license MIT
 */

import { IsRequiredEmail, IsRequiredString, IsStrongPassword } from '@/decorators';
import { UserRules } from '@astra/core';

export class RegisterRequest {
    @IsRequiredString(UserRules.NAME.MIN_LENGTH, UserRules.NAME.MAX_LENGTH, UserRules.NAME.REGEX)
    public name: string;

    @IsRequiredEmail()
    public email: string;

    @IsStrongPassword()
    public password: string;
}

export class LoginRequest {
    @IsRequiredEmail()
    public email: string;

    @IsStrongPassword()
    public password: string;
}

export class RefreshRequest {
    @IsRequiredString()
    public refreshToken: string;
}
