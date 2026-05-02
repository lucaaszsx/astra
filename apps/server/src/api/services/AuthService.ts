import { LoggerDecorator } from '@/decorators';
import { LoggerInterface } from '@/lib/logger';
import { Service } from 'typedi';

//@Service()
export class AuthService {
    constructor(
        @LoggerDecorator(__filename)
        private readonly logger: LoggerInterface
    ) {}
}
