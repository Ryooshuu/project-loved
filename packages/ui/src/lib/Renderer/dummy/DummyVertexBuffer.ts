import { VertexBuffer } from "../buffers";

export class DummyVertexBuffer extends VertexBuffer {
    protected addLayoutImplementation(_format: GPUVertexFormat, _location: number, _stride: number) {}
}
