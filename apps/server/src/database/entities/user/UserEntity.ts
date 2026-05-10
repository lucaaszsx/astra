import { type Relation, OneToMany, Column, Entity, Index } from 'typeorm';
import { VerificationCodeEntity } from './VerificationCodeEntity';
import { SessionEntity } from './SessionEntity';
import { BaseEntity } from '../BaseEntity';
import { UserRules } from '@astra/core';

@Entity({ name: 'users' })
@Index('idx_users_email_is_active', ['email', 'isActive'])
@Index('idx_users_id_is_active', ['id', 'isActive'])
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

    @Column({ name: 'is_admin', type: 'boolean', default: false })
    public isAdmin: boolean;

    @Column({ name: 'is_active', type: 'boolean', default: true })
    public isActive: boolean;

    @Column({ name: 'is_verified', type: 'boolean', default: false })
    public isVerified: boolean;

    @OneToMany(() => SessionEntity, (session) => session.user)
    public sessions: Relation<SessionEntity[]>;

    @OneToMany(() => VerificationCodeEntity, (code) => code.user)
    public verificationCodes: Relation<VerificationCodeEntity[]>;
}