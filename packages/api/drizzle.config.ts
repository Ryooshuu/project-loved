import { defineConfig } from "drizzle-kit";
import { config } from "loved";

export default defineConfig({
    out: "./drizzle",
    schema: ["./src/database/schema/**/*"],
    dialect: "postgresql",
    dbCredentials: {
        host: config.api.database.host,
        port: config.api.database.port,
        user: config.api.database.user,
        password: config.api.database.password,
        database: config.api.database.database,
        ssl: config.api.database.ssl
    }
});
