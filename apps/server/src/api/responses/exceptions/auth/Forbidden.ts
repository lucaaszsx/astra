/**
 * @file Forbidden.ts
 * @description Exception thrown when user doesn't have sufficient permissions to access an specific resource
 * @author Lucas
 * @license MIT
 */

import { ApiErrorCodes } from '@astra/core';
import { BaseException } from '../Base';

export class ForbiddenException extends BaseException {
    constructor() {
        super(ApiErrorCodes.FORBIDDEN);
    }
}