/**
 * @file UserResponses.ts
 * @description Response DTO classes for user endpoints
 * @author Lucas
 * @license MIT
 */

import { UserEntity } from "@/database/entities";

/**
 * Represents the user's own profile data.
 * Does not include sensitive fields.
 */
export class UserProfileDTO {
    id: string;
    name: string;
    email: string;
    isVerified: boolean;
    createdAt: Date;

    static fromEntity(user: UserEntity): UserProfileDTO {
        const dto = new UserProfileDTO();

        dto.id = user.id;
        dto.name = user.name;
        dto.email = user.email;
        dto.isVerified = user.isVerified;
        dto.createdAt = user.createdAt;

        return dto;
    }
}