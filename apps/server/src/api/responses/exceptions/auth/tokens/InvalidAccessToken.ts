/**
 * @file InvalidAccessToken.ts
 * @description Custom exception class used to indicate invalid access token.
 * @author Lucas
 * @license MIT
 */

import { ApiErrorCodes } from '@astra/core';
import { BaseException } from '../../Base';

export class InvalidAccessTokenException extends BaseException {
    constructor() {
        super(ApiErrorCodes.INVALID_ACCESS_TOKEN);
    }
}