/**
 * @file Base.ts
 * @description Base exception class for all API response errors.
 *
 * @author Lucas
 * @license Apache-2.0
 */

import { ApiErrorCodes } from '@fc/core';

export class BaseException extends Error {
    public readonly apiCode: ApiErrorCodes;
    public readonly details: string[];

    constructor(apiCode: number, details: string[] = []) {
        super(`E${apiCode}`);

        this.apiCode = apiCode;
        this.details = details;
        this.name = this.constructor.name;

        Object.setPrototypeOf(this, BaseException.prototype);
    }
}