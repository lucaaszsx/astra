import {
    AccessTokenMissingException,
    AccessTokenExpiredException,
    InvalidAccessTokenException
} from '../responses';
import { AccessTokenPayload, DecodedAccessToken, TokenService } from '@/lib/auth';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { LoggerInterface, Logger } from '@/lib/logger';
import { Action } from 'routing-controllers';

const logger: LoggerInterface = new Logger(__filename);

export const authorizationChecker = async (action: Action, _roles: string[]): Promise<boolean> => {
    const header: string | undefined = action.request.headers['authorization'];
    if (!header || !header.startsWith('Bearer ')) throw new AccessTokenMissingException();

    const token = header.split(' ').at(1);
    if (!token) throw new AccessTokenMissingException();

    let decodedPayload: DecodedAccessToken;
    
    try {
        decodedPayload = TokenService.verifyAccessToken(token);
    
        if (!TokenService.isValidAccessPayload(decodedPayload)) {
            logger.warn(`The payload obtained does not follow the required patterns (IP ${action.request.ip})`);
            throw new InvalidAccessTokenException();
        }

        logger.debug(`Authorized user '${decodedPayload.sub}' from IP: ${action.request.ip}`);

        action.request.user = {
            sub: decodedPayload.sub,
            sessionId: decodedPayload.sessionId
        } as AccessTokenPayload;
    } catch (error) {
        if (error instanceof InvalidAccessTokenException) throw error;
        if (error instanceof TokenExpiredError) throw new AccessTokenExpiredException();
        else if (error instanceof JsonWebTokenError) throw new InvalidAccessTokenException();
        
        throw error;
    }
    
    return true;
};