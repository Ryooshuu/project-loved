import { vec4 } from "gl-matrix";
import { Buffer, UniformBuffer, VertexBuffer } from "./buffers";
import { Shader } from "./Shader";

export enum IndexLayout {
    Linear,
    Quad,
    Custom
}

export interface RendererInterface {
    init(canvas: HTMLCanvasElement): Promise<void>

    begin(): void
    clear(color: vec4): void
    bindShader(shader: Shader): void
    bindVertexBuffer(buffer: VertexBuffer): void
    bindUniformBuffer(binding: number, buffer: UniformBuffer): void

    draw(vertexCount: number, instanceCount?: number, firstVertex?: number, firstInstance?: number): void
    drawIndexed(indexCount: number, instanceCount?: number, firstIndex?: number, baseVertex?: number, firstInstance?: number): void
    end(): void

    createShader(source: string, vertexEntryPoint?: string, fragmentEntryPoint?: string): Shader
    // createVertexBuffer(layout: IndexLayout): VertexBuffer
    // createUniformBuffer(): UniformBuffer

    createBuffer(type: "vertex", layout: IndexLayout): VertexBuffer
    createBuffer(type: "uniform"): UniformBuffer
    createBuffer(): Buffer
}
