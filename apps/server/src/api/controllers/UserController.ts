/**
 * @file UserController.ts
 * @description Controller responsible for user resource endpoints.
 * Requires authentication on all routes.
 * @author Lucas
 * @license MIT
 */

import { JsonController, Get, Req, Authorized } from 'routing-controllers';
import { PrivateUserModel } from './dtos/responses/models';
import { BaseController } from './BaseController';
import { UserService } from '../services/UserService';
import type { ApiResponse } from '@astra/core';
import type { Request } from 'express';
import { Service } from 'typedi';

@Service()
@JsonController('/users')
@Authorized()
export class UserController extends BaseController {
    constructor(private readonly userService: UserService) {
        super();
    }
}