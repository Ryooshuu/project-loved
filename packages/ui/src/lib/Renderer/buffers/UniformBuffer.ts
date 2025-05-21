import { GPUUniformFormat } from ".";
import { Lock } from "../../Lock";
import { getUniformTypeSize } from "../utils";
import { LayoutBuffer } from "./LayoutBuffer";

export abstract class UniformBuffer extends LayoutBuffer<GPUUniformFormat> {
    public lockLayout(): void {
        super.lockLayout();
    }

    public bind(location: number, value: ArrayLike<number>) {
        if (!Lock.isEntered(this))
            throw new Error("Cannot bind uniform buffer before it's layout has been locked.");

        if (!this.layout.has(location))
            throw new Error("Cannot bind uniform buffer to an invalid location.");

        const format = this.layout.get(location)!;
        const size = getUniformTypeSize(format);

        if (value.length !== size)
            throw new Error(`Cannot bind value with differing size. Expected ${size}, got ${value.length}.`);

        const offset = this.getStrideLocation(location);
        this.bytes?.set(value, offset);
    }

    protected getByteSize(format: GPUUniformFormat): number {
        return getUniformTypeSize(format);
    }

    private getStrideLocation(location: number) {
        let accumilatingStride = 0;
        let currentLocation = 0;

        while (currentLocation !== location) {
            if (!this.layout.has(currentLocation)) {
                currentLocation++;
                continue;
            }

            const size = getUniformTypeSize(this.layout.get(currentLocation)!);
            accumilatingStride += size;
            currentLocation++;
        }

        return accumilatingStride;
    }

    // #region Utility functions
    public bool(location?: number | undefined) { this.addLayout(location, "bool"); }

    public f16(location?: number | undefined) { this.addLayout(location, "f16"); }
    public f32(location?: number | undefined) { this.addLayout(location, "f32"); }
    public i32(location?: number | undefined) { this.addLayout(location, "i32"); }

    public vec2(location?: number | undefined) { this.addLayout(location, "vec2"); }
    public vec3(location?: number | undefined) { this.addLayout(location, "vec3"); }
    public vec4(location?: number | undefined) { this.addLayout(location, "vec4"); }

    public mat2x2(location?: number | undefined) { this.addLayout(location, "mat2x2"); }
    public mat2x3(location?: number | undefined) { this.addLayout(location, "mat2x3"); }
    public mat2x4(location?: number | undefined) { this.addLayout(location, "mat2x4"); }
    public mat3x2(location?: number | undefined) { this.addLayout(location, "mat3x2"); }
    public mat3x3(location?: number | undefined) { this.addLayout(location, "mat3x3"); }
    public mat3x4(location?: number | undefined) { this.addLayout(location, "mat3x4"); }
    public mat4x2(location?: number | undefined) { this.addLayout(location, "mat4x2"); }
    public mat4x3(location?: number | undefined) { this.addLayout(location, "mat4x3"); }
    public mat4x4(location?: number | undefined) { this.addLayout(location, "mat4x4"); }
    // #endregion
}
