import type { AccessTokenPayload } from '@/lib/auth';
import { UserEntity } from '@/database/entities';

export {};

declare global {
    namespace Express {
        interface Request {
            userPayload?: AccessTokenPayload;
            resolvedUser?: UserEntity;
        }
    }
}
