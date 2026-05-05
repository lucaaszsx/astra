/**
 * @file UserService.ts
 * @description Service responsible for all user domain operations.
 * @author Lucas
 * @license MIT
 */

import type { CreateUserOptions, FindUsersOptions, UpdateUserOptions } from './types';
import { EmailAlreadyExistsException, UserNotFoundException } from '../responses';
import type { UserEntity } from '@/database/entities/user/UserEntity';
import { userRepository } from '@/database/repositories';
import type { LoggerInterface } from '@/lib/logger';
import { LoggerDecorator } from '@/decorators';
import { Service } from 'typedi';

@Service()
export class UserService {
    constructor(
        @LoggerDecorator(__filename)
        private readonly logger: LoggerInterface
    ) {}

    public async create(options: CreateUserOptions): Promise<UserEntity> {
        if (await this.existsByEmail(options.email)) throw new EmailAlreadyExistsException();

        this.logger.info('Creating new user');

        const user = userRepository.create(options);

        return userRepository.save(user);
    }

    public async find(options: FindUsersOptions): Promise<{ data: UserEntity[]; total: number }> {
        const page = options.page ?? 1;
        const limit = options.limit ?? 10;

        const [data, total] = await userRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' }
        });

        return { data, total };
    }

    public async findById(id: string): Promise<UserEntity> {
        const user = await userRepository.findOne({ where: { id, isActive: true } });

        if (!user) throw new UserNotFoundException();

        return user;
    }

    public async findByEmail(email: string): Promise<UserEntity> {
        const user = await userRepository.findOne({ where: { email, isActive: true } });

        if (!user) throw new UserNotFoundException();

        return user;
    }

    public async findByEmailWithPassword(email: string): Promise<UserEntity> {
        const user = await userRepository
            .createQueryBuilder('user')
            .addSelect('user.password')
            .where('user.email = :email', { email })
            .andWhere('user.isActive = true')
            .getOne();

        if (!user) throw new UserNotFoundException();

        return user;
    }
    
    public existsById(id: string): Promise<boolean> {
        return userRepository.exists({ where: { id } });
    }

    public existsByEmail(email: string): Promise<boolean> {
        return userRepository.exists({ where: { email } });
    }
    
    public async update(id: string, options: UpdateUserOptions): Promise<UserEntity> {
        const user = await this.findById(id);

        if (options.email && options.email !== user.email && await this.existsByEmail(options.email))
            throw new EmailAlreadyExistsException();

        Object.assign(user, options);

        this.logger.info('Updating user');

        return userRepository.save(user);
    }

    public async deactivate(id: string): Promise<void> {
        const user = await this.findById(id);

        user.isActive = false;

        this.logger.info('Deactivating user');

        await userRepository.save(user);
    }

    public async delete(id: string): Promise<void> {
        const user = await this.findById(id);

        this.logger.info('Deleting user');

        await userRepository.remove(user);
    }
}