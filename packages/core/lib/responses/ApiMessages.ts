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
    [ApiErrorCodes.REFRESH_TOKEN_MISSING]: 'Refresh token is missing from the request',
    [ApiErrorCodes.INVALID_REFRESH_TOKEN]: 'Provided refresh token is invalid or malformed',
    [ApiErrorCodes.REFRESH_TOKEN_EXPIRED]: 'Refresh token has expired and can no longer be used',
    [ApiErrorCodes.ACCESS_TOKEN_MISSING]: 'Access token is missing from the request',
    [ApiErrorCodes.INVALID_ACCESS_TOKEN]: 'Provided access token is invalid or malformed',
    [ApiErrorCodes.ACCESS_TOKEN_EXPIRED]: 'Access token has expired, please refresh your session',
    [ApiErrorCodes.UNAUTHORIZED]: 'Authentication is required to access this resource',
    [ApiErrorCodes.FORBIDDEN]: 'You do not have permission to perform this action',

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
    // Group & Messaging Errors
    // ────────────────────────────────
    [ApiErrorCodes.GROUP_NOT_FOUND]: 'Requested group could not be found',
    [ApiErrorCodes.GROUP_ALREADY_EXISTS]: 'A group with this identifier already exists',
    [ApiErrorCodes.NOT_GROUP_OWNER]: 'You are not the owner of this group',
    [ApiErrorCodes.CANNOT_LEAVE_AS_GROUP_OWNER]: 'Group owner cannot leave without transferring ownership',
    [ApiErrorCodes.ALREADY_GROUP_MEMBER]: 'You are already a member of this group',
    [ApiErrorCodes.NOT_GROUP_MEMBER]: 'You are not a member of this group',
    [ApiErrorCodes.CANNOT_REMOVE_OWNER]: 'The group owner cannot be removed from the group',
    [ApiErrorCodes.MESSAGE_NOT_FOUND]: 'Requested message could not be found',
    [ApiErrorCodes.NOT_MESSAGE_AUTHOR]: 'You are not the author of this message',
    [ApiErrorCodes.REPLY_MESSAGE_NOT_FOUND]: 'Message being replied to could not be found',

    // ────────────────────────────────
    // User Management Errors
    // ────────────────────────────────
    [ApiErrorCodes.USER_ALREADY_EXISTS]: 'A user with this identifier already exists',
    [ApiErrorCodes.USER_NOT_FOUND]: 'Requested user could not be found',
    [ApiErrorCodes.EMAIL_ALREADY_EXISTS]: 'An account with this email address already exists',
    [ApiErrorCodes.EMAIL_NOT_VERIFIED]: 'Email address has not been verified',
    [ApiErrorCodes.USERNAME_ALREADY_EXISTS]: 'An account with this username already exists'
};