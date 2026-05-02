/**
 * @file AuthController.ts
 * @description Controller for application auth management.
 * @author Lucas
 * @license MIT
 */

import { JsonController, Post, Body, Req, Res } from 'routing-controllers';
import type { RegisterUserRequest } from './dtos/requests/AuthRequests';
import { BaseController } from './BaseController';
import type { Request, Response } from 'express';
import { Service } from 'typedi';

@Service()
@JsonController('/auth')
export class AuthController extends BaseController {
    @Post('/register')
    public async register(
        @Body() Body: RegisterUserRequest,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const user = null; // todo: use auth service
    }
}
