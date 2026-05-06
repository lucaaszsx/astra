import { userRepository } from '@/database/repositories';
import { UserEntity } from '@/database/entities';
import { AccessTokenPayload } from '@/lib/auth';
import { Action } from 'routing-controllers';

/**
 * Resolves the current user from the request context.
 */
export const currentUserChecker = async (
    action: Action,
    options?: { fetch?: boolean }
): Promise<UserEntity | null> => {
    const payload = action.request.user as AccessTokenPayload | undefined;
    
    if (!payload) return null;

    return userRepository.findOne({ where: { id: payload.sub, isActive: true } });
};
