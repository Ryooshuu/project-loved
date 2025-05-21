import { GPUUniformFormat, UniformBuffer } from "../buffers";

export class DummyUniformBuffer extends UniformBuffer {
    protected addLayoutImplementation(_format: GPUUniformFormat, _location: number, _stride: number) {}
}
