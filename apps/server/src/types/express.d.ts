import type { AccessTokenPayload } from '@/lib/auth';

export {};

declare global {
    namespace Express {
        interface Request {
            user?: AccessTokenPayload;
        }
    }
}