import { type RecursiveExcludeFunctions } from "loved";
import { db } from "..";

export abstract class BaseEntity {
    protected constructor(
        protected readonly client: typeof db
    ) {}

    toJson(): RecursiveExcludeFunctions<this> {
        return JSON.parse(JSON.stringify(this));
    }
}
