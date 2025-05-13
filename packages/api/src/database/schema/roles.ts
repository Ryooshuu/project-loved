import { boolean, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const roles = pgTable("roles", {
    id: uuid().notNull().primaryKey().defaultRandom(),
    name: text().notNull().unique(),
    displayName: text(),
    visible: boolean().notNull().default(false)
});
