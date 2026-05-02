/**
 * @file UserRules.ts
 * @description User structure rules
 * @author Lucas
 * @license MIT
 */

export const UserRules = {
    NAME: {
        MIN_LENGTH: 5,
        MAX_LENGTH: 150,
        REGEX: /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/
    },

    EMAIL: {
        MIN_LENGTH: 5,
        MAX_LENGTH: 254,
        REGEX: /^(?!.*\.\.)[a-z0-9]+([._%+-]?[a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/i
    },

    PASSWORD: {
        MIN_LENGTH: 8,
        MAX_LENGTH: 250,
        REGEX: {
            LOWER: /[a-z]/,
            UPPER: /[A-Z]/,
            NUMBER: /\d/,
            SPECIAL: /[^A-Za-z0-9]/,
            FULL: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/
        }
    }
} as const;
