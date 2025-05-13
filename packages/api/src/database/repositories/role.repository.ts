import { RoleRepository } from "./role.interface";
import { db, schema } from "..";
import { Role } from "../entities/Role";
import { Err, None, Ok, Some } from "ts-results";
import { eq } from "drizzle-orm";
import { DatabaseError } from "../DatabaseError";

export class DrizzleRoleRepository implements RoleRepository {
    async createRole(role: typeof schema.roles.$inferInsert) {
        const [newRole] = await db.insert(schema.roles)
            .values({
                ...role
            })
            .returning();

        if (!role) {
            return Err(new DatabaseError("Failed to create role."));
        }

        return Ok(Role(db, newRole));
    }

    async getRoles() {
        const roles = await db.query.roles.findMany();

        if (roles.length === 0) {
            return None;
        }

        return Some(roles.map(role => Role(db, role)));
    }

    async getRole(id: string) {
        const role = await db.query.roles.findFirst({
            where: eq(schema.roles.id, id)
        });

        if (!role) {
            return None;
        }

        return Some(Role(db, role));
    }

    async getRoleByName(name: string) {
        const role = await db.query.roles.findFirst({
            where: eq(schema.roles.name, name)
        });

        if (!role) {
            return None;
        }

        return Some(Role(db, role));
    }

    async updateRole(id: string, role: typeof schema.roles.$inferInsert) {
        const [updatedRole] = await db.update(schema.roles)
            .set({
                ...role
            })
            .where(eq(schema.roles.id, id))
            .returning();

        if (!updatedRole) {
            return Err(new DatabaseError("Failed to update role."));
        }

        return Ok(Role(db, updatedRole));
    }

    async deleteRole(id: string) {
        const res = await db.delete(schema.roles)
            .where(eq(schema.roles.id, id));

        return Ok((res.rowCount ?? 0) > 0);
    }
}
