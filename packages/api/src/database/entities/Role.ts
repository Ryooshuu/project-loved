import { RecursiveExcludeFunctions } from "loved";
import { db, relations, schema } from "..";
import { BaseEntity } from "./BaseEntity";
import { eq } from "drizzle-orm";
import { User } from "./User";

class RoleClass extends BaseEntity {
    constructor(client: typeof db, obj?: object) {
        super(client);
        Object.assign(this, obj);
    }

    async getAssignedUsers() {
        const roles = await this.client.query.usersToRoles.findMany({
            where: eq(relations.usersToRoles.roleId, (this as unknown as RoleEntity).id),
            with: {
                user: true
            }
        });

        if (roles.length === 0) {
            return [];
        }

        return roles.map(role => User(this.client, role.user));
    }
}

export type RoleEntity = RoleClass & typeof schema.roles.$inferSelect;
export function Role(client: typeof db, obj?: RecursiveExcludeFunctions<RoleEntity>): RoleEntity {
    // @ts-expect-error Properties don't exist in the class, but they do exist on the object.
    return new RoleClass(client, obj);
}
