import { vec4 } from "gl-matrix";
import { IndexLayout, RendererInterface } from "../Renderer.interface";
import { Buffer, UniformBuffer, VertexBuffer } from "../buffers";
import { DummyVertexBuffer } from "./DummyVertexBuffer";
import { DummyUniformBuffer } from "./DummyUniformBuffer";
import { Shader } from "../Shader";
import { DummyShader } from "./DummyShader";

export class DummyRenderer implements RendererInterface {
    async init(_canvas: HTMLCanvasElement) {}

    begin() {}
    clear(_color: vec4) {}
    bindShader(_: Shader) {}
    bindVertexBuffer(_buffer: VertexBuffer) {}
    bindUniformBuffer(_binding: number, _buffer: UniformBuffer) {}
    draw(_vertexCount: number, _instanceCount?: number, _firstVertex?: number, _firstInstance?: number) {}
    drawIndexed(_indexCount: number, _instanceCount?: number, _firstIndex?: number, _baseVertex?: number, _firstInstance?: number): void {}
    end() {}

    // createVertexBuffer(layout: IndexLayout): VertexBuffer {
    //     return new DummyVertexBuffer(layout);
    // }

    // createUniformBuffer(): UniformBuffer {
    //     return new DummyUniformBuffer();
    // }

    createShader(source: string, vertexEntryPoint?: string, fragmentEntryPoint?: string) {
        return new DummyShader(source, vertexEntryPoint, fragmentEntryPoint);
    }

    createBuffer(type: "vertex", layout: IndexLayout): VertexBuffer;
    createBuffer(type: "uniform"): UniformBuffer;
    createBuffer(): Buffer;
    createBuffer(type?: string, ...args: Array<unknown>): Buffer {
        if (type === "vertex")
            return new DummyVertexBuffer(args[0] as IndexLayout);
        else if (type === "uniform")
            return new DummyUniformBuffer();
        else
            return new DummyBuffer();
    }
}
