import { AccessTokenPayload } from '@/lib/auth';
import { Action } from 'routing-controllers';

/**
 * Resolves the current user from the request context.
 */
export const currentUserChecker = (action: Action): AccessTokenPayload | null => {
    return action.request.user ?? null;
};
