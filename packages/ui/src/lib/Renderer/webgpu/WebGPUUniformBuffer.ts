import { WebGPURenderer } from ".";
import { GPUUniformFormat, UniformBuffer } from "../buffers";

export class WebGPUUniformBuffer extends UniformBuffer {
    private webgpu: WebGPURenderer;
    private size: number;
    private buffer?: GPUBuffer;
    private isDirty: boolean = true;

    constructor(webgpu: WebGPURenderer) {
        super();

        this.webgpu = webgpu;
        this.size = 0;
    }

    public bind(location: number, value: ArrayLike<number>): void {
        super.bind(location, value);
        this.isDirty = true;
    }

    protected addLayoutImplementation(_format: GPUUniformFormat, _location: number, stride: number) {
        this.size += stride;
    }

    public udpate() {
        if (!this.isDirty)
            return this.buffer;

        if (this.buffer === undefined) {
            this.buffer = this.webgpu.device.createBuffer({
                size: this.size * 4,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            });
        }

        if (this.bytes === undefined)
            return this.buffer;

        this.webgpu.device.queue.writeBuffer(this.buffer, 0, this.bytes);
        this.isDirty = false;
        return this.buffer;
    }
}
