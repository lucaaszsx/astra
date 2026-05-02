/**
 * @file UserTypes.ts
 * @description Internal type definitions for UserService operations.
 * @author Lucas
 * @license MIT
 */

import type { FindOneOptions as TypeORMFindOneOptions } from 'typeorm';
import type { UserEntity } from '@/database/entities/user/UserEntity';

export interface CreateUserOptions {
    name: string;
    email: string;
    password: string;
}

export interface FindUsersOptions {
    page?: number;
    limit?: number;
}

export interface FindOneUserOptions extends TypeORMFindOneOptions<UserEntity> {}

export interface UserExistsOptions {
    id?: string;
    email?: string;
}

export interface UpdateUserOptions {
    name?: string;
    email?: string;
}