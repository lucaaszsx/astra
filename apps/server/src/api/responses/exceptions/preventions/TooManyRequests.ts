/**
 * @file TooManyRequests.ts
 * @description Custom exception class used to indicate that the client has made too many requests.
 *
 * @author Lucas
 * @license Apache-2.0
 */

import { ApiErrorCodes } from '@vsa/core';
import { BaseException } from '../Base';

export class TooManyRequestsException extends BaseException {
    constructor(details?: string[]) {
        super(ApiErrorCodes.TOO_MANY_REQUESTS, details);
    }
}
