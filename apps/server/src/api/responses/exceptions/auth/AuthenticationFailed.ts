/**
 * @file AuthenticationFailed.ts
 * @description Exception thrown when login credentials are invalid.
 * Intentionally vague to avoid leaking whether the email exists.
 *
 * @author Lucas
 * @license MIT
 */

import { ApiErrorCodes } from '@astra/core';
import { BaseException } from '../Base';

export class AuthenticationFailedException extends BaseException {
    constructor() {
        super(ApiErrorCodes.AUTHENTICATION_FAILED);
    }
}