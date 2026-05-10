import { userRepository } from '@/database/repositories';
import { UserEntity } from '@/database/entities';
import { AccessTokenPayload } from '@/lib/auth';
import { Action } from 'routing-controllers';

/**
 * Resolves the current user from the request context.
 */
export const currentUserChecker = async (action: Action): Promise<UserEntity | null> => {
    if (action.request.resolvedUser) return action.request.resolvedUser;

    const payload = action.request.userPayload as AccessTokenPayload | undefined;
    if (!payload) return null;

    return userRepository.findOne({ where: { id: payload.sub, isActive: true } });
};
