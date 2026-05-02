import { type Relation, Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../BaseEntity';
import { UserEntity } from './UserEntity';
import { RoleRules } from '@astra/core';

@Entity({ name: 'roles' })
export class RoleEntity extends BaseEntity {
    @Column({
        type: 'varchar',
        length: RoleRules.NAME.MAX_LENGTH,
        unique: true
    })
    public name: string;

    @Column({
        type: 'varchar',
        length: RoleRules.DESCRIPTION.MAX_LENGTH
    })
    public description: string;

    @Column({
        type: 'bigint',
        default: 0,
        transformer: {
            to: (value: bigint) => value.toString(),
            from: (value: string) => BigInt(value)
        }
    })
    public permissions: bigint;

    @OneToMany(() => UserEntity, (user) => user.role)
    public users: Relation<UserEntity[]>;
}
