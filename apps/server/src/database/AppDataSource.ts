import { DataSourceOptions, DataSource } from 'typeorm';
import { Env } from '@/config/env';

const options: DataSourceOptions = {
    type: 'postgres',
    url: Env.Pg.url,

    synchronize: Env.Pg.synchronize,
    migrationsRun: Env.node !== 'prod',
    logging: Env.Pg.logging,
    entities: Env.App.dirs.entities,
    migrations: Env.App.dirs.migrations,
    subscribers: Env.App.dirs.subscribers
};

export const appDataSource = new DataSource(options);
