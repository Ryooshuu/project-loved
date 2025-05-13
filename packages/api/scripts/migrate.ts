import { db, schema } from "../src/database";
import { parseArgs } from "util";
import { Roles } from "../src/permissions/roles";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { config, createLogger } from "loved";
import { Pool } from "pg";
import { exit } from "process";

const logger = createLogger("seed");

const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

const { values } = parseArgs({
    args: Bun.argv,
    strict: true,
    allowPositionals: true,
    options: {
        fresh: {
            type: "boolean",
            default: false
        },
        seed: {
            type: "boolean",
            default: false
        }
    }
});

if (values.fresh) {
    const pool = new Pool({
        host: config.api.database.host,
        port: config.api.database.port,
        user: config.api.database.user,
        password: config.api.database.password,
        database: "postgres",
        ssl: config.api.database.ssl
    });

    logger.debug("Refreshing database");
    await pool.query("DROP DATABASE IF EXISTS " + config.api.database.database);
    await pool.query("CREATE DATABASE " + config.api.database.database);
    logger.info("Database Refreshed");
}

async function doMigrations() {
    const { migrate } = await import("drizzle-orm/postgres-js/migrator");
    await migrate(db, { migrationsFolder: join(_dirname, "../drizzle") });
}

async function seedRoles() {
    const rolesToAdd = Object.values(Roles);

    await db.transaction(async (tx) => {
        for (const role of rolesToAdd) {
            await tx.insert(schema.roles)
                .values({ name: role })
                .onConflictDoNothing();
        }
    });
}

logger.debug("Migrating database");
await doMigrations();
logger.info("Migrations complete");

if (values.seed) {
    logger.debug("Seeding database");
    await seedRoles();
    logger.info("Seeding complete");
}

exit();
