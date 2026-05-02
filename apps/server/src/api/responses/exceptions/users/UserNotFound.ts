/**
 * @file UserNotFound.ts
 * @description Exception thrown when a requested user could not be found in the system.
 *
 * @author Lucas
 * @license MIT
 */

import { ApiErrorCodes } from '@astra/core';
import { BaseException } from '../Base';

export class UserNotFoundException extends BaseException {
    constructor(details?: string[]) {
        super(ApiErrorCodes.USER_NOT_FOUND, details);
    }
}
