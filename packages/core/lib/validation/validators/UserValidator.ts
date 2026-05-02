/**
 * @file UserValidator.ts
 * @description User data validator with static methods for name, email and password checks
 * Returns a standardized errors based on user rules
 *
 * @author Lucas
 * @license MIT
 */

import { UserErrorCode } from '../../types/Validation';
import { UserErrors, ErrorList } from '../errors';
import { BaseValidator } from './BaseValidator';
import { UserRules } from '../rules';

const { NAME: nameRules, EMAIL: emailRules, PASSWORD: passRules } = UserRules;

export class UserValidator extends BaseValidator {
    public static isValidUsername(entry: string): ErrorList<UserErrorCode> {
        const errors = new ErrorList<UserErrorCode>();

        this.checkLength(
            entry,
            nameRules.MIN_LENGTH,
            nameRules.MAX_LENGTH,
            errors,
            UserErrors.NAME.TOO_SHORT,
            UserErrors.NAME.TOO_LONG
        );

        if (!nameRules.REGEX.test(entry)) errors.append(UserErrors.NAME.INVALID_FORMAT);

        return errors;
    }

    public static isValidPassword(entry: string): ErrorList<UserErrorCode> {
        const errors = new ErrorList<UserErrorCode>();

        this.checkLength(
            entry,
            passRules.MIN_LENGTH,
            passRules.MAX_LENGTH,
            errors,
            UserErrors.PASSWORD.TOO_SHORT,
            UserErrors.PASSWORD.TOO_LONG
        );

        if (!passRules.REGEX.FULL.test(entry)) {
            errors.append(UserErrors.PASSWORD.INVALID_FORMAT);

            if (!passRules.REGEX.LOWER.test(entry))
                errors.append(UserErrors.PASSWORD.MISSING_LOWERCASE);
            if (!passRules.REGEX.UPPER.test(entry))
                errors.append(UserErrors.PASSWORD.MISSING_UPPERCASE);
            if (!passRules.REGEX.NUMBER.test(entry))
                errors.append(UserErrors.PASSWORD.MISSING_NUMBER);
            if (!passRules.REGEX.SPECIAL.test(entry))
                errors.append(UserErrors.PASSWORD.MISSING_SPECIAL);
        }

        return errors;
    }

    public static isValidEmail(entry: string): ErrorList<UserErrorCode> {
        const errors = new ErrorList<UserErrorCode>();

        this.checkLength(
            entry,
            emailRules.MIN_LENGTH,
            emailRules.MAX_LENGTH,
            errors,
            UserErrors.EMAIL.TOO_SHORT,
            UserErrors.EMAIL.TOO_LONG
        );

        if (!emailRules.REGEX.test(entry)) errors.append(UserErrors.EMAIL.INVALID_FORMAT);

        return errors;
    }
}
