/**
 * @file CodeAlreadyUsed.ts
 * @description Exception thrown when a verification code has already been consumed.
 * @author Lucas
 * @license MIT
 */

import { ApiErrorCodes } from '@astra/core';
import { BaseException } from '../../Base';

export class CodeAlreadyUsedException extends BaseException {
    constructor(details?: string[]) {
        super(ApiErrorCodes.CODE_ALREADY_USED, details);
    }
}