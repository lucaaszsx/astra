/**
 * @file index.ts
 * @description Re-exports all email templates.
 * @author Lucas
 * @license MIT
 */

export { emailVerificationTemplate, EMAIL_VERIFICATION_SUBJECT } from './email-verification';
export { passwordChangedTemplate, PASSWORD_CHANGED_SUBJECT } from './password-changed';
export { passwordResetTemplate, PASSWORD_RESET_SUBJECT } from './password-reset';

export type { EmailVerificationTemplateOptions } from './email-verification';
export type { PasswordChangedTemplateOptions } from './password-changed';
export type { PasswordResetTemplateOptions } from './password-reset';
