/**
 * @file UserController.ts
 * @description Controller responsible for user resource endpoints. Requires authentication on all routes.
 * @author Lucas
 * @license MIT
 */

import { JsonController, CurrentUser, Authorized, Get, Req, Patch, Body, Delete } from 'routing-controllers';
import { UserProfileDTO } from './dtos/responses/UserResponses';
import { UserService } from '../services/UserService';
import { BaseController } from './BaseController';
import { UserEntity } from '@/database/entities';
import type { Request } from 'express';
import { UserRole } from '@astra/core';
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
        return this.ok<UserProfileDTO>(req, UserProfileDTO.fromEntity(user));
    }

    @Patch('/@me')
    public async updateMe() {}

    @Delete('/@me')
    public async deleteMe() {}

    @Authorized(UserRole.ADMIN)
    @Get('/:id')
    public async getUser() {}

    @Authorized(UserRole.ADMIN)
    @Get('/')
    public async getUsers() {}
    
    @Authorized(UserRole.ADMIN)
    @Patch('/:id')
    public async updateUser() {}

    @Authorized(UserRole.ADMIN)
    @Delete('/:id')
    public async deleteUser() {}
}