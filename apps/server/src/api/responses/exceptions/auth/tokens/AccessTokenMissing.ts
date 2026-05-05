/**
 * @file AccessTokenMissing.ts
 * @description Custom exception class used to indicate missing access token.
 * @author Lucas
 * @license MIT
 */

import { ApiErrorCodes } from '@astra/core';
import { BaseException } from '../../Base';

export class AccessTokenMissingException extends BaseException {
    constructor() {
        super(ApiErrorCodes.ACCESS_TOKEN_MISSING);
    }
}