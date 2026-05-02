/**
 * @file RoleRules.ts
 * @description Role structure rules
 * @author Lucas
 * @license MIT
 */

export const RoleRules = {
    NAME: {
        MIN_LENGTH: 5,
        MAX_LENGTH: 15,
        REGEX: /^[A-Za-zÀ-ÖØ-öø-ÿ0-9]+(?: [A-Za-zÀ-ÖØ-öø-ÿ0-9]+)*$/
    },

    DESCRIPTION: {
        MIN_LENGTH: 10,
        MAX_LENGTH: 250
    }
} as const;
