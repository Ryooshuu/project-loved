import { vec4 } from "gl-matrix";
import { IndexLayout, RendererInterface } from "../Renderer.interface";
import { WebGPUUniformBuffer } from "./WebGPUUniformBuffer";
import { WebGPUVertexBuffer } from "./WebGPUVertexBuffer";
import { WebGPUShader } from "./WebGPUShader";
import { Shader } from "../Shader";
import { Buffer, UniformBuffer, VertexBuffer } from "../buffers";
import { WebGPUStorageBuffer } from "./WebGPUStorageBuffer";

export class WebGPURenderer implements RendererInterface {
    public device!: GPUDevice;

    private context!: GPUCanvasContext;

    // state
    private currentShader?: WebGPUShader;
    private currentVertexBuffer?: WebGPUVertexBuffer;
    private currentBoundBuffers: Map<number, Buffer> = new Map();

    // internal state
    private currentRenderPipeline?: GPURenderPipeline;
    private currentBindGroup?: GPUBindGroup;

    async init(canvas: HTMLCanvasElement) {
        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter)
            throw new Error("No GPU adapter found.");

        this.device = await adapter.requestDevice();
        await this.configure(canvas);
    }

    private async configure(canvas: HTMLCanvasElement) {
        this.context = canvas.getContext("webgpu")!;

        this.context.configure({
            device: this.device,
            format: navigator.gpu.getPreferredCanvasFormat(),
            alphaMode: "premultiplied"
        });
    }

    private commands?: GPUCommandEncoder;
    private renderPass?: GPURenderPassEncoder;

    begin() {
        this.currentShader = undefined;

        this.commands = this.device.createCommandEncoder();
    }

    clear(color: vec4) {
        this.drawGuard(this.commands);

        const opacity = color[3];

        const clearColor: GPUColor = { r: color[0] * opacity, g: color[1] * opacity, b: color[2] * opacity, a: color[3] };
        const renderPassDescriptor: GPURenderPassDescriptor = {
            colorAttachments: [
                {
                    clearValue: clearColor,
                    loadOp: "clear",
                    storeOp: "store",
                    view: this.context.getCurrentTexture().createView()
                }
            ]
        };

        this.renderPass = this.commands.beginRenderPass(renderPassDescriptor);
    }

    bindShader(shader: Shader): void {
        this.drawGuard(this.commands);
        this.currentShader = shader as WebGPUShader;
    }

    bindVertexBuffer(buffer: VertexBuffer) {
        this.drawGuard(this.commands);
        this.currentVertexBuffer = buffer as WebGPUVertexBuffer;
    }

    bindBuffer(binding: number, buffer: Buffer): void {
        this.drawGuard(this.commands);
        this.currentBoundBuffers.set(binding, buffer);
    }

    draw(vertexCount: number, instanceCount?: number, firstVertex?: number, firstInstance?: number): void {
        this.preDraw();
        this.renderPass!.draw(vertexCount, instanceCount, firstVertex, firstInstance);
    }

    drawIndexed(indexCount: number, instanceCount?: number, firstIndex?: number, baseVertex?: number, firstInstance?: number): void {
        this.preDraw();
        this.renderPass!.drawIndexed(indexCount, instanceCount, firstIndex, baseVertex, firstInstance);
    }

    private preDraw() {
        this.drawGuard(this.commands);
        this.assertRenderPipeline();
        this.assertBindGroup();

        const vertexBuffers = this.currentVertexBuffer!.update();
        this.currentBoundBuffers.forEach((buffer) => {
            if (buffer instanceof WebGPUUniformBuffer)
                buffer.udpate();
            if (buffer instanceof WebGPUStorageBuffer)
                buffer.update();
        });

        this.renderPass!.setPipeline(this.currentRenderPipeline!);
        if (this.currentBindGroup)
            this.renderPass!.setBindGroup(0, this.currentBindGroup!);
        this.renderPass!.setVertexBuffer(0, vertexBuffers[0]);
        this.renderPass!.setIndexBuffer(vertexBuffers[1]!, "uint32");
    }

    end() {
        this.drawGuard(this.commands);

        this.renderPass?.end();
        this.device.queue.submit([this.commands.finish()]);
        this.commands = undefined;
    }

    private drawGuard(commands?: GPUCommandEncoder): asserts commands is GPUCommandEncoder {
        if (commands === undefined)
            throw new Error("Must call begin() before attempting to call this function.");
    }

    private assertRenderPipeline() {
        // todo : don't recreate pipeline if nothing changed

        if (this.currentShader === undefined)
            throw new Error("Shader must be bound before attempting to draw.");

        if (this.currentVertexBuffer === undefined)
            throw new Error("Vertex buffer must be bound before attempting to draw.");

        const pipelineDescriptor: GPURenderPipelineDescriptor = {
            vertex: {
                module: this.currentShader.module,
                entryPoint: this.currentShader.vertexEntryPoint,
                buffers: [
                    this.currentVertexBuffer.getVertexLayout()
                ]
            },
            fragment: {
                module: this.currentShader.module,
                entryPoint: this.currentShader.fragmentEntryPoint,
                targets: [
                    {
                        format: navigator.gpu.getPreferredCanvasFormat(),
                        blend: {
                            color: {
                                srcFactor: "one",
                                dstFactor: "one-minus-src-alpha"
                            },
                            alpha: {
                                srcFactor: "one",
                                dstFactor: "one-minus-src-alpha"
                            }
                        }
                    }
                ]
            },
            primitive: {
                topology: "triangle-list"
            },
            layout: "auto"
        };

        this.currentRenderPipeline = this.device.createRenderPipeline(pipelineDescriptor);
    }

    private assertBindGroup() {
        this.currentBindGroup = this.device.createBindGroup({
            layout: this.currentRenderPipeline!.getBindGroupLayout(0),
            entries: Array.from(
                this.currentBoundBuffers.entries()
            ).map(
                ([binding, buffer]) => {
                    let internalBuffer: GPUBuffer;

                    if (buffer instanceof WebGPUUniformBuffer)
                        internalBuffer = buffer.udpate()!;
                    else if (buffer instanceof WebGPUStorageBuffer)
                        internalBuffer = buffer.update()!;
                    else
                        throw new Error("Invalid buffer type.");

                    return {
                        binding: binding,
                        resource: { buffer: internalBuffer }
                    };
                }
            )
        });
    }

    createShader(source: string, vertexEntryPoint?: string, fragmentEntryPoint?: string) {
        return new WebGPUShader(this.device, source, vertexEntryPoint, fragmentEntryPoint);
    }

    createBuffer(type: "vertex", layout: IndexLayout): VertexBuffer;
    createBuffer(type: "uniform"): UniformBuffer;
    createBuffer(type: "storage"): Buffer;
    createBuffer(type: string, ...args: Array<unknown>): Buffer {
        if (type === "vertex")
            return new WebGPUVertexBuffer(this, args[0] as IndexLayout);
        else if (type === "uniform")
            return new WebGPUUniformBuffer(this);
        else if (type === "storage")
            return new WebGPUStorageBuffer(this);

        throw new Error(`Invalid buffer type "${type}".`);
    }
}
