/**
 * @file RefreshTokenInvalid.ts
 * @description Custom exception class used to indicate invalid refresh token.
 * @author Lucas
 * @license MIT
 */

import { ApiErrorCodes } from '@astra/core';
import { BaseException } from '../../Base';

export class InvalidRefreshTokenException extends BaseException {
    constructor() {
        super(ApiErrorCodes.INVALID_REFRESH_TOKEN);
    }
}