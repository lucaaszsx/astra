/**
 * @file EmailCannotBeSent.ts
 * @description Custom exception for email delivery failures.
 * Thrown by MailerService when the SMTP transport fails to send a message.
 *
 * @author Lucas
 * @license MIT
 */

import { ApiErrorCodes } from '@astra/core';
import { BaseException } from '../Base';

export class EmailCannotBeSentException extends BaseException {
    constructor(details?: string[]) {
        super(ApiErrorCodes.EMAIL_CANNOT_BE_SENT, details);
    }
}
