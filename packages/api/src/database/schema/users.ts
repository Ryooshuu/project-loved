import { boolean, json, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid().notNull().primaryKey().defaultRandom(),
    username: text().unique().notNull(),
    country: varchar({ length: 32 }),
    restricted: boolean().notNull().default(false),
    apiFetchedAt: timestamp().notNull().defaultNow(),
    tokens: json().notNull().default([])
});
