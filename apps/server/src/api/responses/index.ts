/**
 * @file index.ts
 * @description Central export hub for all exception classes and API response utilities for simplified imports across the application layer. Includes custom exceptions, API response formatters, codes, and HTTP mappings.
 * @author Lucas
 * @license Apache-2.0
 */

/** Exceptions */

// Base
export { BaseException } from './exceptions/Base';

// ────────────────────────────────
// Auth
// ────────────────────────────────
// export { AuthenticationFailedException } from './exceptions/auth/misc/AuthenticationFailed';

// export { RefreshTokenMissingException } from './exceptions/auth/tokens/RefreshTokenMissing';
// export { InvalidRefreshTokenException } from './exceptions/auth/tokens/InvalidRefreshToken';
// export { RefreshTokenExpiredException } from './exceptions/auth/tokens/RefreshTokenExpired';
// export { AccessTokenMissingException } from './exceptions/auth/tokens/AccessTokenMissing';
// export { InvalidAccessTokenException } from './exceptions/auth/tokens/InvalidAccessToken';
// export { AccessTokenExpiredException } from './exceptions/auth/tokens/AccessTokenExpired';

// export { InvalidCodeException } from './exceptions/auth/verification/InvalidCode';
// export { CodeAlreadyUsedException } from './exceptions/auth/verification/CodeAlreadyUsed';
// export { CodeExpiredException } from './exceptions/auth/verification/CodeExpired';
// export { CodeMissingException } from './exceptions/auth/verification/CodeMissing';

// ────────────────────────────────
// Users
// ────────────────────────────────
// export { UserAlreadyExistsException } from './exceptions/users/UserAlreadyExists';
export { UserNotFoundException } from './exceptions/users/UserNotFound';
export { EmailAlreadyExistsException } from './exceptions/users/EmailAlreadyExists';
// export { EmailNotVerifiedException } from './exceptions/users/EmailNotVerified';
// export { UsernameAlreadyExistsException } from './exceptions/users/UsernameAlreadyExists';

// ────────────────────────────────
// Domain
// ────────────────────────────────
export { NotFoundException } from './exceptions/domain/NotFound';

// ────────────────────────────────
// Infrastructure / Internal
// ────────────────────────────────
export { InternalErrorException } from './exceptions/infra/InternalError';

// ────────────────────────────────
// Rate Limiting / Preventions
// ────────────────────────────────
export { TooManyRequestsException } from './exceptions/preventions/TooManyRequests';

/** API Response handler */
export * from './ApiResponse';
