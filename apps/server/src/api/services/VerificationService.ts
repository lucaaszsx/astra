/**
 * @file VerificationService.ts
 * @description Service responsible for all verification domain operations.
 * @author Lucas
 * @license MIT
 */

import { CodeAlreadyUsedException, CodeExpiredException, InvalidCodeException } from '../responses';
import { VERIFICATION_CODE_LENGTH, VerificationContext } from '@astra/core';
import { VerificationCodeEntity, UserEntity } from '@/database/entities';
import { type LoggerInterface, LoggerDecorator } from '@/lib/logger';
import { appDataSource } from '@/database/AppDataSource';
import { MailerService } from '@/external/mailer';
import { UserService } from './UserService';
import { randomInt } from 'node:crypto';
import { Env } from '@/config/env';
import { Service } from 'typedi';
import ms from 'ms';

const VERIFICATION_CODE_TTL_MAP: Record<VerificationContext, ms.StringValue> = {
    [VerificationContext.EMAIL_CONFIRMATION]: Env.Auth.ttl.emailConfirmation,
    [VerificationContext.PASSWORD_RESET]: Env.Auth.ttl.passwordReset
};

@Service()
export class VerificationService {
    constructor(
        @LoggerDecorator(__filename)
        private readonly logger: LoggerInterface,

        private readonly mailerService: MailerService,
        private readonly userService: UserService
    ) {}

    private static generateCode(): string {
        const min = Math.pow(10, VERIFICATION_CODE_LENGTH - 1);
        const max = Math.pow(10, VERIFICATION_CODE_LENGTH) - 1;

        return randomInt(min, max + 1).toString();
    }
    
    public async createVerificationCode(
        userId: string,
        context: VerificationContext,
        manager = appDataSource.manager
    ): Promise<VerificationCodeEntity> {
        const code = manager.create(VerificationCodeEntity, {
            userId,
            context,
            code: VerificationService.generateCode(),
            expiresAt: new Date(Date.now() + ms(VERIFICATION_CODE_TTL_MAP[context] as ms.StringValue))
        });

        return manager.save(VerificationCodeEntity, code);
    }

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

    public async verifyEmail(email: string, code: string): Promise<void> {
        this.logger.info('Starting email verification attempt');

        const user = await this.userService.findByEmail(email);

        if (user.isVerified) {
            this.logger.info('User is already verified');
            return;
        }

        const verificationCode = await appDataSource.manager.findOne(VerificationCodeEntity, {
            where: { userId: user.id, code, context: VerificationContext.EMAIL_CONFIRMATION }
        });

        if (!verificationCode) throw new InvalidCodeException();

        if (Date.now() > verificationCode.expiresAt.getTime()) {
            this.logger.info('Verification code has expired');
            throw new CodeExpiredException();
        }

        if (verificationCode.used) {
            this.logger.warn('Verification code has already been used');
            throw new CodeAlreadyUsedException();
        }

        await appDataSource.transaction(async (manager) => {
            verificationCode.used = true;
            verificationCode.usedAt = new Date();
            await manager.save(VerificationCodeEntity, verificationCode);

            user.isVerified = true;
            await manager.save(UserEntity, user);
        });

        this.logger.info('User verified successfully');
    }
}