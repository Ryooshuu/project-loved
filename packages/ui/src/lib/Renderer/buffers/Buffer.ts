import { Lock } from "../../Lock";

export abstract class Buffer {
    private bufferSize: number;
    private _bytes!: Float32Array;

    get bytes(): Float32Array | undefined {
        if (!Lock.isEntered(this))
            throw new Error("Buffer must be locked before accessing its bytes.");

        return this._bytes;
    }

    protected get size(): number {
        return this.bufferSize;
    }

    constructor() {
        this.bufferSize = 0;
    }

    public lock(size: number) {
        Lock.enter(this);
        this.bufferSize = size;
        this._bytes = new Float32Array(size);
    }

    protected setData(offset: number, data: ArrayLike<number>) {
        if (offset + data.length > this.bufferSize)
            throw new Error(`Cannot set data due to overflow. (${offset + data.length} > ${this.bufferSize})`);

        this._bytes.set(data, offset);
    }

    [Symbol.dispose]() {
        Lock.exit(this);
    }
}
