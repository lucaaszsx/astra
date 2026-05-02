import { JoinColumn, ManyToOne, OneToMany, Relation, Column, Entity, Index } from 'typeorm';
import { RefreshTokenEntity } from './RefreshTokenEntity';
import { BaseEntity } from '../BaseEntity';
import { UserEntity } from './UserEntity';

@Entity('sessions')
export class SessionEntity extends BaseEntity {
    @Column({ name: 'user_id', type: 'uuid' })
    @Index('idx_sessions_user_id')
    public userId: string;

    @ManyToOne(() => UserEntity, (user) => user.sessions)
    @JoinColumn({ name: 'user_id' })
    public user: Relation<UserEntity>;

    @Column({
        name: 'ip_address',
        type: 'varchar',
        nullable: true,
        length: 45
    })
    public ipAddress: string | null;

    @Column({
        name: 'user_agent',
        type: 'varchar',
        nullable: true,
        length: 512
    })
    public userAgent: string | null;

    @Column({ name: 'revoked_at', type: 'timestamp', nullable: true })
    public revokedAt: Date | null;

    @OneToMany(() => RefreshTokenEntity, (token) => token.session)
    public refreshTokens: Relation<RefreshTokenEntity[]>;
}
