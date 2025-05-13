import { Option, Result } from "ts-results";
import { schema } from "..";
import { DatabaseError } from "../DatabaseError";
import { SessionEntity } from "../entities/Session";
import { UserEntity } from "../entities/User";

export interface UserRepository {
    // create
    createUser(user: typeof schema.users.$inferInsert): Promise<Result<UserEntity, DatabaseError>>
    createSession(session: typeof schema.sessions.$inferInsert): Promise<Result<SessionEntity, DatabaseError>>

    // read
    findById(userId: string): Promise<Option<UserEntity>>
    findByUsername(username: string): Promise<Option<UserEntity>>
    findSessionByToken(token: string): Promise<Option<SessionEntity>>
    findUserSessions(userId: string): Promise<SessionEntity[]>

    // update
    update(
        userId: string,
        user: Partial<typeof schema.users.$inferInsert>
    ): Promise<Result<UserEntity, DatabaseError>>
    updateSession(
        sessionToken: string,
        session: Partial<typeof schema.sessions.$inferInsert>
    ): Promise<Result<SessionEntity, DatabaseError>>

    // delete
    delete(userId: string): Promise<Result<boolean, DatabaseError>>
    deleteSession(sessionToken: string): Promise<Result<boolean, DatabaseError>>
    deleteUserSessions(userId: string): Promise<Result<boolean, DatabaseError>>
}
