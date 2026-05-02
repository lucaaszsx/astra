/**
 * @file CodeMissing.ts
 * @description Exception thrown when a verification code is expected but not provided.
 * @author Lucas
 * @license MIT
 */

import { ApiErrorCodes } from '@astra/core';
import { BaseException } from '../../Base';

export class CodeMissingException extends BaseException {
    constructor(details?: string[]) {
        super(ApiErrorCodes.CODE_MISSING, details);
    }
}