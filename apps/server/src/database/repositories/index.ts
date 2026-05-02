/**
 * @file index.ts
 * @description Re-exports all database repositories
 * @author Lucas
 * @license MIT
 */

import { VerificationCodeEntity } from '../entities/user/VerificationCodeEntity';
import { RefreshTokenEntity } from '../entities/user/RefreshTokenEntity';
import { SessionEntity } from '../entities/user/SessionEntity';
import { RoleEntity } from '../entities/user/RoleEntity';
import { UserEntity } from '../entities/user/UserEntity';
import { appDataSource } from '../AppDataSource';

/** User */
export const userRepository = appDataSource.getRepository(UserEntity);
export const roleRepository = appDataSource.getRepository(RoleEntity);
export const sessionRepository = appDataSource.getRepository(SessionEntity);
export const refreshTokenRepository = appDataSource.getRepository(RefreshTokenEntity);
export const codeRepository = appDataSource.getRepository(VerificationCodeEntity);
