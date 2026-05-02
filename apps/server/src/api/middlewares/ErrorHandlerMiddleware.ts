/**
 * @file ErrorHandlerMiddleware.ts
 * @description Error handler middleware responsible for catching and handling all application exceptions.
 * Maps custom exceptions to appropriate HTTP status codes and API responses.
 * Provides detailed validation error feedback for client-side debugging.
 * @author Lucas
 * @license Apache-2.0
 */

import {
    ExpressErrorMiddlewareInterface,
    BadRequestError,
    Middleware,
    HttpError
} from 'routing-controllers';
import { BaseException } from '../responses/exceptions/Base';
import { type ApiResponse, ApiErrorCodes } from '@astra/core';
import { ValidationError } from 'class-validator';
import type { Request, Response } from 'express';
import { sendApiResponse } from '../responses';
import { LoggerInterface } from '@/lib/logger';
import { LoggerDecorator } from '@/decorators';
import { Env } from '@/config/env';
import { Service } from 'typedi';

interface ExtendedBadRequestError extends BadRequestError {
    errors?: ValidationError[];
}

@Middleware({ type: 'after' })
@Service()
export default class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
    private readonly EXPECTED_ERROR_NAMES = new Set(['NotFoundException', 'ValidationException']);
    private readonly STACK_TRACE_LINES = 3;

    constructor(
        @LoggerDecorator(__filename)
        private readonly logger: LoggerInterface
    ) {}

    error(error: unknown, req: Request, res: Response<ApiResponse>): Response<ApiResponse> | void {
        this.logError(error, req);

        if (error instanceof BaseException) return this.handleCustomException(error, req, res);
        if (error instanceof BadRequestError) return this.handleBadRequestError(error, req, res);
        if (this.isValidationErrorArray(error))
            return this.handleValidationErrors(error.errors, req, res);
        if (error instanceof HttpError) return this.handleHttpError(error, req, res);

        return this.handleUnexpectedError(error, req, res);
    }

    private logError(error: any, req: Request): void {
        const isExpected = this.EXPECTED_ERROR_NAMES.has(error.name);
        const logMessage = `[${error.name}] ${error.message} | ${req.method} ${req.url} | IP: ${req.ip}`;

        if (isExpected) {
            this.logger.warn(logMessage);
            return;
        }

        this.logger.error(logMessage, {
            error: error.message,
            stack: error.stack?.split('\n').slice(0, this.STACK_TRACE_LINES).join('\n'),
            userAgent: req.get('User-Agent')
        });
    }

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

    private handleValidationErrors(
        errors: ValidationError[],
        req: Request,
        res: Response<ApiResponse>
    ): Response<ApiResponse> {
        const details = this.extractValidationErrors(errors);

        return sendApiResponse(req, res, {
            apiCode: ApiErrorCodes.VALIDATION_FAILED,
            errorDetails: details
        });
    }

    private handleHttpError(
        error: HttpError,
        req: Request,
        res: Response<ApiResponse>
    ): Response<ApiResponse> {
        return sendApiResponse(req, res, {
            apiCode: ApiErrorCodes.VALIDATION_FAILED,
            errorDetails: [error.message || 'Bad request']
        });
    }

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

    private isValidationErrorArray(error: any): error is { errors: ValidationError[] } {
        return (
            Array.isArray(error?.errors) &&
            error.errors.length > 0 &&
            error.errors.every(
                (e: any) => e instanceof ValidationError || (e.property && e.constraints)
            )
        );
    }

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
