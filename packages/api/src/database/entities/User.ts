import { RecursiveExcludeFunctions } from "loved";
import { schema } from "..";
import { BaseEntity } from "./BaseEntity";

const sensitiveFields = ["tokens", "sessions"] as const;
type SensitiveFields = typeof sensitiveFields[number];

class UserClass extends BaseEntity {
    constructor(obj?: object) {
        super();
        Object.assign(this, obj);
    }

    toSafeJson(): RecursiveExcludeFunctions<Omit<this, SensitiveFields>> {
        const copy = this.toJson();
        // @ts-expect-error Properties don't exist on this class.
        sensitiveFields.forEach(field => delete copy[field]);
        // @ts-expect-error They don't match, but that isn't a problem.
        return copy;
    }
}

export type UserEntity = UserClass & typeof schema.users.$inferSelect;
export function User(obj?: RecursiveExcludeFunctions<UserEntity>): UserEntity {
    // @ts-expect-error Properties don't exist in the class, but they do exist on the object.
    return new UserClass(obj);
}
