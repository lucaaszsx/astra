/**
 * @file index.ts
 * @description Centralized exports of shared library.
 * @author Lucas
 * @license MIT
 */

/** Constants */
export { VERIFICATION_CODE_LENGTH } from './constants/shared';

/** Enums */
export { VerificationContext } from './enums/VerificationContext';
export { UserRole } from './enums/UserRole';

/** Helpers */
export { isApiResponse } from './helpers/guards';

/** Responses */
export { ApiSuccessCodes, ApiErrorCodes } from './responses/ApiCodes';
export { ApiHTTPCodeMap } from './responses/ApiHTTPCodeMap';
export { ApiErrorMessages } from './responses/ApiMessages';

/** Types */
export type { UserErrorCode } from './types/Validation';
export type { ApiResponse } from './types/ApiResponse';

/** Validation */
export { BaseValidator, UserValidator} from './validation/validators';
export { UserErrors, ErrorList } from './validation/errors';
export { UserRules } from './validation/rules';
