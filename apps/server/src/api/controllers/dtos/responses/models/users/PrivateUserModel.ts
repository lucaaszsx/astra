/**
 * @file PrivateUserModel.ts
 * @description Response model for authenticated user data.
 * Returned after registration, login, or self-profile requests.
 * @author Lucas
 * @license MIT
 */

export class PrivateUserModel {
    public id: string;
    public name: string;
    public email: string;
    public isActive: boolean;
    public createdAt: Date;
    public updatedAt: Date;

    constructor(data: PrivateUserModel) {
        this.id        = data.id;
        this.name      = data.name;
        this.email     = data.email;
        this.isActive  = data.isActive;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }
}