import { eq } from "drizzle-orm";
import { db, schema } from "..";
import { Session } from "../entities/Session";
import { User } from "../entities/User";
import { UserRepository } from "./user.interface";
import { DatabaseError } from "../DatabaseError";
import { Err, None, Ok, Some } from "ts-results";

export class DrizzleUserRepository implements UserRepository {
    // create
    async createUser(user: typeof schema.users.$inferInsert) {
        const [newUser] = await db.insert(schema.users)
            .values({
                ...user
            })
            .returning();

        if (!newUser) {
            return Err(new DatabaseError("Failed to create user."));
        }

        return Ok(User(db, newUser));
    }

    async createSession(session: typeof schema.sessions.$inferInsert) {
        const [newSession] = await db.insert(schema.sessions)
            .values({
                ...session
            })
            .returning();

        if (!newSession) {
            return Err(new DatabaseError("Failed to create session."));
        }

        return Ok(Session(db, newSession));
    }

    async findById(userId: string) {
        const user = await db.query.users.findFirst({
            where: eq(schema.users.id, userId)
        });

        if (!user) {
            return None;
        }

        return Some(User(db, user));
    }

    async findByUsername(username: string) {
        const user = await db.query.users.findFirst({
            where: eq(schema.users.username, username)
        });

        if (!user) {
            return None;
        }

        return Some(User(db, user));
    }

    async findSessionByToken(token: string) {
        const session = await db.query.sessions.findFirst({
            where: eq(schema.sessions.sessionToken, token)
        });

        if (!session) {
            return None;
        }

        return Some(Session(db, session));
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
            return Err(new DatabaseError("Failed to update user."));
        }

        return Ok(User(db, updatedUser));
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
            return Err(new DatabaseError("Failed to update session."));
        }

        return Ok(Session(db, updatedSession));
    }

    // delete
    async delete(userId: string) {
        if (!(await this.deleteUserSessions(userId))) {
            return Err(new DatabaseError("Failed to delete user sessions."));
        }

        const res = await db.delete(schema.users)
            .where(eq(schema.users.id, userId));

        return Ok((res.rowCount ?? 0) > 0);
    }

    async deleteSession(sessionToken: string) {
        const res = await db.delete(schema.sessions)
            .where(eq(schema.sessions.sessionToken, sessionToken));

        return Ok((res.rowCount ?? 0) > 0);
    }

    async deleteUserSessions(userId: string) {
        const res = await db.delete(schema.sessions)
            .where(eq(schema.sessions.userId, userId));

        return Ok((res.rowCount ?? 0) > 0);
    }
}
