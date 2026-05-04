/**
 * @file ResponseInterceptor.ts
 * @description Global interceptor that syncs the HTTP response status code with
 * the statusCode field embedded in every ApiResponse payload.
 * @author Lucas
 * @license MIT
 */

import {
    type InterceptorInterface,
    type Action,
    Interceptor
} from 'routing-controllers';
import type { ApiResponse } from '@astra/core';
import { Service } from 'typedi';

@Interceptor()
@Service()
export class ResponseInterceptor implements InterceptorInterface {
    intercept(action: Action, content: unknown): unknown {
        if (!this.isApiResponse(content)) return content;

        action.response.status(content.statusCode);

        return content;
    }

    /**
     * Type guard that checks whether the intercepted content is an ApiResponse.
     * Relies on the presence of statusCode and apiCode — both always set by createApiResponse.
     */
    private isApiResponse(value: unknown): value is ApiResponse {
        return (
            typeof value === 'object' &&
            value !== null &&
            'statusCode' in value &&
            'apiCode'    in value &&
            'success'    in value
        );
    }
}