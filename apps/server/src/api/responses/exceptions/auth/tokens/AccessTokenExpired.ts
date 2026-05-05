/**
 * @file AccessTokenExpired.ts
 * @description Custom exception class used to indicate expired access token.
 * @author Lucas
 * @license MIT
 */

import { ApiErrorCodes } from '@astra/core';
import { BaseException } from '../../Base';

export class AccessTokenExpiredException extends BaseException {
    constructor() {
        super(ApiErrorCodes.ACCESS_TOKEN_EXPIRED);
    }
}