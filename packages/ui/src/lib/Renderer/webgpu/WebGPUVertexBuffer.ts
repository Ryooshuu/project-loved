import { WebGPURenderer } from ".";
import { VertexBuffer } from "../buffers";
import { IndexLayout } from "../Renderer.interface";

export class WebGPUVertexBuffer extends VertexBuffer {
    private webgpu: WebGPURenderer;
    private indices: Array<number>;
    private attributes: Array<GPUVertexAttribute>;
    private arrayStride: number;

    private buffer?: GPUBuffer;
    private indexBuffer?: GPUBuffer;

    private isDirty: boolean = true;

    constructor(webgpu: WebGPURenderer, layout: IndexLayout) {
        super(layout);

        this.webgpu = webgpu;
        this.attributes = [];
        this.arrayStride = 0;
        this.indices = [];
    }

    public add(...args: ArrayLike<number>[]) {
        super.add(...args);
        this.isDirty = true;
    }

    public set(location: number, ...args: ArrayLike<number>[]) {
        super.set(location, ...args);
        this.isDirty = true;
    }

    protected link(tri: [number, number, number]): void {
        super.link(tri);
        this.indices.push(...tri);
    }

    public lockLayout(elements: number): void {
        super.lockLayout(elements);

        switch (this.indexLayout) {
            case IndexLayout.Linear:
                this.indices = new Array(this.elements);
                for (let i = 0; i < this.elements; i++) {
                    this.indices[i] = i;
                }
                break;

            case IndexLayout.Quad:
                this.indices = new Array(3 * this.elements / 2);

                for (let i = 0, j = 0; j < 3 * this.elements / 2; i += 4, j += 6) {
                    this.indices[j + 0] = i + 0;
                    this.indices[j + 1] = i + 1;
                    this.indices[j + 2] = i + 3;
                    this.indices[j + 3] = i + 0;
                    this.indices[j + 4] = i + 2;
                    this.indices[j + 5] = i + 3;
                }
                break;

            default:
                break;
        }
    }

    protected addLayoutImplementation(format: GPUVertexFormat, location: number, stride: number) {
        this.attributes.push({
            shaderLocation: location,
            offset: this.arrayStride,
            format: format
        });

        this.arrayStride += stride;
    }

    public getVertexLayout(): GPUVertexBufferLayout {
        return {
            attributes: this.attributes,
            arrayStride: this.arrayStride,
            stepMode: "vertex"
        };
    }

    private indicesArray?: Uint32Array;

    public update() {
        if (!this.isDirty)
            return [this.buffer, this.indexBuffer];

        if (this.buffer === undefined) {
            this.buffer = this.webgpu.device.createBuffer({
                size: this.arrayStride * this.elements,
                usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
            });
        }

        if (this.indexBuffer === undefined) {
            this.indicesArray = new Uint32Array(this.indices);
            this.indexBuffer = this.webgpu.device.createBuffer({
                size: this.indicesArray.byteLength,
                usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST
            });

            this.webgpu.device.queue.writeBuffer(this.indexBuffer, 0, this.indicesArray);
        }

        if (this.bytes === undefined)
            return [this.buffer, this.indexBuffer];

        this.webgpu.device.queue.writeBuffer(this.buffer, 0, this.bytes);
        this.isDirty = false;
        return [this.buffer, this.indexBuffer];
    }
}
