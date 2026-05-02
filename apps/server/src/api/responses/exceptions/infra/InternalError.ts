/**
 * @file InternalError.ts
 * @description Custom exception class used to indicate an internal server error.
 *
 * @author Lucas
 * @license Apache-2.0
 */

import { ApiErrorCodes } from '@fc/core';
import { BaseException } from '../Base';

export class InternalErrorException extends BaseException {
    constructor(details?: string[]) {
        super(ApiErrorCodes.INTERNAL_SERVER_ERROR, details);
    }
}
