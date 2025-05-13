import { RecursiveExcludeFunctions } from "loved";
import { db, schema } from "..";
import { BaseEntity } from "./BaseEntity";
import { User, UserEntity } from "./User";
import { eq } from "drizzle-orm";

class SessionClass extends BaseEntity {
    user?: UserEntity;

    constructor(client: typeof db, obj?: object) {
        super(client);
        Object.assign(this, obj);
    }

    isExpired() {
        const self = this as unknown as SessionEntity;
        return self.expiresAt < new Date();
    }

    ValidToBeRenewed(offset: number = 0) {
        const self = this as unknown as SessionEntity;
        return Date.now() >= self.expiresAt.getTime() - offset;
    }

    async loadUser() {
        const user = await this.client.query.users.findFirst({
            where: eq(schema.users.id, (this as unknown as SessionEntity).userId)
        });

        if (!user)
            return;

        this.user = User(this.client, user);
        this.user.currentSession = this as unknown as SessionEntity;
    }
}

export type SessionEntity = SessionClass & typeof schema.sessions.$inferSelect;
export function Session(client: typeof db, obj?: RecursiveExcludeFunctions<SessionEntity>): SessionEntity {
    // @ts-expect-error Properties don't exist in the class, but they do exist on the object.
    return new SessionClass(client, obj);
}
