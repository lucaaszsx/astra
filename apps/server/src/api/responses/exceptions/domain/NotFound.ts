/**
 * @file NotFound.ts
 * @description Custom exception class used to indicate that a requested route was not found.
 *
 * @author Lucas
 * @license Apache-2.0
 */

import { ApiErrorCodes } from '@vsa/core';
import { BaseException } from '../Base';

export class NotFoundException extends BaseException {
    constructor(details?: string[]) {
        super(ApiErrorCodes.NOT_FOUND, details);
    }
}
