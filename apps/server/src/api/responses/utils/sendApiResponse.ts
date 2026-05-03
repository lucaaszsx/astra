/**
 * @file sendApiResponse.ts
 * @description Send API response utility.
 * @author Lucas
 * @license MIT
 */

import {
    type CreateApiResponseOptions,
    createApiResponse
} from './createApiResponse';
import type { Request, Response } from 'express';
import type { ApiResponse } from '@astra/core';


/**
 * Sends a standardized API response using Express's response object.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 * @param options - Options for constructing the API response.
 *
 * @returns The finalized Express response.
 */
export const sendApiResponse = <T = any>(
    req: Request,
    res: Response<ApiResponse<T>>,
    options: CreateApiResponseOptions<T>
): Response<ApiResponse<T>> => {
    const response = createApiResponse({
        ...options,
        path: options.path ?? req.path
    });

    return res.status(response.statusCode).json(response);
};