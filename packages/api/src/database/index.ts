import * as schema from "./schema";
import * as relations from "./schema/relations";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { config } from "loved";
import { DefaultLogger } from "drizzle-orm";
import { DatabaseLogWriter } from "./databaseLogWriter";

const pool = new Pool({
    host: config.api.database.host,
    port: config.api.database.port,
    user: config.api.database.user,
    password: config.api.database.password,
    database: config.api.database.database,
    ssl: config.api.database.ssl
});

const logger = new DefaultLogger({ writer: new DatabaseLogWriter() });

export const db = drizzle(pool, {
    schema: { ...schema, ...relations },
    logger
});

export { schema, relations };
