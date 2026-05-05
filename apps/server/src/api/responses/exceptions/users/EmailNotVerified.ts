/**
 * @file EmailNotVerified.ts
 * @description Exception thrown when a login attempt is made before
 * the user has verified their email address.
 *
 * @author Lucas
 * @license MIT
 */

import { ApiErrorCodes } from '@astra/core';
import { BaseException } from '../Base';

export class EmailNotVerifiedException extends BaseException {
    constructor() {
        super(ApiErrorCodes.EMAIL_NOT_VERIFIED);
    }
}
