/**
 * @file ApiMessages.ts
 * @description Maps internal API error codes to user-friendly error messages.
 *
 * @author Lucas
 * @license MIT
 */

import { ApiErrorCodes } from './ApiCodes';

export const ApiErrorMessages: Record<ApiErrorCodes, string> = {
    // ────────────────────────────────
    // General / Server Errors
    // ────────────────────────────────
    [ApiErrorCodes.INTERNAL_SERVER_ERROR]:
        'Internal server error encountered during request processing',
    [ApiErrorCodes.TOO_MANY_REQUESTS]: 'Rate limit exceeded due to excessive request frequency',
    [ApiErrorCodes.SERVICE_UNAVAILABLE]:
        'Service is currently unavailable due to maintenance or overload',
    [ApiErrorCodes.NOT_IMPLEMENTED]:
        'Requested functionality is not available in the current version',
    [ApiErrorCodes.BAD_GATEWAY]: 'Failed to establish a valid response from the upstream server',
    [ApiErrorCodes.NOT_FOUND]: 'Requested endpoint does not exist on this server',

    // ────────────────────────────────
    // Authentication & Authorization
    // ────────────────────────────────
    [ApiErrorCodes.AUTHENTICATION_FAILED]: 'The credentials provided are invalid or do not match',
    [ApiErrorCodes.FORBIDDEN]: 'Access denied due to insufficient permissions',
    [ApiErrorCodes.INVALID_CODE]: 'Provided code is invalid or does not match the expected format',
    [ApiErrorCodes.CODE_MISSING]:
        'Verification code is required but was not provided in the request',
    [ApiErrorCodes.CODE_EXPIRED]: 'Verification code has expired and is no longer valid',
    [ApiErrorCodes.CODE_ALREADY_USED]:
        'Verification code has already been used and cannot be reused',
    [ApiErrorCodes.REFRESH_TOKEN_MISSING]: 'No refresh token provided in the request',
    [ApiErrorCodes.INVALID_REFRESH_TOKEN]: 'Refresh token is malformed or invalid',
    [ApiErrorCodes.REFRESH_TOKEN_EXPIRED]: 'Refresh token has expired and is no longer valid',
    [ApiErrorCodes.ACCESS_TOKEN_MISSING]: 'No access token provided in the request',
    [ApiErrorCodes.INVALID_ACCESS_TOKEN]: 'Access token is malformed or invalid',
    [ApiErrorCodes.ACCESS_TOKEN_EXPIRED]: 'Access token has expired and is no longer valid',
    [ApiErrorCodes.UNAUTHORIZED]: 'Authentication is required to access this resource',

    // ────────────────────────────────
    // Validation Errors
    // ────────────────────────────────
    [ApiErrorCodes.VALIDATION_FAILED]: 'Input validation failed for one or more fields',

    // ────────────────────────────────
    // File Upload / Media Errors
    // ────────────────────────────────
    [ApiErrorCodes.FILE_TOO_LARGE]: 'Uploaded file exceeds the maximum allowed size',
    [ApiErrorCodes.UNSUPPORTED_FILE_TYPE]: 'Uploaded file type is not supported',
    [ApiErrorCodes.FILE_UPLOAD_FAILED]: 'File upload failed due to an internal error',
    [ApiErrorCodes.FILE_NOT_FOUND]: 'Requested file could not be found',

    // ────────────────────────────────
    // External Communication Errors
    // ────────────────────────────────
    [ApiErrorCodes.EMAIL_CANNOT_BE_SENT]: 'Failed to send email, please try again later',

    // ────────────────────────────────
    // Cryptographic / Security Errors
    // ────────────────────────────────
    [ApiErrorCodes.HASHING_ERROR]: 'A cryptographic error occurred during request processing',

    // ────────────────────────────────
    // User Management Errors
    // ────────────────────────────────
    [ApiErrorCodes.USER_ALREADY_EXISTS]: 'A user with this identifier already exists',
    [ApiErrorCodes.USER_NOT_FOUND]: 'Requested user could not be found',
    [ApiErrorCodes.EMAIL_ALREADY_EXISTS]: 'An account with this email address already exists',
    [ApiErrorCodes.EMAIL_NOT_VERIFIED]: 'Email address has not been verified',
    [ApiErrorCodes.USERNAME_ALREADY_EXISTS]: 'An account with this username already exists'
};