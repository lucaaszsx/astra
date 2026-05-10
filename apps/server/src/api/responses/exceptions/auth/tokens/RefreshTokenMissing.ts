/**
 * @file RefreshTokenMissing.ts
 * @description Custom exception class used to indicate missing refresh token.
 * @author Lucas
 * @license MIT
 */

import { ApiErrorCodes } from '@astra/core';
import { BaseException } from '../../Base';

export class RefreshTokenMissingException extends BaseException {
    constructor() {
        super(ApiErrorCodes.REFRESH_TOKEN_MISSING);
    }
}