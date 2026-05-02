/**
 * @file InvalidCode.ts
 * @description Exception thrown when a verification code does not match any active record for the user.
 * @author Lucas
 * @license MIT
 */

import { ApiErrorCodes } from '@astra/core';
import { BaseException } from '../../Base';

export class InvalidCodeException extends BaseException {
    constructor(details?: string[]) {
        super(ApiErrorCodes.INVALID_CODE, details);
    }
}