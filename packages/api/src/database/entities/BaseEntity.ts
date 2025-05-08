import { type RecursiveExcludeFunctions } from "loved";

export abstract class BaseEntity {
    toJson(): RecursiveExcludeFunctions<this> {
        return JSON.parse(JSON.stringify(this));
    }
}
