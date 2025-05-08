import { Permissions } from "@loved/permissions";
import { resources } from "./resources";

export const permissions = new Permissions()
    .use(resources);
