import { RecursiveExcludeFunctions } from "loved";
import { db, relations, schema } from "..";
import { BaseEntity } from "./BaseEntity";
import { Session, SessionEntity } from "./Session";
import { eq } from "drizzle-orm";
import { Role } from "./Role";

const sensitiveFields = ["tokens", "sessions", "currentSession"] as const;
type SensitiveFields = typeof sensitiveFields[number];

class UserClass extends BaseEntity {
    sessions?: SessionEntity[];
    currentSession?: SessionEntity;

    constructor(client: typeof db, obj?: object) {
        super(client);
        Object.assign(this, obj);
    }

    toSafeJson(): RecursiveExcludeFunctions<Omit<this, SensitiveFields>> {
        const copy = this.toJson();
        // @ts-expect-error Properties don't exist on this class.
        sensitiveFields.forEach(field => delete copy[field]);
        // @ts-expect-error They don't match, but that isn't a problem.
        return copy;
    }

    async loadSessions() {
        const sessions = await this.client.query.sessions.findMany({
            where: eq(schema.sessions.userId, (this as unknown as UserEntity).id)
        });

        this.sessions = sessions.map(session => Session(this.client, session));
    }

    async getAssignedRoles() {
        const roles = await this.client.query.usersToRoles.findMany({
            where: eq(relations.usersToRoles.userId, (this as unknown as UserEntity).id),
            with: {
                role: true
            }
        });

        if (roles.length === 0) {
            return [];
        }

        return roles.map(role => Role(this.client, role.role));
    }
}

export type UserEntity = UserClass & typeof schema.users.$inferSelect;
export function User(client: typeof db, obj?: RecursiveExcludeFunctions<UserEntity>): UserEntity {
    // @ts-expect-error Properties don't exist in the class, but they do exist on the object.
    return new UserClass(client, obj);
}
