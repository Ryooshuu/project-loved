import { relations } from "drizzle-orm";
import { boolean, integer, pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { users } from "../users";
import { roles } from "../roles";

export const userRolesRelations = relations(users, ({ many }) => ({
    usersToRoles: many(usersToRoles)
}));

export const rolesUsersRelations = relations(roles, ({ many }) => ({
    usersToRoles: many(usersToRoles)
}));

export const usersToRoles = pgTable("users_to_roles", {
    userId: uuid().notNull().references(() => users.id),
    roleId: uuid().notNull().references(() => roles.id),
    rulesetId: integer(),
    alumni: boolean().notNull().default(false)
}, t => [
    primaryKey({ columns: [t.userId, t.roleId] })
]);

export const usersToRolesRelations = relations(usersToRoles, ({ one }) => ({
    role: one(roles, {
        fields: [usersToRoles.roleId],
        references: [roles.id]
    }),
    user: one(users, {
        fields: [usersToRoles.userId],
        references: [users.id]
    })
}));
