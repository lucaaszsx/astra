/**
 * @file RoleErrors.ts
 * @description Error codes of roles validations
 * @author Lucas
 * @license MIT
 */

export const RoleErrors = {
    NAME: {
        TOO_SHORT: 'ROLE.NAME.MIN_LENGTH',
        TOO_LONG: 'ROLE.NAME.MAX_LENGTH',
        INVALID_FORMAT: 'ROLE.NAME.INVALID_FORMAT'
    },

    DESCRIPTION: {
        TOO_SHORT: 'ROLE.DESCRIPTION.MIN_LENGTH',
        TOO_LONG: 'ROLE.DESCRIPTION.MAX_LENGTH'
    }
} as const;
