import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
    type: process.env.DATABASE_TYPE as "mysql" | "mariadb" | "postgres" | "sqlite" | "mongodb", 
    host: process.env.DATABASE_HOST || "localhost",
    port: parseInt(process.env.DATABASE_PORT || "3307"),
    username: process.env.DATABASE_USER || "root",
    password: process.env.DATABASE_PASS || "",
    database: process.env.DATABASE_NAME || "",
    synchronize: false,
    logging: false,
    dropSchema: false,
    entities: ['./src/models/*.ts'],
    migrations: ['./src/migrations/*.ts']
})