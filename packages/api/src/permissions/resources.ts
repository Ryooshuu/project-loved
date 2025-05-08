import { Permissions } from "@loved/permissions";
import { UserEntity } from "../database/entities/User";

export const resources = new Permissions()
    .resource<UserEntity>("user");
