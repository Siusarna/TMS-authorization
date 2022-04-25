import * as path from 'path';
import * as dotenv from 'dotenv';
import {TypeOrmModuleOptions} from "@nestjs/typeorm";

const env = process.env.NODE_ENV || 'dev';
const dotenv_path = path.resolve(process.cwd(), `.${env}.env`);
dotenv.config({path: dotenv_path});


export const DatabaseConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ["src/**/*.entity{.ts,.js}"],
    migrations: ["src/migrations/**/*{.ts,.js}"],
    migrationsTableName: process.env.DB_MIGRATION_TABLE,
    synchronize: false,
    migrationsRun: false,
    cli: {"migrationsDir": "src/migrations"}
}

export default DatabaseConfig;