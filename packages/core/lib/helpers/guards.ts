/**
 * @file guards.ts
 * @description Type guard utilities for runtime type narrowing.
 * @author Lucas
 * @license MIT
 */

import type { ApiResponse } from '../types/ApiResponse';

/**
 * Checks whether an unknown value is a valid ApiResponse object.
 */
export function isApiResponse(value: unknown): value is ApiResponse {
    return (
        typeof value === 'object' &&
        value !== null &&
        'statusCode' in value &&
        'apiCode'    in value &&
        'success'    in value
    );
}