import { Lock } from "../../Lock";
import { Buffer } from "./Buffer";

export abstract class LayoutBuffer<Format extends string> extends Buffer {
    private _location: number;
    private _formatStride: number;
    private _layout: Map<number, Format> = new Map();

    protected get layout() {
        return this._layout;
    }

    public get location() {
        return this._location;
    }

    public get formatStride() {
        return this._formatStride;
    }

    constructor() {
        super();

        this._location = 0;
        this._formatStride = 0;
    }

    public lockLayout(size?: number) {
        super.lock(size ?? this._formatStride);
    }

    protected addLayout(location: number | undefined, format: Format) {
        if (Lock.isEntered(this))
            throw new Error("Cannot modify layout buffer after it has been locked.");

        const size = this.getByteSize(format);
        const validLocation = this.getLocation(location);
        this.addLayoutImplementation(format, validLocation, size);
        this._layout.set(validLocation, format);

        this._location = Math.max(this._location + 1, validLocation + 1);
        this._formatStride += size;
    }

    private getLocation(location: number | undefined) {
        if (location !== undefined)
            return location;

        let result = 0;
        while (this._layout.has(result)) {
            result++;
        }

        return result;
    }

    protected abstract getByteSize(format: Format): number;
    protected abstract addLayoutImplementation(format: Format, location: number, stride: number): void;
}
