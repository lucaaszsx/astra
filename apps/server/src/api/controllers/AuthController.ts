/**
 * @file AuthController.ts
 * @description Controller for application auth management.
 * @author Lucas
 * @license MIT
 */

import { JsonController, Post, Body, Req } from 'routing-controllers';
import type { RegisterRequest } from './dtos/requests/AuthRequests';
import { BaseController } from './BaseController';
import { AuthService } from '../services';
import type { Request } from 'express';
import { Service } from 'typedi';

@Service()
@JsonController('/auth')
export class AuthController extends BaseController {
    constructor(private readonly authService: AuthService) {
        super();
    }

    @Post('/register')
    public async register(@Body() body: RegisterRequest, @Req() req: Request) {
        await this.authService.register({
            name: body.name,
            email: body.email,
            password: body.password
        });

        return this.created<null>(req, null);
    }
}