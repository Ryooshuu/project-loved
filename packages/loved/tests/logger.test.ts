import { createLogger } from "loved";
import { describe, expect, it } from "vitest";

describe("logger", () => {
    it("should create a logger", () => {
        const logger = createLogger("test");
        testLogger("test", logger);
    });

    it("should create a child logger", () => {
        const logger = createLogger("test");
        const child = logger.createChild("child");
        testLogger("child", child);
    });
});

function testLogger(name: string, logger: ReturnType<typeof createLogger>) {
    expect(logger).toBeDefined();
    expect(logger.name).toBe(name);

    logger.trace("trace");
    logger.debug("debug");
    logger.info("info");
    logger.warn("warn");
    logger.error("error");
    logger.fatal("fatal");
}
