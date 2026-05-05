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
import { BaseException } from '../responses/exceptions/Base';
import { type ApiResponse, ApiErrorCodes } from '@astra/core';
import type { LoggerInterface } from '@/lib/logger';
import { ValidationError } from 'class-validator';
import type { Request, Response } from 'express';
import { sendApiResponse } from '../responses';
import { LoggerDecorator } from '@/decorators';
import { Env } from '@/config/env';
import { Service } from 'typedi';

interface ExtendedBadRequestError extends BadRequestError {
    errors?: ValidationError[];
}

@Middleware({ type: 'after' })
@Service()
export default class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
    private readonly STACK_TRACE_LINES = 3;

    constructor(
        @LoggerDecorator(__filename)
        private readonly logger: LoggerInterface
    ) {}

    /** Routes the error to the appropriate handler and logs it accordingly. */
    error(error: unknown, req: Request, res: Response<ApiResponse>): Response<ApiResponse> | void {
        this.logError(error, req);

        if (error instanceof BaseException) return this.handleCustomException(error, req, res);
        if (error instanceof BadRequestError) return this.handleBadRequestError(error, req, res);
        if (this.isValidationErrorArray(error))
            return this.handleValidationErrors(error.errors, req, res);
        if (error instanceof HttpError) return this.handleHttpError(error, req, res);

        return this.handleUnexpectedError(error, req, res);
    }

    /**
     * Logs the error at the appropriate level based on its type.
     * Domain exceptions (`BaseException`) are logged as warnings since they represent
     * expected client errors. Validation errors are silenced entirely. Anything else
     * is logged as an error with a reduced stack trace.
     */
    private logError(error: any, req: Request): void {
        const location = `${req.method} ${req.url}`;

        if (error instanceof BaseException) {
            this.logger.warn(`[${error.name}] ${error.apiCode} | ${location}`);
            return;
        }

        if (this.isValidationErrorArray(error) || error instanceof BadRequestError) return;

        this.logger.error(`[${error?.name ?? 'UnknownError'}] ${error?.message} | ${location}`, {
            stack: error?.stack?.split('\n').slice(0, this.STACK_TRACE_LINES).join('\n')
        });
    }

    /** Handles domain exceptions thrown anywhere in the application. */
    private handleCustomException(
        error: BaseException,
        req: Request,
        res: Response<ApiResponse>
    ): Response<ApiResponse> {
        return sendApiResponse(req, res, {
            apiCode: error.apiCode,
            errorDetails: error.details
        });
    }

    /**
     * Handles `BadRequestError` from routing-controllers, which may carry
     * an array of `class-validator` errors when body validation fails.
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
            errorDetails: [error.message || 'Invalid request body']
        });
    }

    /** Flattens `class-validator` errors into a list of constraint messages. */
    private handleValidationErrors(
        errors: ValidationError[],
        req: Request,
        res: Response<ApiResponse>
    ): Response<ApiResponse> {
        return sendApiResponse(req, res, {
            apiCode: ApiErrorCodes.VALIDATION_FAILED,
            errorDetails: this.extractValidationErrors(errors)
        });
    }

    /** Handles generic HTTP errors thrown by routing-controllers internals. */
    private handleHttpError(
        error: HttpError,
        req: Request,
        res: Response<ApiResponse>
    ): Response<ApiResponse> {
        const apiCode =
            error.httpCode === 401
                ? ApiErrorCodes.UNAUTHORIZED
                : error.httpCode === 403
                  ? ApiErrorCodes.FORBIDDEN
                  : ApiErrorCodes.VALIDATION_FAILED;

        return sendApiResponse(req, res, {
            apiCode,
            errorDetails: [error.message || 'Bad request']
        });
    }

    /**
     * Catch-all for errors that don't match any known type.
     * In development, the raw error message is included in the response to aid debugging.
     */
    private handleUnexpectedError(
        error: any,
        req: Request,
        res: Response<ApiResponse>
    ): Response<ApiResponse> {
        const isDevelopment = Env.node === 'dev';

        return sendApiResponse(req, res, {
            apiCode: ApiErrorCodes.INTERNAL_SERVER_ERROR,
            errorDetails: isDevelopment ? [error.message || 'Internal server error'] : undefined
        });
    }

    /** Checks whether the error object carries a `class-validator` error array. */
    private isValidationErrorArray(error: any): error is { errors: ValidationError[] } {
        return (
            Array.isArray(error?.errors) &&
            error.errors.length > 0 &&
            error.errors.every(
                (e: any) => e instanceof ValidationError || (e.property && e.constraints)
            )
        );
    }

    /**
     * Recursively flattens nested `ValidationError` trees into a flat list of
     * `"property.path: constraint message"` strings.
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