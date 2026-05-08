/**
 * @file Validation.ts
 * @description Validation types
 * @author Lucas
 * @license MIT
 */

import { UserErrors } from '../validation/errors/UserErrors';

/** Validation errors */
type AllErrorCodes<T> = T extends any ? T[keyof T] : never;

export type UserErrorCode = AllErrorCodes<(typeof UserErrors)[keyof typeof UserErrors]>;
