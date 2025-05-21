import { Lock } from "../../Lock";
import { IndexLayout } from "../Renderer.interface";
import { checkFormat, getVertexTypeSize } from "../utils";
import { LayoutBuffer } from "./LayoutBuffer";

export abstract class VertexBuffer extends LayoutBuffer<GPUVertexFormat> {
    private stride: number;

    protected elements: number;
    protected indexLayout: IndexLayout;

    constructor(layout: IndexLayout) {
        super();

        this.indexLayout = layout;
        this.elements = 0;
        this.stride = 0;
    }

    public lockLayout(elements: number) {
        super.lockLayout((this.formatStride / 4) * elements);
        this.elements = elements;
    }

    public add(...args: ArrayLike<number>[]) {
        if (!Lock.isEntered(this))
            throw new Error("Layout must be locked before adding data.");

        if (args.length !== this.layout.size)
            throw new Error(`Arguments must match layout size. Expected ${this.layout.size}, got ${args.length}.`);

        for (let i = 0; i < this.layout.size; i++) {
            const arg = args[i]!;
            const format = this.layout.get(i)!;
            const stride = getVertexTypeSize(format);

            if (!checkFormat(format, arg))
                throw new Error(`Provided arguments "${arg.constructor.name}" (index ${i}) does not match the expected format "${format}".`);

            if (arg.length !== (stride / 4))
                throw new Error(`Unexpected stride size at location ${i}. Expected ${stride / 4} but got ${arg.length}.`);

            this.bytes?.set(arg, this.stride / 4);
            this.stride += stride;
        }
    }

    public set(location: number, ...args: ArrayLike<number>[]) {
        let offset = this.getStrideLocation(location);
        if (offset >= this.stride)
            throw new Error("Cannot set data at the end or beyond the buffer.");

        for (let i = 0; i < args.length; i++) {
            const arg = args[i]!;
            const format = this.layout.get(location + i)!;
            const stride = getVertexTypeSize(format);

            if (!checkFormat(format, arg))
                throw new Error(`Provided arguments "${arg.constructor.name}" (index ${i}) does not match the expected format "${format}".`);

            if (arg.length !== (stride / 4))
                throw new Error(`Unexpected stride size at location ${location + i}. Expected ${stride / 4} but got ${arg.length}.`);

            this.bytes?.set(arg, (offset / 4));
            offset += stride;
        }
    }

    protected link(_tri: [number, number, number]) {
        if (this.indexLayout !== IndexLayout.Custom)
            throw new Error("Cannot manually set index layout when it's not Custom.");
    }

    private getStrideLocation(location: number) {
        return this.formatStride * location;
    }

    protected getByteSize(format: GPUVertexFormat): number {
        return getVertexTypeSize(format);
    }

    // #region Utility functions
    public float32(location?: number | undefined) { this.addLayout(location, "float32"); }
    public sint32(location?: number | undefined) { this.addLayout(location, "sint32"); }
    public uint32(location?: number | undefined) { this.addLayout(location, "uint32"); }

    public float16x2(location?: number | undefined) { this.addLayout(location, "float16x2"); }
    public float32x2(location?: number | undefined) { this.addLayout(location, "float32x2"); }
    public sint16x2(location?: number | undefined) { this.addLayout(location, "sint16x2"); }
    public sint32x2(location?: number | undefined) { this.addLayout(location, "sint32x2"); }
    public uint16x2(location?: number | undefined) { this.addLayout(location, "uint16x2"); }
    public uint32x2(location?: number | undefined) { this.addLayout(location, "uint32x2"); }

    public float32x3(location?: number | undefined) { this.addLayout(location, "float32x3"); }
    public sint32x3(location?: number | undefined) { this.addLayout(location, "sint32x3"); }
    public uint32x3(location?: number | undefined) { this.addLayout(location, "uint32x3"); }

    public float16x4(location?: number | undefined) { this.addLayout(location, "float16x4"); }
    public float32x4(location?: number | undefined) { this.addLayout(location, "float32x4"); }
    public sint16x4(location?: number | undefined) { this.addLayout(location, "sint16x4"); }
    public sint32x4(location?: number | undefined) { this.addLayout(location, "sint32x4"); }
    public uint16x4(location?: number | undefined) { this.addLayout(location, "uint16x4"); }
    public uint32x4(location?: number | undefined) { this.addLayout(location, "uint32x4"); }
    // #endregion
}
