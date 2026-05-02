/**
 * @file index.ts
 * @description Re-exports all database repositories
 * @author Lucas
 * @license MIT
 */

/**
 * @file index.ts
 * @description Re-exports all database repositories
 * @author Lucas
 * @license MIT
 */

import { RefreshTokenEntity } from '@/database/entities/user/RefreshTokenEntity';
import { SessionEntity } from '@/database/entities/user/SessionEntity';
import { RoleEntity } from '@/database/entities/user/RoleEntity';
import { UserEntity } from '@/database/entities/user/UserEntity';
import { appDataSource } from '@/database/AppDataSource';

/** User */
export const userRepository         = appDataSource.getRepository(UserEntity);
export const roleRepository         = appDataSource.getRepository(RoleEntity);
export const sessionRepository      = appDataSource.getRepository(SessionEntity);
export const refreshTokenRepository = appDataSource.getRepository(RefreshTokenEntity);