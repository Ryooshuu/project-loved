import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import Elysia from "elysia";
import colors from "picocolors";
import { config, createLogger } from "loved";
import { appController } from "./src/modules";
import pkg from "../../package.json";

export const logger = createLogger("backend");
export const createBackendLogger = (name: string) => logger.createChild(name);
logger.debug("Starting Elysia server...");

const port = config.api.port;

new Elysia()
    .get("/health", () => ({ status: "ok" }))

    .use(cors())
    .use(swagger({
        path: "/api/docs",
        exclude: ["/api/docs", "/api/docs/json", "/health"],
        scalarVersion: "latest",
        documentation: {
            info: {
                title: "Loved API",
                version: pkg.version,
                description: "A reamagined API for Project Loved."
            },
            tags: []
        }
    }))

    .onBeforeHandle(async ({ request }) => {
        logger.debug(`[${colors.bold(request.method)}] ${request.url}`);
    })
    .onAfterResponse(({ response }) => {
        logger.trace(`Responded with: ${JSON.stringify(response, null, 4)}`);
    })
    .onError(({ error }) => {
        const err = error as Error;
        logger.error(`Error handling request.\n${err}`);
    })

    .use(appController)

    .listen(port, (server) => {
        logger.info(`API listening on ${server.url}`);
    });

export { type AppType } from "./src/modules";
