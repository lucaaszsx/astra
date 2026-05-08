/**
 * @file SystemController.ts
 * @description Controller for application system status management.
 * @author Lucas
 * @license MIT
 */

import { JsonController, Get, Req } from 'routing-controllers';
import { BaseController } from './BaseController';
import type { Request } from 'express';
import { Service } from 'typedi';

@Service()
@JsonController('/system')
export class SystemController extends BaseController {
    @Get('/ping')
    public ping(@Req() req: Request) {
        return this.ok(req, { message: 'Pong! 🏓' });
    }
}
