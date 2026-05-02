import { PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';

export abstract class BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    public updatedAt: Date;
}
