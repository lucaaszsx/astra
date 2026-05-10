/**
 * @file AuthController.ts
 * @description Controller for application auth management.
 * @author Lucas
 * @license MIT
 */

import { VerifyEmailRequest, RegisterRequest, LoginRequest } from './dtos/requests/AuthRequests';
import { JsonController, Authorized, Post, Body, Req, Res } from 'routing-controllers';
import { AuthTokenResponse } from './dtos/responses/AuthResponses';
import { VerificationService, AuthService } from '../services';
import { BaseController } from './BaseController';
import type { Request, Response } from 'express';
import { AccessTokenPayload, CookieService } from '@/lib/auth';
import { getAccessToken } from '../utils';
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

        const isMobile = CookieService.isMobileClient(req);
        if (!isMobile) CookieService.setRefreshToken(res, refreshToken);

        return this.ok<AuthTokenResponse>(req, {
            refreshToken: isMobile ? refreshToken : undefined,
            accessToken
        });
    }

    @Authorized()
    @Post('/logout')
    public async logout(@Req() req: Request, @Res() res: Response) {
        await this.authService.logout((req.userPayload as AccessTokenPayload).sessionId);

        CookieService.clearRefreshToken(res);

        return this.ok<null>(req, null);
    }

    @Post('/refresh')
    public async refresh(@Req() req: Request, @Res() res: Response) {
        const currentAccessToken = getAccessToken(req);
        const rawRefreshToken = CookieService.getRefreshToken(req);

        const { accessToken, refreshToken } = await this.authService.refresh(currentAccessToken, rawRefreshToken);

        const isMobile = CookieService.isMobileClient(req);
        if (!isMobile) CookieService.setRefreshToken(res, refreshToken);

        return this.ok<AuthTokenResponse>(req, {
            refreshToken: isMobile ? refreshToken : undefined,
            accessToken
        });
    }

    @Post('/verify-email')
    public async verifyEmail(@Body() body: VerifyEmailRequest, @Req() req: Request) {
        await this.verificationService.verifyEmail(body.email, body.code);

        return this.ok<null>(req, null);
    }
}