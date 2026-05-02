/**
 * @file
 * @description Centralized runtime configuration using validated environment variables.
 * @author Lucas
 * @license MIT
 */

import { PROJECT_PATHS } from '@/config/constants';
import { join } from 'node:path';

const { source, distribution } = PROJECT_PATHS;

/**
 * Represents the type of environment variable.
 * Used to specify the expected data type for configuration values.
 */
export enum EnvType {
    Float,
    Bool,
    Int,
    Str
}

/** Auxiliar functions */
/**
 * Retrieves an environment variable and ensures it's defined.
 *
 * @param key - The name of the environment variable.
 * @param type - The type of the variable to perform the appropriate conversion.
 *
 * @throws {Error} If the environment variable is missing.
 *
 * @returns The value of the environment variable.
 */
export function getEnvVariable(key: string, type: EnvType | undefined = EnvType.Str): any {
    const value = process.env[key];

    if (!value) {
        const err = new Error(`Missing required environment variable: ${key}`);
        Error.captureStackTrace?.(err, getEnvVariable);

        throw err;
    }

    const parsedValue =
        type === EnvType.Int
            ? parseInt(value, 10)
            : type === EnvType.Float
              ? parseFloat(value)
              : type === EnvType.Bool
                ? value === 'true' || value === '1'
                : value;

    return parsedValue;
}

/**
 * Retrieves an environment variable and ensures it's defined.
 *
 * @param key - The name of the environment variable.
 * @param defaultValue - The value to be returned if a value with the key doesn't exists
 *
 * @returns The value of the environment variable or default value.
 */
export function getEnvOptional(key: string, defaultValue?: any) {
    return process.env[key] || defaultValue;
}

/**
 * Converts a list in string format obtained from the environment configuration file to a JS array
 *
 * @param entry - The key string
 * @param cb - A callback to call for every item in array and parse it
 */
export function parseEnvArray(key: string, cb?: (part: string) => string): string[] {
    const value = getEnvVariable(key) as string;

    return value
        .toString()
        .split(',')
        .map((part) => (cb ? (cb(part.trim()) as any) : part.trim()));
}

/**
 * Gets a environment directory path variable
 *
 * @param entry - The key string
 */
export function getEnvPath(key: string): string {
    const path = getEnvVariable(key).toString();

    return parsePath(path);
}

/**
 * Parses a string into a valid path
 *
 * @param path - The path to parse
 */
export function parsePath(path: string): string {
    return join(
        process.cwd(),
        process.env.NODE_ENV === 'prod'
            ? path.replace(`${source}/`, `${distribution}/`).slice(0, -3) + '.js'
            : path
    );
}
