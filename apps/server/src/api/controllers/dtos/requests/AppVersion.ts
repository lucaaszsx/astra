/**
 * @file AppVersion.dto.ts
 * @description Data Transfer Objects for AppVersion operations with validation rules.
 * @author Lucas
 * @license Apache-2.0
 */

import { IsBoolean, IsOptional, IsUrl, Matches } from 'class-validator';
import { IsRequiredString, IsOptionalString, IsRequiredInt, IsOptionalInt } from '@/decorators';

export class CreateVersionDTO {
    @IsRequiredString(1, 255)
    title!: string;

    @IsOptionalString()
    description?: string;

    @IsRequiredString()
    @Matches(/^\d+\.\d+\.\d+$/, {
        message: 'version must follow semantic versioning (e.g., 1.0.0)'
    })
    version!: string;

    @IsRequiredInt(1)
    versionCode!: number;

    @IsOptionalString()
    changelog?: string;

    @IsRequiredString(1, 500)
    r2Key!: string;

    @IsRequiredString()
    @IsUrl({}, { message: 'downloadUrl must be a valid URL' })
    downloadUrl!: string;

    @IsRequiredInt(0)
    fileSize!: number;

    @IsOptionalString(undefined, 64)
    checksum?: string;

    @IsOptional()
    @IsBoolean({ message: 'isPreRelease must be a boolean' })
    isPreRelease?: boolean;
}

export class UpdateVersionDTO {
    @IsOptionalString(1, 255)
    title?: string;

    @IsOptionalString()
    description?: string;

    @IsOptionalString()
    changelog?: string;

    @IsOptional()
    @IsBoolean({ message: 'isActive must be a boolean' })
    isActive?: boolean;

    @IsOptional()
    @IsBoolean({ message: 'isPreRelease must be a boolean' })
    isPreRelease?: boolean;
}

export class PaginationQueryDTO {
    @IsOptionalInt(1)
    page?: number = 1;

    @IsOptionalInt(1, 100)
    limit?: number = 10;
}
