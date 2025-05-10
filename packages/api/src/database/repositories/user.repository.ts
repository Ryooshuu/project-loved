import { eq } from "drizzle-orm";
import { db, schema } from "..";
import { Session } from "../entities/Session";
import { User } from "../entities/User";
import { UserRepository } from "./user.interface";
import { DatabaseError } from "../DatabaseError";

export class DrizzleUserRepository implements UserRepository {
    // create
    async create(
        user: typeof schema.users.$inferInsert,
        session: Omit<typeof schema.sessions.$inferInsert, "userId">
    ) {
        const [newUser] = await db.insert(schema.users)
            .values({
                ...user
            })
            .onConflictDoUpdate({
                target: schema.users.id,
                set: {
                    tokens: user.tokens
                }
            })
            .returning();

        if (!newUser) {
            throw new DatabaseError("Failed to create user.");
        }

        const [newSession] = await db.insert(schema.sessions)
            .values({
                ...session,
                userId: newUser.id
            })
            .returning();

        if (!newSession) {
            throw new DatabaseError("Failed to create session.");
        }

        const userEntity = User(db, newUser);
        userEntity.currentSession = Session(db, newSession);

        return userEntity;
    }

    async createDbUser(user: typeof schema.users.$inferInsert) {
        const [newUser] = await db.insert(schema.users)
            .values({
                ...user
            })
            .returning();

        if (!newUser) {
            throw new DatabaseError("Failed to create user.");
        }

        return User(db, newUser);
    }

    async createDbSession(session: typeof schema.sessions.$inferInsert) {
        const [newSession] = await db.insert(schema.sessions)
            .values({
                ...session
            })
            .returning();

        if (!newSession) {
            throw new DatabaseError("Failed to create session.");
        }

        return Session(db, newSession);
    }

    async findById(userId: string) {
        const user = await db.query.users.findFirst({
            where: eq(schema.users.id, userId)
        });

        if (!user) {
            return null;
        }

        return User(db, user);
    }

    async findByUsername(username: string) {
        const user = await db.query.users.findFirst({
            where: eq(schema.users.username, username)
        });

        if (!user) {
            return null;
        }

        return User(db, user);
    }

    async findSessionByToken(token: string) {
        const session = await db.query.sessions.findFirst({
            where: eq(schema.sessions.sessionToken, token)
        });

        if (!session) {
            return null;
        }

        return Session(db, session);
    }

    async findUserSessions(userId: string) {
        const sessions = await db.query.sessions.findMany({
            where: eq(schema.sessions.userId, userId)
        });

        if (!sessions) {
            return [];
        }

        return sessions.map(session => Session(db, session));
    }

    // update
    async update(
        userId: string,
        user: Partial<typeof schema.users.$inferInsert>
    ) {
        const [updatedUser] = await db.update(schema.users)
            .set({
                ...user
            })
            .where(eq(schema.users.id, userId))
            .returning();

        if (!updatedUser) {
            throw new DatabaseError("Failed to update user.");
        }

        return User(db, updatedUser);
    }

    async updateSession(
        sessionToken: string,
        session: Partial<typeof schema.sessions.$inferInsert>
    ) {
        const [updatedSession] = await db.update(schema.sessions)
            .set({
                ...session
            })
            .where(eq(schema.sessions.sessionToken, sessionToken))
            .returning();

        if (!updatedSession) {
            throw new DatabaseError("Failed to update session.");
        }

        return Session(db, updatedSession);
    }

    // delete
    async delete(userId: string) {
        if (!(await this.deleteUserSessions(userId))) {
            throw new DatabaseError("Failed to delete user sessions.");
        }

        const res = await db.delete(schema.users)
            .where(eq(schema.users.id, userId));

        return (res.rowCount ?? 0) > 0;
    }

    async deleteSession(sessionToken: string) {
        const res = await db.delete(schema.sessions)
            .where(eq(schema.sessions.sessionToken, sessionToken));

        return (res.rowCount ?? 0) > 0;
    }

    async deleteUserSessions(userId: string) {
        const res = await db.delete(schema.sessions)
            .where(eq(schema.sessions.userId, userId));

        return (res.rowCount ?? 0) > 0;
    }
}
