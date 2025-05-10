import { schema } from "..";
import { SessionEntity } from "../entities/Session";
import { UserEntity } from "../entities/User";

export interface UserRepository {
    // create
    create(
        user: typeof schema.users.$inferInsert,
        session: Omit<typeof schema.sessions.$inferInsert, "userId">
    ): Promise<UserEntity>
    createDbUser(user: typeof schema.users.$inferInsert): Promise<UserEntity>
    createDbSession(session: typeof schema.sessions.$inferInsert): Promise<SessionEntity>

    // read
    findById(userId: string): Promise<UserEntity | null>
    findByUsername(username: string): Promise<UserEntity | null>
    findSessionByToken(token: string): Promise<SessionEntity | null>
    findUserSessions(userId: string): Promise<SessionEntity[]>

    // update
    update(
        userId: string,
        user: Partial<typeof schema.users.$inferInsert>
    ): Promise<UserEntity>
    updateSession(
        sessionToken: string,
        session: Partial<typeof schema.sessions.$inferInsert>
    ): Promise<SessionEntity>

    // delete
    delete(userId: string): Promise<boolean>
    deleteSession(sessionToken: string): Promise<boolean>
    deleteUserSessions(userId: string): Promise<boolean>
}
