import type { DecodedAccessToken } from '@/lib/auth';

export {};

declare global {
    namespace Express {
        interface Request {
            user?: DecodedAccessToken;
        }
    }
}
