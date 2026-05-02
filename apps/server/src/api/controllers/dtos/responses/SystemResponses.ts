/**
 * @file SystemResponses.ts
 * @description Response DTO classes for system endpoints
 * @author Lucas
 * @license MIT
 */

import { Expose } from 'class-transformer';

export class PingResponse {
    @Expose()
    message!: string;
}
