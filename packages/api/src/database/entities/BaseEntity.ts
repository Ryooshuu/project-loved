import { type RecursiveExcludeFunctions } from "loved";
import { db } from "..";

export abstract class BaseEntity {
    protected constructor(
        protected readonly client: typeof db
    ) {}

    toJson(): RecursiveExcludeFunctions<this> {
        const seen: unknown[] = [];

        return JSON.parse(JSON.stringify(this, (key, val) => {
            if (key === "client") return;

            if (val != null && typeof val === "object") {
                if (seen.indexOf(val) >= 0) {
                    return;
                }

                seen.push(val);
            }

            return val;
        }));
    }
}
