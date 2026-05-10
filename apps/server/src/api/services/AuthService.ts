/**
 * @file AuthService.ts
 * @description Service responsible for all auth domain operations.
 * @author Lucas
 * @license MIT
 */

import {
    AuthenticationFailedException,
    InvalidRefreshTokenException,
    RefreshTokenExpiredException,
    RefreshTokenMissingException,
    EmailAlreadyExistsException,
    AccessTokenMissingException,
    InvalidAccessTokenException,
    EmailNotVerifiedException
} from '../responses';
import { RefreshTokenEntity, SessionEntity, UserEntity } from '@/database/entities';
import { type LoggerInterface, LoggerDecorator } from '@/lib/logger';
import { VerificationService } from './VerificationService';
import { appDataSource } from '@/database/AppDataSource';
import { TokenService, TokenPair } from '@/lib/auth';
import { VerificationContext } from '@astra/core';
import { UserService } from './UserService';
import { Service } from 'typedi';
import bcrypt from 'bcrypt';

@Service()
export class AuthService {
    constructor(
        @LoggerDecorator(__filename)
        private readonly logger: LoggerInterface,
        private readonly verificationService: VerificationService,
        private readonly userService: UserService
    ) {}

    public async register(options: {
        name: string;
        email: string;
        password: string;
    }): Promise<void> {
        this.logger.info('Starting user registration');

        try {
            const { user, code } = await appDataSource.transaction(async (manager) => {
                const createdUser = manager.create(UserEntity, options);
                await manager.save(UserEntity, createdUser);

                const createdCode = await this.verificationService.createVerificationCode(
                    createdUser.id,
                    VerificationContext.EMAIL_CONFIRMATION,
                    manager
                );

                return { user: createdUser, code: createdCode };
            });

            this.logger.info(`User and verification code created, dispatching email for ${user.email}`);

            await this.verificationService.dispatchVerificationCode(user, code);
        } catch (error: any) {
            // PostgreSQL unique violation code
            if (error?.code === '23505') throw new EmailAlreadyExistsException();

            throw error;
        }
    }

    public async login(
        email: string,
        password: string,
        ipAddress: string | null,
        userAgent: string | null
    ): Promise<TokenPair> {
        this.logger.info('Starting login attempt');

        const user = await this.userService.findByEmailWithPassword(email);

        if (!await bcrypt.compare(password, user.password))
            throw new AuthenticationFailedException();
        if (!user.isVerified)
            throw new EmailNotVerifiedException();

        return this.createSession(user.id, ipAddress, userAgent);
    }

    public async logout(sessionId: string): Promise<void> {
        this.logger.info('Starting logout');

        await appDataSource.transaction(async (manager) => {
            await manager.delete(RefreshTokenEntity, { sessionId });

            await manager.update(SessionEntity, { id: sessionId }, {
                revokedAt: new Date()
            });
        });

        this.logger.info('Session revoked successfully');
    }

    public async refresh(
        currentAccessToken: string | undefined,
        rawRefreshToken: string | undefined
    ): Promise<TokenPair> {
        this.logger.info('Starting token refresh');

        if (!currentAccessToken)
            throw new AccessTokenMissingException();
        if (!rawRefreshToken)
            throw new RefreshTokenMissingException();

        let sessionId: string;
        let sub: string;

        try {
            const payload = TokenService.decodeAccessToken(currentAccessToken);
            sessionId = payload.sessionId;
            sub = payload.sub;
        } catch {
            throw new InvalidAccessTokenException();
        }

        return appDataSource.transaction(async (manager) => {
            const existing = await manager.findOne(RefreshTokenEntity, {
                where: { sessionId }
            });

            if (!existing)
                throw new InvalidRefreshTokenException();
            if (new Date() > existing.expiresAt)
                throw new RefreshTokenExpiredException();
            if (TokenService.hashRefreshToken(rawRefreshToken) !== existing.token)
                throw new InvalidRefreshTokenException();

            await manager.remove(RefreshTokenEntity, existing);

            const { accessToken, refreshToken, refreshTokenHashed } = TokenService.issueTokenPair({
                sub,
                sessionId
            });

            const newRefreshToken = manager.create(RefreshTokenEntity, {
                sessionId,
                token: refreshTokenHashed,
                expiresAt: new Date(Date.now() + TokenService.getRefreshTokenTtlMs())
            });

            await manager.save(RefreshTokenEntity, newRefreshToken);

            return { accessToken, refreshToken };
        });
    }
    
    public async createSession(
        userId: string,
        ipAddress: string | null,
        userAgent: string | null
    ): Promise<TokenPair> {
        this.logger.info('Creating session');

        return appDataSource.transaction(async (manager) => {
            const session = manager.create(SessionEntity, {
                userId,
                ipAddress,
                userAgent
            });

            await manager.save(SessionEntity, session);

            const { accessToken, refreshToken, refreshTokenHashed } = TokenService.issueTokenPair({
                sub: userId,
                sessionId: session.id
            });

            const refreshTokenEntity = manager.create(RefreshTokenEntity, {
                sessionId: session.id,
                token: refreshTokenHashed,
                expiresAt: new Date(Date.now() + TokenService.getRefreshTokenTtlMs())
            });

            await manager.save(RefreshTokenEntity, refreshTokenEntity);

            return { accessToken, refreshToken };
        });
    }
}