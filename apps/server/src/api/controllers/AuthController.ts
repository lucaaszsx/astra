/**
 * @file AuthController.ts
 * @description Controller for application auth management.
 * @author Lucas
 * @license MIT
 */

import { JsonController, Post, Body, Req, Res } from 'routing-controllers';
import type { RegisterRequest } from './dtos/requests/AuthRequests';
import { UserService, AuthService } from '../services';
import { BaseController } from './BaseController';
import { VerificationContext } from '@astra/core';
import { CookieService } from '@/lib/auth';
import type { Request } from 'express';
import { Service } from 'typedi';

@Service()
@JsonController('/auth')
export class AuthController extends BaseController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService
    ) {
        super();
    }

    @Post('/register')
    public async register(
        @Body() body: RegisterRequest,
        @Req() req: Request
    ) {
        const user = await this.userService.create({
            name: body.name,
            email: body.email,
            password: body.password
        });
        const code = await this.authService.createVerificationCode(user.id, VerificationContext.EMAIL_CONFIRMATION);

        await this.authService.dispatchVerificationCode(user, code);

        return this.created<null>(req, null);
    }
}
