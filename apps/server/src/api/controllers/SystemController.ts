/**
 * @file SystemController.ts
 * @description Controller for application system status management.
 * @author Lucas
 * @license MIT
 */

import type { PingResponse } from './dtos/responses/SystemResponses';
import { JsonController, Get, Req } from 'routing-controllers';
import { BaseController } from './BaseController';
import type { ApiResponse } from '@astra/core';
import type { Request } from 'express';
import { Service } from 'typedi';

@Service()
@JsonController('/system')
export class SystemController extends BaseController {
    @Get('/ping')
    ping(@Req() req: Request): ApiResponse<PingResponse> {
        return this.ok<PingResponse>(req, {
            message: 'Pong! 🏓'
        });
    }
}
