/**
 * @file BaseValidator.ts
 * @description Abstract base validator class for all validators
 * @author Lucas
 * @license MIT
 */

import type { ErrorList } from '../errors';

export abstract class BaseValidator {
    public static checkLength<T>(
        entry: string,
        min: number,
        max: number,
        errors: ErrorList<T>,
        tooShortError: T,
        tooLongError: T
    ) {
        if (entry.length < min) errors.append(tooShortError);
        if (entry.length > max) errors.append(tooLongError);
    }
}
