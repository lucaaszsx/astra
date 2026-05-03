/**
 * @file UserTypes.ts
 * @description Internal type definitions for UserService operations.
 * @author Lucas
 * @license MIT
 */

export interface CreateUserOptions {
    name: string;
    email: string;
    password: string;
}

export interface FindUsersOptions {
    page?: number;
    limit?: number;
}

export interface UpdateUserOptions {
    name?: string;
    email?: string;
}