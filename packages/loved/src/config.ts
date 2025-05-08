import { readFileSync } from "fs";
import { resolve } from "path";
import { parse } from "yaml";
import { LogLevel } from "./lib/Logger";

export type Config = {
    logger: {
        level: LogLevel
        plugins: string[]
        file: {
            path: string
            level?: LogLevel
        }
    }
    api: {
        database: {
            host: string
            port: number
            user: string
            password: string
            database: string
            ssl: boolean
        }
        port: number
    }
    vite: {
        port: number
    }
};

export function resolveFromConfig(env: string, fallback: string) {
    const dir = resolve(__dirname, "../../../.config");
    const path = process.env[env]
        ? resolve(dir, process.env[env])
        : resolve(dir, fallback);

    return path;
}

const filePath = resolveFromConfig("CONFIG_FILE", "default.yml");
let cachedConfig: Config | undefined = undefined;

export function getConfig() {
    if (!cachedConfig) {
        cachedConfig = parse(readFileSync(filePath, "utf-8")) as Config;
    }

    return cachedConfig;
}

export const config = cachedConfig ?? getConfig();
