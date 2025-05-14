import { treaty } from "@elysiajs/eden";
import type { ApiType } from "@loved/api/modules/api";

export const client = treaty<ApiType>("localhost:4000");
