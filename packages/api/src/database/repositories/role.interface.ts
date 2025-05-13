import { Option, Result } from "ts-results";
import { RoleEntity } from "../entities/Role";
import { DatabaseError } from "../DatabaseError";
import { schema } from "..";

export interface RoleRepository {
    // create
    createRole(role: typeof schema.roles.$inferInsert): Promise<Result<RoleEntity, DatabaseError>>

    // read
    getRoles(): Promise<Option<RoleEntity[]>>
    getRole(id: string): Promise<Option<RoleEntity>>
    getRoleByName(name: string): Promise<Option<RoleEntity>>

    // update
    updateRole(id: string, role: typeof schema.roles.$inferInsert): Promise<Result<RoleEntity, DatabaseError>>

    // delete
    deleteRole(id: string): Promise<Result<boolean, DatabaseError>>
}
