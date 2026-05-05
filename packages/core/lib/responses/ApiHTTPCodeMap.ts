/**
 * @file ApiHTTPCodeMap.ts
 * @description Maps internal API codes to corresponding HTTP status codes.
 * @author Lucas
 * @license MIT
 */

import { ApiErrorCodes, ApiSuccessCodes } from './ApiCodes';
import { StatusCodes } from 'http-status-codes';

export const ApiHTTPCodeMap: Record<number, StatusCodes> = {
    // ────────────────────────────────
    // Success Codes
    // ────────────────────────────────
    [ApiSuccessCodes.OK]: StatusCodes.OK,
    [ApiSuccessCodes.CREATED]: StatusCodes.CREATED,
    [ApiSuccessCodes.ACCEPTED]: StatusCodes.ACCEPTED,
    [ApiSuccessCodes.NO_CONTENT]: StatusCodes.NO_CONTENT,
    [ApiSuccessCodes.UPDATED]: StatusCodes.OK,
    [ApiSuccessCodes.DELETED]: StatusCodes.OK,

    // ────────────────────────────────
    // General / Server Errors
    // ────────────────────────────────
    [ApiErrorCodes.INTERNAL_SERVER_ERROR]: StatusCodes.INTERNAL_SERVER_ERROR,
    [ApiErrorCodes.TOO_MANY_REQUESTS]: StatusCodes.TOO_MANY_REQUESTS,
    [ApiErrorCodes.SERVICE_UNAVAILABLE]: StatusCodes.SERVICE_UNAVAILABLE,
    [ApiErrorCodes.NOT_IMPLEMENTED]: StatusCodes.NOT_IMPLEMENTED,
    [ApiErrorCodes.BAD_GATEWAY]: StatusCodes.BAD_GATEWAY,
    [ApiErrorCodes.NOT_FOUND]: StatusCodes.NOT_FOUND,

    // ────────────────────────────────
    // Authentication & Authorization
    // ────────────────────────────────
    [ApiErrorCodes.AUTHENTICATION_FAILED]: StatusCodes.UNAUTHORIZED,
    [ApiErrorCodes.FORBIDDEN]: StatusCodes.FORBIDDEN,
    [ApiErrorCodes.INVALID_CODE]: StatusCodes.BAD_REQUEST,
    [ApiErrorCodes.CODE_MISSING]: StatusCodes.BAD_REQUEST,
    [ApiErrorCodes.CODE_EXPIRED]: StatusCodes.GONE,
    [ApiErrorCodes.CODE_ALREADY_USED]: StatusCodes.CONFLICT,
    [ApiErrorCodes.REFRESH_TOKEN_MISSING]: StatusCodes.UNAUTHORIZED,
    [ApiErrorCodes.INVALID_REFRESH_TOKEN]: StatusCodes.UNAUTHORIZED,
    [ApiErrorCodes.REFRESH_TOKEN_EXPIRED]: StatusCodes.UNAUTHORIZED,
    [ApiErrorCodes.ACCESS_TOKEN_MISSING]: StatusCodes.UNAUTHORIZED,
    [ApiErrorCodes.INVALID_ACCESS_TOKEN]: StatusCodes.UNAUTHORIZED,
    [ApiErrorCodes.ACCESS_TOKEN_EXPIRED]: StatusCodes.UNAUTHORIZED,
    [ApiErrorCodes.UNAUTHORIZED]: StatusCodes.UNAUTHORIZED,

    // ────────────────────────────────
    // Validation Errors
    // ────────────────────────────────
    [ApiErrorCodes.VALIDATION_FAILED]: StatusCodes.BAD_REQUEST,

    // ────────────────────────────────
    // File Upload / Media Errors
    // ────────────────────────────────
    [ApiErrorCodes.FILE_TOO_LARGE]: StatusCodes.REQUEST_TOO_LONG,
    [ApiErrorCodes.UNSUPPORTED_FILE_TYPE]: StatusCodes.UNPROCESSABLE_ENTITY,
    [ApiErrorCodes.FILE_UPLOAD_FAILED]: StatusCodes.INTERNAL_SERVER_ERROR,
    [ApiErrorCodes.FILE_NOT_FOUND]: StatusCodes.NOT_FOUND,

    // ────────────────────────────────
    // External Communication Errors
    // ────────────────────────────────
    [ApiErrorCodes.EMAIL_CANNOT_BE_SENT]: StatusCodes.INTERNAL_SERVER_ERROR,

    // ────────────────────────────────
    // Cryptographic / Security Errors
    // ────────────────────────────────
    [ApiErrorCodes.HASHING_ERROR]: StatusCodes.INTERNAL_SERVER_ERROR,

    // ────────────────────────────────
    // User Management Errors
    // ────────────────────────────────
    [ApiErrorCodes.USER_ALREADY_EXISTS]: StatusCodes.CONFLICT,
    [ApiErrorCodes.USER_NOT_FOUND]: StatusCodes.NOT_FOUND,
    [ApiErrorCodes.EMAIL_ALREADY_EXISTS]: StatusCodes.CONFLICT,
    [ApiErrorCodes.EMAIL_NOT_VERIFIED]: StatusCodes.FORBIDDEN,
    [ApiErrorCodes.USERNAME_ALREADY_EXISTS]: StatusCodes.CONFLICT
};