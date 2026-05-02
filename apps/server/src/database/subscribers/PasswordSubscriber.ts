/**
 * @file PasswordSubscriber.ts
 * @description TypeORM subscriber that automatically hashes user passwords
 * before insert and update operations, ensuring raw passwords are never persisted.
 *
 * @author Lucas
 * @license MIT
 */

import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { UserEntity } from '@/database/entities/user/UserEntity';
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

@EventSubscriber()
export class PasswordSubscriber implements EntitySubscriberInterface<UserEntity> {
    listenTo(): typeof UserEntity {
        return UserEntity;
    }

    async beforeInsert(event: InsertEvent<UserEntity>): Promise<void> {
        if (event.entity.password) {
            event.entity.password = await bcrypt.hash(event.entity.password, SALT_ROUNDS);
        }
    }

    async beforeUpdate(event: UpdateEvent<UserEntity>): Promise<void> {
        const password = event.entity?.password;

        if (!password || bcrypt.getRounds(password)) return;

        event.entity!.password = await bcrypt.hash(password, SALT_ROUNDS);
    }

    public static verify(plain: string, hashed: string): Promise<boolean> {
        return bcrypt.compare(plain, hashed);
    }
}
