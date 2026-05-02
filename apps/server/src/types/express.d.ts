export {};

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string; //todo: change this for something like token payload
            };
        }
    }
}
