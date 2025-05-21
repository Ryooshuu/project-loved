import { WebGPURenderer } from ".";
import { Buffer } from "../buffers";

export class WebGPUStorageBuffer extends Buffer {
    private webgpu: WebGPURenderer;
    private isDirty: boolean = true;

    private buffer?: GPUBuffer;

    constructor(webgpu: WebGPURenderer) {
        super();

        this.webgpu = webgpu;
    }

    public setData(offset: number, data: ArrayLike<number>) {
        super.setData(offset, data);
        this.isDirty = true;
    }

    public update() {
        if (!this.isDirty)
            return this.buffer;

        if (this.buffer === undefined) {
            this.buffer = this.webgpu.device.createBuffer({
                size: this.size * 4,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
            });
        }

        if (this.bytes === undefined)
            return this.buffer;

        this.webgpu.device.queue.writeBuffer(this.buffer, 0, this.bytes);
        this.isDirty = false;
        return this.buffer;
    }
}
