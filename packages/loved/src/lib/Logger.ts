import { config } from "../config";
import { Module, Plugin } from "./Module";
import { ConsoleLogger } from "./plugins/logger/ConsoleLogger";

export type LogLevel =
  | "trace"
  | "debug"
  | "info"
  | "warn"
  | "error"
  | "fatal";

export type LoggerContext = {
    name: string
    parent: Logger
};

export type LoggerPlugin = Plugin & {
    log(level: LogLevel, message: string, context: LoggerContext): void
};

export abstract class Logger extends Module<LoggerPlugin> {
    constructor(
        public readonly name: string,
        public readonly parent?: Logger,
        plugins: LoggerPlugin[] = []
    ) {
        super(plugins);
    }

    abstract createChild(name: string): Logger;

    trace(message: string) {
        this.log("trace", message);
    }

    debug(message: string) {
        this.log("debug", message);
    }

    info(message: string) {
        this.log("info", message);
    }

    warn(message: string) {
        this.log("warn", message);
    }

    error(message: string) {
        this.log("error", message);
    }

    fatal(message: string) {
        this.log("fatal", message);
    }

    log(level: LogLevel, message: string) {
        this.plugins.forEach((p) => {
            p.log(level, message, { name: this.name, parent: this });
        });
    }
}

export function createLogger(name: string): Logger {
    const clazz = class extends Logger {
        constructor(
            private readonly level: LogLevel,
            name: string,
            parent?: Logger,
            plugins: LoggerPlugin[] = []
        ) {
            super(name, parent, plugins);
        }

        createChild(name: string): Logger {
            return new clazz(this.level, name, this, this.plugins);
        }

        log(level: LogLevel, message: string): void {
            const numericalLevel = this.getNumericalLevel(level);
            if (numericalLevel >= this.getNumericalLevel(this.level)) {
                super.log(level, message);
            }
        }

        private getNumericalLevel(level: LogLevel) {
            switch (level) {
                case "trace":
                    return 0;
                case "debug":
                    return 1;
                case "info":
                    return 2;
                case "warn":
                    return 3;
                case "error":
                    return 4;
                case "fatal":
                    return 5;
            }
        }
    };

    const impl = new clazz(config.logger.level, name);

    for (const plugin of config.logger.plugins) {
        switch (plugin) {
            case "console":
                impl.addPlugin(new ConsoleLogger());
                break;
        }
    }

    return impl;
}

export const globalLogger: Logger = createLogger("loved");
