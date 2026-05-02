import { JoinColumn, ManyToOne, OneToMany, Relation, Column, Entity, Index } from 'typeorm';
import { SessionEntity } from './SessionEntity';
import { BaseEntity } from '../BaseEntity';
import { RoleEntity } from './RoleEntity';
import { UserRules } from '@fc/core';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
    @Column({
        name: 'name',
        type: 'varchar',
        length: UserRules.NAME.MAX_LENGTH
    })
    public name: string;

    @Column({
        type: 'varchar',
        length: UserRules.EMAIL.MAX_LENGTH,
        unique: true
    })
    public email: string;

    @Column({
        type: 'varchar',
        length: UserRules.PASSWORD.MAX_LENGTH,
        select: false
    })
    public password: string;

    @Column({ name: 'is_active', type: 'boolean', default: true })
    public isActive: boolean;

    @ManyToOne(() => RoleEntity, (role) => role.users, { nullable: true })
    @JoinColumn({ name: 'role_id' })
    @Index('idx_users_role_id')
    public role: Relation<RoleEntity> | null;

    @OneToMany(() => SessionEntity, (session) => session.user)
    public sessions: Relation<SessionEntity[]>;
}
