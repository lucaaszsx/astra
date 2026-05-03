/**
 * @file ApiResponse.ts
 * @description API response type
 * @author Lucas
 * @license MIT
 */

import { ApiSuccessCodes, ApiErrorCodes } from '../responses/ApiCodes';

export type ApiResponse<T = Record<string, unknown>> =
    | {
          readonly success: true;
          readonly statusCode: number;
          readonly apiCode: ApiSuccessCodes;
          readonly data: T;
          readonly error: null;
          readonly path: string;
          readonly timestamp: string;
      }
    | {
          readonly success: false;
          readonly statusCode: number;
          readonly apiCode: ApiErrorCodes;
          readonly data: null;
          readonly error: { readonly message: string; readonly details: string[] };
          readonly path: string;
          readonly timestamp: string;
      };