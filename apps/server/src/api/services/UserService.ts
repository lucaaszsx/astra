/**
 * @file UserService.ts
 * @description Service responsible for all user domain operations.
 * @author Lucas
 * @license MIT
 */

import type {
    CreateUserOptions,
    FindUsersOptions,
    FindOneUserOptions,
    UserExistsOptions,
    UpdateUserOptions
} from './types';
import { EmailAlreadyExistsException, UserNotFoundException } from '../responses';
import { userRepository } from '@/database/repositories';
import { LoggerDecorator } from '@/decorators';
import type { LoggerInterface } from '@/lib/logger';
import type { UserEntity } from '@/database/entities/user/UserEntity';
import { Service } from 'typedi';

@Service()
export class UserService {
    constructor(
        @LoggerDecorator(__filename)
        private readonly logger: LoggerInterface
    ) {}

    public async create(options: CreateUserOptions): Promise<UserEntity> {
        if (await this.exists({ email: options.email })) throw new EmailAlreadyExistsException();

        const user = userRepository.create(options);

        return userRepository.save(user);
    }

    public async find(options: FindUsersOptions): Promise<UserEntity[]> {
        const page  = options.page  ?? 1;
        const limit = options.limit ?? 10;

        return userRepository.find({
            skip:  (page - 1) * limit,
            take:  limit,
            order: { createdAt: 'DESC' }
        });
    }

    public findOne(options: FindOneUserOptions): Promise<UserEntity | null> {
        return userRepository.findOne(options);
    }

    public async findById(id: string): Promise<UserEntity> {
        const user = await this.findOne({ where: { id } });

        if (!user || !user.isActive) throw new UserNotFoundException();

        return user;
    }

    public async findByEmail(email: string): Promise<UserEntity> {
        const user = await this.findOne({ where: { email } });

        if (!user || !user.isActive) throw new UserNotFoundException();

        return user;
    }

    public async exists(options: UserExistsOptions): Promise<boolean> {
        const { email, id } = options;

        if (!email && !id) return false;

        return userRepository.exists({
            where: [...(id ? [{ id }] : []), ...(email ? [{ email }] : [])]
        });
    }
}