import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const sessions = pgTable("sessions", {
    id: uuid().notNull().primaryKey().defaultRandom(),
    userId: uuid().notNull(),
    sessionToken: text().notNull(),
    expiresAt: timestamp().notNull()
});
