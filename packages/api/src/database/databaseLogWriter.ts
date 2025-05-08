import { LogWriter } from "drizzle-orm";
import { createLogger } from "loved";

export class DatabaseLogWriter implements LogWriter {
    private readonly backingLogger: ReturnType<typeof createLogger>;

    constructor() {
        this.backingLogger = createLogger("database");
    }

    write(message: string): void {
        this.backingLogger.trace(message);
    }
}
