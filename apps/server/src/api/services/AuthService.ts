/**
 * @file AuthService.ts
 * @description Service responsible for all auth domain operations.
 * @author Lucas
 * @license MIT
 */

import { VerificationCodeEntity, RefreshTokenEntity, SessionEntity, UserEntity } from '@/database/entities';
import { CodeAlreadyUsedException, CodeExpiredException, InvalidCodeException, EmailAlreadyExistsException } from '../responses';
import { userRepository } from '@/database/repositories';
import { appDataSource } from '@/database/AppDataSource';
import { TokenService, TokenPair } from '@/lib/auth';
import type { LoggerInterface } from '@/lib/logger';
import { VerificationContext } from '@astra/core';
import { MailerService } from '@/external/mailer';
import { LoggerDecorator } from '@/decorators';
import { randomInt } from 'node:crypto';
import { Env } from '@/config/env';
import { Service } from 'typedi';
import ms, { StringValue } from 'ms';

@Service()
export class AuthService {
    constructor(
        @LoggerDecorator(__filename)
        private readonly logger: LoggerInterface,
        private readonly mailerService: MailerService
    ) {}

    public async dispatchVerificationCode(
        user: UserEntity,
        code: VerificationCodeEntity
    ): Promise<void> {
        this.logger.info('Dispatching verification code');

        await this.mailerService.dispatchVerificationCode({
            to: user.email,
            userName: user.name,
            verificationUrl: Env.Server.url, // TODO: set the correct url here
            otp: code.code,
            expiresIn: code.expiresAt.getTime() - code.createdAt.getTime()
        });

        this.logger.info('Verification code dispatched successfully');
    }

    public async verifyEmail(user: UserEntity, code: VerificationCodeEntity): Promise<void> {
        this.logger.info('Starting email verification attempt');

        if (user.isVerified) {
            this.logger.info('User is already verified');
            return;
        }

        if (code.context !== VerificationContext.EMAIL_CONFIRMATION)
            throw new InvalidCodeException();

        if (Date.now() > code.expiresAt.getTime()) {
            this.logger.info('Verification code has expired');
            throw new CodeExpiredException();
        }

        if (code.used) {
            this.logger.warn('Verification code has already been used');
            throw new CodeAlreadyUsedException();
        }

        await appDataSource.transaction(async (manager) => {
            code.used = true;
            code.usedAt = new Date();
            await manager.save(VerificationCodeEntity, code);

            user.isVerified = true;
            await manager.save(UserEntity, user);
        });

        this.logger.info('User verified successfully');
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

            const createdCode = await this.createVerificationCode(
                createdUser.id,
                VerificationContext.EMAIL_CONFIRMATION,
                manager
            );

            return { user: createdUser, code: createdCode };
        });

        this.logger.info('User and verification code created, dispatching email');

        await this.dispatchVerificationCode(user, code);
    }

    public async createVerificationCode(
        userId: string,
        context: VerificationContext,
        manager = appDataSource.manager
    ): Promise<VerificationCodeEntity> {
        const code = manager.create(VerificationCodeEntity, {
            userId,
            context,
            code: randomInt(100000, 999999).toString(),
            expiresAt: new Date(Date.now() + ms(Env.Auth.codeExpiresIn as ms.StringValue))
        });

        return manager.save(VerificationCodeEntity, code);
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