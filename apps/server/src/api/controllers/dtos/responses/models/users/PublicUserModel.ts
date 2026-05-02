/**
 * @file PublicUserModel.ts
 * @description Response model for publicly visible user data.
 * Used in contexts where full user details should not be exposed.
 * @author Lucas
 * @license MIT
 */

export class PublicUserModel {
    public id: string;
    public name: string;

    constructor(data: PublicUserModel) {
        this.id = data.id;
        this.name = data.name;
    }
}
