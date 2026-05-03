/**
 * @file createApiResponse.ts
 * @description Create API response utility.
 * @author Lucas
 * @license MIT
 */

import {
    type ApiResponse,
    ApiErrorMessages,
    ApiSuccessCodes,
    ApiHTTPCodeMap,
    ApiErrorCodes
} from '@astra/core';
import { InternalErrorException } from '../exceptions/infra/InternalError';
import { getReasonPhrase } from 'http-status-codes';
import type { Request, Response } from 'express';

/**
 * Defines the input structure for creating a standardized API response.
 */
export interface CreateApiResponseOptions<T = any> {
    /** Internal response code representing the result of the operation. */
    apiCode: ApiSuccessCodes | ApiErrorCodes;

    /** Optional payload to include in the response. */
    data?: T | null;

    /** In case of error, details will be provided to the user */
    errorDetails?: string[] | undefined;

    /** The API resource path */
    path?: string;
}

/**
 * Creates a standardized API response object based on the given parameters.
 *
 * This function is responsible for building the response structure used across
 * the application, including success flags, API codes, HTTP status codes,
 * payload data, and optional error details.
 *
 * @param options - Object containing API code, data, error details, and optionally the request path.
 *
 * @throws {InternalErrorException} If the provided apiCode is invalid.
 *
 * @returns A structured {@link ApiResponse} object.
 */
export const createApiResponse = <T = any>({
    data = null,
    errorDetails = [],
    apiCode,
    path = 'unknown'
}: CreateApiResponseOptions<T>): ApiResponse<T> => {
    if (
        !Object.values(ApiSuccessCodes).includes(apiCode as number) &&
        !Object.values(ApiErrorCodes).includes(apiCode as number)
    )
        throw new InternalErrorException([
            `Invalid or missing "apiCode" in createApiResponse: ${apiCode}`
        ]);

    const isSuccess = apiCode >= 1000 && apiCode < 2000;
    const statusCode = ApiHTTPCodeMap[apiCode] as string | number;
    const timestamp = new Date().toISOString();

    if (isSuccess) {
        return {
            success: true,
            statusCode,
            apiCode: apiCode as ApiSuccessCodes,
            data: data as T,
            error: null,
            path,
            timestamp
        } as ApiResponse<T>;
    } else {
        const message = isSuccess
            ? getReasonPhrase(statusCode) || 'Unknown message'
            : ApiErrorMessages[apiCode as ApiErrorCodes] ||
              getReasonPhrase(statusCode) ||
              'Unknown message';

        return {
            success: false,
            statusCode,
            apiCode: apiCode as ApiErrorCodes,
            data: null,
            error: {
                message,
                details: errorDetails || ''
            },
            path,
            timestamp
        } as ApiResponse<T>;
    }
};