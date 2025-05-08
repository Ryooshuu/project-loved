import { RecursiveExcludeFunctions } from "loved";
import { schema } from "..";
import { BaseEntity } from "./BaseEntity";

class SessionClass extends BaseEntity {
    constructor(obj?: object) {
        super();
        Object.assign(this, obj);
    }
}

export type SessionEntity = SessionClass & typeof schema.sessions.$inferSelect;
export function Session(obj?: RecursiveExcludeFunctions<SessionEntity>): SessionEntity {
    // @ts-expect-error Properties don't exist in the class, but they do exist on the object.
    return new SessionClass(obj);
}
