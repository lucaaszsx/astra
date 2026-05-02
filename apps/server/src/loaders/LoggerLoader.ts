/**
 * @file LoggerLoader.ts
 * @description Configures the Winston logger and loads it into the microframework context.
 * @author Lucas
 * @license MIT
 */

import { MicroframeworkLoader } from 'microframework-w3tec';
import { transports, configure, format } from 'winston';
import { Logger, loggerContext } from '@/lib/logger';
import { mkdirSync, existsSync } from 'node:fs';
import { Env } from '@/config/env';
import DailyRotateFile from 'winston-daily-rotate-file';

const { logs: logConfig } = Env.App;
const normalizeMessage = format((info) => {
    if (info.message instanceof Error) {
        info.stack = info.message.stack;
        info.message = info.message.message;
    }

    if (typeof info.message === 'object') info.message = JSON.stringify(info.message, null, 2);

    return info;
});

const contextFormat = format((info) => {
    return { ...info, ...loggerContext.getContext() };
});

export const LoggerLoader: MicroframeworkLoader = async (): Promise<void> => {
    if (!existsSync(logConfig.dirname)) mkdirSync(logConfig.dirname, { recursive: true });

    const baseFormat = format.combine(
        format.splat(),
        normalizeMessage(),
        contextFormat(),
        format.errors({ stack: true }),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
    );
    const devFormat = format.combine(
        baseFormat,
        format.colorize({ all: true }),
        format.printf((info) => {
            const {
                timestamp,
                level,
                message,
                stack,
                requestId,
                identifier,
                method,
                path,
                ...meta
            } = info;

            const contextStr = requestId
                ? `[${requestId}${identifier ? ` | ${identifier}` : ''}${method && path ? ` | ${method} ${path}` : ''}]`
                : '';

            const metaStr =
                Object.keys(meta).length > 0 ? `\n${JSON.stringify(meta, null, 2)}` : '';

            return `${timestamp} - [${level}] ${contextStr ? `${contextStr} ` : ''}${message}${stack ? `\n${stack}` : ''}${metaStr}`;
        })
    );
    const prodFormat = format.combine(baseFormat, format.json());

    const chosenFormat = Env.node === 'dev' ? devFormat : prodFormat;
    const rotateOptions = {
        dirname: logConfig.dirname,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: logConfig.maxSize,
        maxFiles: logConfig.maxFiles
    };

    configure({
        level: logConfig.level,
        format: chosenFormat,

        transports: [
            new transports.Console({
                handleExceptions: true
            }),

            new DailyRotateFile({
                ...rotateOptions,
                filename: 'combined-%DATE%.log'
            }),

            new DailyRotateFile({
                ...rotateOptions,
                filename: 'error-%DATE%.log',
                level: 'error'
            })
        ],

        exceptionHandlers: [
            new DailyRotateFile({
                ...rotateOptions,
                filename: 'exceptions-%DATE%.log'
            })
        ],

        rejectionHandlers: [
            new DailyRotateFile({
                ...rotateOptions,
                filename: 'rejections-%DATE%.log'
            })
        ],

        exitOnError: false
    });

    new Logger(__filename).info('Winston logger initialized');
};
