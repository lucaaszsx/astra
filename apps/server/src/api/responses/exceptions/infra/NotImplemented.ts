/**
 * @file NotImplemented.ts
 * @description Exception for endpoints that exist in routing but have not been implemented yet.
 * Returns 501 Not Implemented so the client knows the route is intentionally pending.
 * 
 * @author Lucas
 * @license MIT
 */

import { ApiErrorCodes } from '@astra/core';
import { BaseException } from '../Base';

export class NotImplementedException extends BaseException {
    constructor(details?: string[]) {
        super(ApiErrorCodes.NOT_IMPLEMENTED, details);
    }
}
