/**
 * @file RefreshTokenExpired.ts
 * @description Custom exception class used to indicate expired refresh token.
 * @author Lucas
 * @license MIT
 */

import { ApiErrorCodes } from '@astra/core';
import { BaseException } from '../../Base';

export class RefreshTokenExpiredException extends BaseException {
    constructor() {
        super(ApiErrorCodes.REFRESH_TOKEN_EXPIRED);
    }
}