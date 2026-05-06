/**
 * @file UserController.ts
 * @description Controller responsible for user resource endpoints.
 * Requires authentication on all routes.
 * @author Lucas
 * @license MIT
 */

import { JsonController, CurrentUser, Authorized, Get, Req } from 'routing-controllers';
import { UserService } from '../services/UserService';
import { BaseController } from './BaseController';
import { UserEntity } from '@/database/entities';
import type { Request } from 'express';
import { Service } from 'typedi';

@Service()
@JsonController('/users')
@Authorized()
export class UserController extends BaseController {
    constructor(private readonly userService: UserService) {
        super();
    }

    @Get('/@me')
    public async me(
        @Req() req: Request,
        @CurrentUser() user: UserEntity
    ) {
        return this.ok(req, user);
    }
}