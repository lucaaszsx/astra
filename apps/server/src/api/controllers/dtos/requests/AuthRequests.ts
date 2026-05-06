/**
 * @file AuthRequests.ts
 * @description Request DTO classes for auth endpoints.
 * @author Lucas
 * @license MIT
 */

import { IsRequiredEmail, IsRequiredString, IsStrongPassword } from '@/api/decorators';
import { VERIFICATION_CODE_LENGTH, UserRules } from '@astra/core';

export class RegisterRequest {
    @IsRequiredString(
        UserRules.NAME.MIN_LENGTH,
        UserRules.NAME.MAX_LENGTH,
        UserRules.NAME.REGEX
    )
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

export class VerifyEmailRequest {
    @IsRequiredEmail()
    email: string;

    @IsRequiredString(
        VERIFICATION_CODE_LENGTH,
        VERIFICATION_CODE_LENGTH,
        /^\d+$/
    )
    code: string;
}