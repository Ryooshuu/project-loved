import { vec4 } from "gl-matrix";
import { IndexLayout, RendererInterface } from "../Renderer.interface";
import { WebGPUUniformBuffer } from "./WebGPUUniformBuffer";
import { WebGPUVertexBuffer } from "./WebGPUVertexBuffer";
import { WebGPUShader } from "./WebGPUShader";
import { Shader } from "../Shader";
import { UniformBuffer, VertexBuffer } from "../buffers";

export class WebGPURenderer implements RendererInterface {
    public device!: GPUDevice;

    private context!: GPUCanvasContext;

    // state
    private currentShader?: WebGPUShader;
    private currentVertexBuffer?: WebGPUVertexBuffer;
    private currentUniformBuffer?: { binding: number, buffer: WebGPUUniformBuffer };

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

    bindUniformBuffer(binding: number, buffer: UniformBuffer): void {
        this.drawGuard(this.commands);
        this.currentUniformBuffer = { binding, buffer: buffer as WebGPUUniformBuffer };
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
        this.currentUniformBuffer?.buffer.udpate();

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
        // if (this.currentRenderPipeline !== undefined)
        //     return;

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
        // if (this.currentBindGroup !== undefined)
        //     return;

        if (this.currentUniformBuffer === undefined)
            return;

        this.currentBindGroup = this.device.createBindGroup({
            layout: this.currentRenderPipeline!.getBindGroupLayout(0),
            entries: [
                { binding: 0, resource: { buffer: this.currentUniformBuffer!.buffer.udpate()! } }
            ]
        });
    }

    createVertexBuffer(layout: IndexLayout) {
        return new WebGPUVertexBuffer(this, layout);
    }

    createUniformBuffer() {
        return new WebGPUUniformBuffer(this);
    }

    createShader(source: string, vertexEntryPoint?: string, fragmentEntryPoint?: string) {
        return new WebGPUShader(this.device, source, vertexEntryPoint, fragmentEntryPoint);
    }
}
