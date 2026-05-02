import { DataSourceOptions, DataSource } from 'typeorm';
import { Env } from '@/config/env';

const options: DataSourceOptions = {
    type: Env.Pg.type,
    host: Env.Pg.host,
    port: Env.Pg.port,
    username: Env.Pg.username,
    password: Env.Pg.password,
    database: Env.Pg.database,

    synchronize: Env.Pg.synchronize,

    migrationsRun: true,
    entities: Env.App.dirs.entities,
    migrations: Env.App.dirs.migrations,

    logging:     Env.Pg.logging,
    subscribers: Env.App.dirs.subscribers
};

export const appDataSource = new DataSource(options);