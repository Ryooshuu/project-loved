import { relations } from "drizzle-orm";
import { users } from "../users";
import { sessions } from "../sessions";

export const userToSessionsRelations = relations(users, ({ many }) => ({
    sessions: many(sessions)
}));

export const sessionToUserRelations = relations(sessions, ({ one }) => ({
    account: one(users, {
        fields: [sessions.userId],
        references: [users.id]
    })
}));
