/**
 * @file Validation.ts
 * @description Validation types
 * @author Lucas
 * @license MIT
 */

import { UserErrors } from '../validation/errors/UserErrors';
import { RoleErrors } from '../validation/errors/RoleErrors';

/** Validation errors */
type AllErrorCodes<T> = T extends any ? T[keyof T] : never;

export type UserErrorCode = AllErrorCodes<(typeof UserErrors)[keyof typeof UserErrors]>;
export type RoleErrorCode = AllErrorCodes<(typeof RoleErrors)[keyof typeof RoleErrors]>;
