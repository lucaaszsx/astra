/**
 * @file CodeExpired.ts
 * @description Exception thrown when a verification code is past its expiry date.
 * @author Lucas
 * @license MIT
 */

import { ApiErrorCodes } from '@astra/core';
import { BaseException } from '../../Base';

export class CodeExpiredException extends BaseException {
    constructor(details?: string[]) {
        super(ApiErrorCodes.CODE_EXPIRED, details);
    }
}