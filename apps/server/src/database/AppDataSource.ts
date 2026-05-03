/**
 * @file AppDataSource.ts
 * @description Configures and exports the TypeORM DataSource instance.
 * The DataSource is initialized lazily by DatabaseLoader during application boot.
 * @author Lucas
 * @license MIT
 */

import { DataSourceOptions, DataSource } from 'typeorm';
import { Env } from '@/config/env';

const options: DataSourceOptions = {
    type: 'postgres',
    url: Env.Pg.url,

    synchronize: Env.Pg.synchronize as boolean,
    migrationsRun: Env.node !== 'prod',
    logging: Env.Pg.logging,
    entities: Env.App.dirs.entities,
    migrations: Env.App.dirs.migrations,
    subscribers: Env.App.dirs.subscribers
};

export const appDataSource = new DataSource(options);