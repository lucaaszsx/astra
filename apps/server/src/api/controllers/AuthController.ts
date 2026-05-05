/**
 * @file AuthController.ts
 * @description Controller for application auth management.
 * @author Lucas
 * @license MIT
 */

import { VerifyEmailRequest, RegisterRequest, LoginRequest } from './dtos/requests/AuthRequests';
import { LoginResponse } from './dtos/responses/AuthResponses';
import { VerificationService, AuthService } from '../services';
import { JsonController, Post, Body, Req, Res } from 'routing-controllers';
import { BaseController } from './BaseController';
import { CookieService } from '@/lib/auth';
import type { Request, Response } from 'express';
import { Service } from 'typedi';

@Service()
@JsonController('/auth')
export class AuthController extends BaseController {
    constructor(
        private readonly verificationService: VerificationService,
        private readonly authService: AuthService
    ) {
        super();
    }

    @Post('/register')
    public async register(
        @Body() body: RegisterRequest,
        @Req() req: Request
    ) {
        await this.authService.register({
            name: body.name,
            email: body.email,
            password: body.password
        });

        return this.created<null>(req, null);
    }

    @Post('/login')
    public async login(
        @Body() body: LoginRequest,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const ipAddress =
            (req.headers['x-forwarded-for'] as string | undefined)
                ?.split(',')[0]
                ?.trim() ?? req.socket.remoteAddress ?? null;

        const userAgent = req.headers['user-agent'] ?? null;

        const { accessToken, refreshToken } = await this.authService.login(
            body.email,
            body.password,
            ipAddress,
            userAgent
        );

        CookieService.setRefreshToken(res, refreshToken);

        return this.ok<LoginResponse>(req, { accessToken });
    }

    @Post('/verify-email')
    public async verifyEmail(@Body() body: VerifyEmailRequest, @Req() req: Request) {
        await this.verificationService.verifyEmail(body.email, body.code);

        return this.ok<null>(req, null);
    }
}