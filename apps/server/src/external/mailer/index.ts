/**
 * @file index.ts
 * @description MailerService — handles all transactional email delivery via SMTP.
 * Uses a lazy-initialised Nodemailer transport to avoid crashing the container at
 * boot if SMTP credentials are temporarily unavailable.
 * @author Lucas
 * @license MIT
 */

import {
    type EmailVerificationTemplateOptions,
    type PasswordChangedTemplateOptions,
    type PasswordResetTemplateOptions,
    EMAIL_VERIFICATION_SUBJECT,
    PASSWORD_CHANGED_SUBJECT,
    PASSWORD_RESET_SUBJECT,
    emailVerificationTemplate,
    passwordChangedTemplate,
    passwordResetTemplate
} from './templates';
import nodemailer, {
    type SentMessageInfo,
    type SendMailOptions,
    type Transporter
} from 'nodemailer';
import { EmailCannotBeSentException } from '@/api/responses';
import { LoggerDecorator } from '@/decorators';
import { LoggerInterface } from '@/lib/logger';
import { Env } from '@/config/env';
import { Service } from 'typedi';

/** Options for dispatching an e-mail verification message. */
export interface DispatchVerificationCodeOptions extends Omit<
    EmailVerificationTemplateOptions,
    'userName'
> {
    to: string;
    userName: string;
}

/** Options for dispatching a password reset request message. */
export interface DispatchPasswordResetOptions extends Omit<
    PasswordResetTemplateOptions,
    'userName'
> {
    to: string;
    userName: string;
}

/** Options for dispatching a password changed notification. */
export interface NotifyPasswordChangedOptions extends Omit<
    PasswordChangedTemplateOptions,
    'userName'
> {
    to: string;
    userName: string;
}

@Service()
export class MailerService {
    private transporter: Transporter | null = null;

    constructor(
        @LoggerDecorator(__filename)
        private readonly logger: LoggerInterface
    ) {}

    /**
     * Returns the shared transporter, creating it on first access.
     * Lazy init prevents a boot-time crash if SMTP config is absent or invalid.
     */
    private getTransporter(): Transporter {
        if (this.transporter) return this.transporter;

        this.transporter = nodemailer.createTransport(
            {
                service: Env.Smtp.service,
                auth: {
                    user: Env.Smtp.user,
                    pass: Env.Smtp.pass
                }
            },
            { from: `"${Env.Smtp.name}" <${Env.Smtp.user}>` }
        );

        return this.transporter;
    }

    /**
     * Sends a single HTML email. The `from` field is set automatically via
     * transport defaults; callers only provide `to`, `subject`, and `html`.
     *
     * @throws {EmailCannotBeSentException} If the SMTP transport fails.
     */
    private async dispatchEmail(options: Omit<SendMailOptions, 'from'>): Promise<SentMessageInfo> {
        this.logger.info(`Attempting to send email to => ${options.to}`);

        try {
            const info = await this.getTransporter().sendMail(options);

            this.logger.info(`Email sent to => ${options.to}`, { messageId: info.messageId });

            return info;
        } catch (error) {
            this.logger.error(`Failed to send email to '${options.to ?? 'unknown'}':`, { error });

            throw new EmailCannotBeSentException();
        }
    }

    /**
     * Sends an e-mail address verification message.
     * Dispatched after user registration.
     */
    public dispatchVerificationCode({
        to,
        userName,
        verificationUrl,
        otp,
        expiresIn
    }: DispatchVerificationCodeOptions): Promise<SentMessageInfo> {
        return this.dispatchEmail({
            to,
            subject: EMAIL_VERIFICATION_SUBJECT,
            html: emailVerificationTemplate({ userName, verificationUrl, otp, expiresIn })
        });
    }

    /**
     * Sends a password reset instructions message.
     * Dispatched when the user initiates the "forgot my password" flow.
     */
    public dispatchPasswordReset({
        to,
        userName,
        resetUrl,
        expiresIn,
        requestIp
    }: DispatchPasswordResetOptions): Promise<SentMessageInfo> {
        return this.dispatchEmail({
            to,
            subject: PASSWORD_RESET_SUBJECT,
            html: passwordResetTemplate({ userName, resetUrl, expiresIn, requestIp })
        });
    }

    /**
     * Sends a security notification confirming a password change.
     * Dispatched immediately after a successful reset or manual password update.
     */
    public notifyPasswordChanged({
        to,
        userName,
        changedAt,
        changedFromIp,
        supportUrl
    }: NotifyPasswordChangedOptions): Promise<SentMessageInfo> {
        return this.dispatchEmail({
            to,
            subject: PASSWORD_CHANGED_SUBJECT,
            html: passwordChangedTemplate({ userName, changedAt, changedFromIp, supportUrl })
        });
    }
}
