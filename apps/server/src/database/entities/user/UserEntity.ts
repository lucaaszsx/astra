import { type Relation, JoinColumn, ManyToOne, OneToMany, Column, Entity, Index } from 'typeorm';
import { VerificationCodeEntity } from './VerificationCodeEntity';
import { SessionEntity } from './SessionEntity';
import { BaseEntity } from '../BaseEntity';
import { RoleEntity } from './RoleEntity';
import { UserRules } from '@astra/core';

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

    @Column({ name: 'is_verified', type: 'boolean', default: false })
    public isVerified: boolean;

    @ManyToOne(() => RoleEntity, (role) => role.users, { nullable: true })
    @JoinColumn({ name: 'role_id' })
    @Index('idx_users_role_id')
    public role: Relation<RoleEntity> | null;

    @OneToMany(() => SessionEntity, (session) => session.user)
    public sessions: Relation<SessionEntity[]>;

    @OneToMany(() => VerificationCodeEntity, (code) => code.user)
    public verificationCodes: Relation<VerificationCodeEntity[]>;
}