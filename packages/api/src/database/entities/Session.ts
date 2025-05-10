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

    async loadUser() {
        const user = await this.client.query.users.findFirst({
            where: eq(schema.users.id, (this as unknown as SessionEntity).userId)
        });

        this.user = User(this.client, user);
    }
}

export type SessionEntity = SessionClass & typeof schema.sessions.$inferSelect;
export function Session(client: typeof db, obj?: RecursiveExcludeFunctions<SessionEntity>): SessionEntity {
    // @ts-expect-error Properties don't exist in the class, but they do exist on the object.
    return new SessionClass(client, obj);
}
