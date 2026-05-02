import { type Relation, Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { VerificationContext } from '@astra/core';
import { BaseEntity } from '../BaseEntity';
import { UserEntity } from './UserEntity';

@Entity({ name: 'verification_codes' })
@Index('idx_verification_codes_user_id_context', ['userId', 'context'])
export class VerificationCodeEntity extends BaseEntity {
    @Column({ name: 'user_id', type: 'uuid' })
    @Index('idx_verification_codes_user_id')
    public userId: string;

    @ManyToOne(() => UserEntity, (user) => user.verificationCodes, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'user_id' })
    public user: Relation<UserEntity>;

    @Column({ type: 'varchar', length: 16 })
    public code: string;

    @Column({
        type: 'enum',
        enum: VerificationContext
    })
    public context: VerificationContext;

    @Column({ name: 'expires_at', type: 'timestamp' })
    public expiresAt: Date;

    @Column({ type: 'boolean', default: false })
    public used: boolean;

    @Column({ name: 'used_at', type: 'timestamp', nullable: true })
    public usedAt: Date | null;
}