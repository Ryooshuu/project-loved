import isUnicodeSupported from "is-unicode-supported";
import color from "picocolors";
import type { LoggerPlugin, Logger, LoggerContext, LogLevel } from "../../Logger";

const unicode = isUnicodeSupported();
const symbol = (icon: string, fallback: string) => unicode ? icon : fallback;

const s_trace = symbol("│", "|");
const s_debug = symbol("├", "|");
const s_info = symbol("●", "*");
const s_warn = symbol("⚠", "!");
const s_error = symbol("✖", "x");
const s_fatal = symbol("󰈻", "!!");

const s_caret = symbol("▸", ">");
const s_bar = symbol("│", "|");

export class ConsoleLogger implements LoggerPlugin {
    name = "console";

    log(level: LogLevel, message: string, context: LoggerContext): void {
        const symbol = this.getSymbol(level);
        const parts = [];

        const [firstLine, ...restLines] = message.split("\n");
        parts.push(`${symbol}  ${this.headerLoggerNames(context.parent).join(" ")} ${firstLine}`, ...restLines.map(l => `${color.gray(s_bar)}  ${l}`));

        process.stdout.write(`${parts.join("\n")}\n`);
    }

    getSymbol(level: LogLevel) {
        switch (level) {
            case "trace": return s_trace;
            case "debug": return s_debug;
            case "info": return s_info;
            case "warn": return s_warn;
            case "error": return s_error;
            case "fatal": return s_fatal;
        }
    }

    createNameAscii(name: string) {
        const nameRgb = this.hslToRgb(this.toHue(name), 1, 0.65);
        const namePart = color.isColorSupported
            ? this.format(" ", `\x1b[48;2;${nameRgb[0]};${nameRgb[1]};${nameRgb[2]}m`, "\x1b[49m") + " " + color.white(color.bold(name))
            : name;

        return namePart;
    }

    format(input: string, open: string, close: string, replace?: string) {
        const str = "" + input;
        const index = str.indexOf(close, open.length);

        return ~index
            ? open + this.replaceClose(str, close, index, replace) + close
            : open + input + close;
    }

    replaceClose(input: string, close: string, index: number, replace?: string): string {
        const start = input.substring(0, index) + replace;
        const end = input.substring(index + close.length);
        const nextIndex = end.indexOf(close);

        return ~nextIndex ? start + this.replaceClose(end, close, nextIndex, replace) : start + end;
    }

    headerLoggerNames(parent: Logger): string[] {
        const parts = [];
        if (parent.parent)
            parts.push(...this.headerLoggerNames(parent.parent));

        parts.push(this.createNameAscii(parent.name));
        parts.push(s_caret);

        return parts;
    }

    hslToRgb(h: number, s: number, l: number) {
        let r, g, b;

        while (h < 0) h += 360;
        while (h > 360) h -= 360;
        h /= 360;

        if (s === 0) {
            r = g = b = l;
        }
        else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = this.hueToRgb(p, q, h + 1 / 3);
            g = this.hueToRgb(p, q, h);
            b = this.hueToRgb(p, q, h - 1 / 3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    hueToRgb(p: number, q: number, t: number) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;

        return p;
    }

    // hash a string to a hue
    toHue(str: string) {
        let hash = 0;
        if (str.length === 0) return hash;

        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
            hash = hash & hash;
        }

        return Math.abs(hash) % 360;
    }
}
