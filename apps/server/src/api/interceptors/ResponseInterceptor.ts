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
import { isApiResponse } from '@astra/core';
import { Service } from 'typedi';

@Interceptor()
@Service()
export class ResponseInterceptor implements InterceptorInterface {
    intercept(action: Action, content: unknown): unknown {
        if (!isApiResponse(content)) return content;

        action.response.status(content.statusCode);

        return content;
    }
}