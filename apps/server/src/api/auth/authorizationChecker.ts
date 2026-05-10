import {
    AccessTokenMissingException,
    AccessTokenExpiredException,
    InvalidAccessTokenException,
    ForbiddenException
} from '../responses';
import { AccessTokenPayload, DecodedAccessToken, TokenService } from '@/lib/auth';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { userRepository } from '@/database/repositories';
import { LoggerInterface, loggerContext, Logger } from '@/lib/logger';
import { Action } from 'routing-controllers';
import { getAccessToken } from '../utils';
import { UserRole } from '@astra/core';

const logger: LoggerInterface = new Logger(__filename);

export const authorizationChecker = async (action: Action, roles: string[]): Promise<boolean> => {
    const token = getAccessToken(action.request);
    if (!token) throw new AccessTokenMissingException();

    let decodedPayload: DecodedAccessToken;

    try {
        decodedPayload = TokenService.verifyAccessToken(token);

        if (!TokenService.isValidAccessPayload(decodedPayload)) {
            logger.warn(`The payload obtained does not follow the required patterns (IP ${action.request.ip})`);
            throw new InvalidAccessTokenException();
        }

        if (roles.includes(UserRole.ADMIN)) {
            const user = await userRepository.findOne({ where: { id: decodedPayload.sub, isActive: true } });
            if (!user?.isAdmin) throw new ForbiddenException();

            action.request.resolvedUser = user;
        }

        logger.debug(`Authorized user '${decodedPayload.sub}' from IP: ${action.request.ip}`);

        action.request.userPayload = {
            sub: decodedPayload.sub,
            sessionId: decodedPayload.sessionId
        } as AccessTokenPayload;

        loggerContext.updateContext({ identifier: decodedPayload.sub });
    } catch (error) {
        if (error instanceof InvalidAccessTokenException) throw error;
        if (error instanceof ForbiddenException) throw error;
        if (error instanceof TokenExpiredError) throw new AccessTokenExpiredException();
        else if (error instanceof JsonWebTokenError) throw new InvalidAccessTokenException();

        throw error;
    }

    return true;
};