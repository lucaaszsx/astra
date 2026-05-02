/**
 * @file RoleValidator.ts
 * @description Role data validator with static methods for name and description checks
 * Returns a standardized errors based on role rules
 *
 * @author Lucas
 * @license MIT
 */

import { RoleErrorCode } from '../../types/Validation';
import { RoleErrors, ErrorList } from '../errors';
import { BaseValidator } from './BaseValidator';
import { RoleRules } from '../rules';

const { NAME: nameRules, DESCRIPTION: descRules } = RoleRules;

export class RoleValidator extends BaseValidator {
    public static isValidName(entry: string): ErrorList<RoleErrorCode> {
        const errors = new ErrorList<RoleErrorCode>();

        this.checkLength(
            entry,
            nameRules.MIN_LENGTH,
            nameRules.MAX_LENGTH,
            errors,
            RoleErrors.NAME.TOO_SHORT,
            RoleErrors.NAME.TOO_LONG
        );

        if (!nameRules.REGEX.test(entry)) errors.append(RoleErrors.NAME.INVALID_FORMAT);

        return errors;
    }

    public static isValidDescription(entry: string): ErrorList<RoleErrorCode> {
        const errors = new ErrorList<RoleErrorCode>();

        this.checkLength(
            entry,
            descRules.MIN_LENGTH,
            descRules.MAX_LENGTH,
            errors,
            RoleErrors.DESCRIPTION.TOO_SHORT,
            RoleErrors.DESCRIPTION.TOO_LONG
        );

        return errors;
    }
}
