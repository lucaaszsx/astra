/**
 * @file AuthService.ts
 * @description Service responsible for all auth domain operations.
 * @author Lucas
 * @license MIT
 */

import { RefreshTokenEntity, SessionEntity, UserEntity } from '@/database/entities';
import { VerificationService } from './VerificationService';
import { AuthenticationFailedException, EmailAlreadyExistsException, EmailNotVerifiedException } from '../responses';
import { userRepository } from '@/database/repositories';
import { appDataSource } from '@/database/AppDataSource';
import { TokenService, TokenPair } from '@/lib/auth';
import type { LoggerInterface } from '@/lib/logger';
import { VerificationContext } from '@astra/core';
import { LoggerDecorator } from '@/decorators';
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

        this.logger.info('Credentials valid, creating session');

        return this.createSession(user.id, ipAddress, userAgent);
    }

    public async register(options: {
        name: string;
        email: string;
        password: string;
    }): Promise<void> {
        this.logger.info('Starting user registration');

        if (await userRepository.exists({ where: { email: options.email } }))
            throw new EmailAlreadyExistsException();

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
    }
    
    public async createSession(
        userId: string,
        ipAddress: string | null,
        userAgent: string | null
    ): Promise<TokenPair> {
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