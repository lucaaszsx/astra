/**
 * @file BaseController.ts
 * @description Abstract class for all controllers. It has some methods to handle controllers responses to requests.
 * @author Lucas
 * @license MIT
 */

import { type ApiResponse, ApiSuccessCodes } from '@fc/core';
import type { Request as ExpressRequest } from 'express';
import { createApiResponse } from '../responses';

export abstract class BaseController {
    protected ok<T>(request: ExpressRequest, data: T): ApiResponse<T> {
        return createApiResponse<T>({
            apiCode: ApiSuccessCodes.OK,
            path: request.path,
            data
        });
    }

    protected created<T>(request: ExpressRequest, data: T): ApiResponse<T> {
        return createApiResponse<T>({
            apiCode: ApiSuccessCodes.CREATED,
            path: request.path,
            data
        });
    }

    protected updated<T>(request: ExpressRequest, data: T): ApiResponse<T> {
        return createApiResponse<T>({
            apiCode: ApiSuccessCodes.UPDATED,
            path: request.path,
            data
        });
    }

    protected accepted<T>(request: ExpressRequest, data: T): ApiResponse<T> {
        return createApiResponse<T>({
            apiCode: ApiSuccessCodes.ACCEPTED,
            path: request.path,
            data
        });
    }

    protected deleted<T>(request: ExpressRequest, data: T): ApiResponse<T> {
        return createApiResponse<T>({
            apiCode: ApiSuccessCodes.DELETED,
            path: request.path,
            data
        });
    }
}
