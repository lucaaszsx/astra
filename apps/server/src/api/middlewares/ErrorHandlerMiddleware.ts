/**
 * @file ErrorHandlerMiddleware.ts
 * @description Error handler middleware responsible for catching and handling all application exceptions.
 * Maps custom exceptions to appropriate HTTP status codes and API responses.
 * Provides detailed validation error feedback for client-side debugging.
 * @author Lucas
 * @license MIT
 */

import {
    ExpressErrorMiddlewareInterface,
    BadRequestError,
    Middleware,
    HttpError
} from 'routing-controllers';
import { BaseException, NotFoundException } from '../responses';
import { type ApiResponse, ApiErrorCodes } from '@astra/core';
import { ValidationError } from 'class-validator';
import type { Request, Response } from 'express';
import type { LoggerInterface } from '@/lib/logger';
import { LoggerDecorator } from '@/decorators';
import { sendApiResponse } from '../responses';
import { Env } from '@/config/env';
import { Service } from 'typedi';

interface ExtendedBadRequestError extends BadRequestError {
    errors?: ValidationError[];
}

@Middleware({ type: 'after' })
@Service()
export default class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
    /**
     * Maps HTTP status codes to their corresponding API error codes.
     * Used as a fallback for generic HttpErrors not caught by more specific handlers.
     */
    private static readonly HTTP_CODE_MAP: Partial<Record<number, ApiErrorCodes>> = {
        401: ApiErrorCodes.UNAUTHORIZED,
        403: ApiErrorCodes.FORBIDDEN,
    };

    private readonly STACK_TRACE_LINES = 3;

    constructor(
        @LoggerDecorator(__filename)
        private readonly logger: LoggerInterface
    ) {}

    error(error: unknown, req: Request, res: Response<ApiResponse>): Response<ApiResponse> | void {
        this.logError(error, req);

        if (error instanceof BaseException) return this.handleCustomException(error, req, res);
        if (error instanceof BadRequestError) return this.handleBadRequestError(error, req, res);
        if (this.isValidationErrorArray(error)) return this.handleValidationErrors(error.errors, req, res);
        if (error instanceof HttpError) return this.handleHttpError(error, req, res);

        return this.handleUnexpectedError(error, req, res);
    }

    /**
     * Logs the error with appropriate severity.
     * Expected errors (e.g. not found, validation) are logged as warnings to reduce noise.
     * Unexpected errors include stack trace and request metadata for debugging.
     */
    private logError(error: unknown, req: Request): void {
        const name = (error as any)?.name ?? 'UnknownError';
        const message = (error as any)?.message ?? String(error);
        const logMessage = `[${name}] ${message} | ${req.method} ${req.url} | IP: ${req.ip}`;

        if (this.isExpectedError(error)) {
            this.logger.warn(logMessage);
            return;
        }

        this.logger.error(logMessage, {
            error: message,
            stack: (error as any)?.stack?.split('\n').slice(0, this.STACK_TRACE_LINES).join('\n'),
            userAgent: req.get('User-Agent'),
        });
    }

    /**
     * Checks whether the error is an expected application error (not found, validation).
     * Uses instanceof instead of name-string matching to be refactor-safe.
     */
    private isExpectedError(error: unknown): boolean {
        return error instanceof NotFoundException;
    }

    private handleCustomException(
        error: BaseException,
        req: Request,
        res: Response<ApiResponse>
    ): Response<ApiResponse> {
        return sendApiResponse(req, res, {
            apiCode: error.apiCode,
            errorDetails: error.details,
        });
    }

    /**
     * Handles BadRequestError from routing-controllers, which may carry class-validator
     * errors in the `errors` field when validation fails on a @Body() parameter.
     */
    private handleBadRequestError(
        error: BadRequestError,
        req: Request,
        res: Response<ApiResponse>
    ): Response<ApiResponse> {
        const extendedError = error as ExtendedBadRequestError;

        if (this.isValidationErrorArray(extendedError)) {
            return this.handleValidationErrors(extendedError.errors!, req, res);
        }

        return sendApiResponse(req, res, {
            apiCode: ApiErrorCodes.VALIDATION_FAILED,
            errorDetails: [error.message || 'Invalid request body'],
        });
    }

    private handleValidationErrors(
        errors: ValidationError[],
        req: Request,
        res: Response<ApiResponse>
    ): Response<ApiResponse> {
        return sendApiResponse(req, res, {
            apiCode: ApiErrorCodes.VALIDATION_FAILED,
            errorDetails: this.extractValidationErrors(errors),
        });
    }

    private handleHttpError(
        error: HttpError,
        req: Request,
        res: Response<ApiResponse>
    ): Response<ApiResponse> {
        const apiCode =
            ErrorHandlerMiddleware.HTTP_CODE_MAP[error.httpCode] ??
            ApiErrorCodes.INTERNAL_SERVER_ERROR;

        return sendApiResponse(req, res, {
            apiCode,
            errorDetails: [error.message || 'Unexpected error'],
        });
    }

    private handleUnexpectedError(
        error: unknown,
        req: Request,
        res: Response<ApiResponse>
    ): Response<ApiResponse> {
        return sendApiResponse(req, res, {
            apiCode: ApiErrorCodes.INTERNAL_SERVER_ERROR,
            // Expose error details only in development to avoid leaking internals
            errorDetails: Env.node === 'dev'
                ? [(error as any)?.message || 'Internal server error']
                : undefined,
        });
    }

    /**
     * Type predicate that checks whether an error carries a non-empty array of ValidationErrors.
     * Handles both raw ValidationError arrays and wrapped objects (e.g. from routing-controllers).
     */
    private isValidationErrorArray(error: unknown): error is { errors: ValidationError[] } {
        return (
            Array.isArray((error as any)?.errors) &&
            (error as any).errors.length > 0 &&
            (error as any).errors.every(
                (e: any) => e instanceof ValidationError || (e.property && e.constraints)
            )
        );
    }

    /**
     * Recursively extracts validation error messages from a nested ValidationError tree.
     * Builds dot-notation property paths for nested fields (e.g. `address.street`).
     */
    private extractValidationErrors(errors: ValidationError[], parentPath = ''): string[] {
        const messages: string[] = [];

        for (const error of errors) {
            const propertyPath = parentPath ? `${parentPath}.${error.property}` : error.property;

            if (error.constraints) {
                for (const constraint of Object.values(error.constraints)) {
                    messages.push(`${propertyPath}: ${constraint}`);
                }
            }

            if (error.children?.length) {
                messages.push(...this.extractValidationErrors(error.children, propertyPath));
            }
        }

        return messages;
    }
}