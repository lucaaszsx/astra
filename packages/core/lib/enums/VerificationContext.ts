/**
 * @file VerificationContext.ts
 * @description Enum representing the possible contexts for a verification code,
 * allowing a single table to serve multiple auth flows.
 * @author Lucas
 * @license MIT
 */

export enum VerificationContext {
    EMAIL_CONFIRMATION = 'email_confirmation',
    PASSWORD_RESET     = 'password_reset'
}