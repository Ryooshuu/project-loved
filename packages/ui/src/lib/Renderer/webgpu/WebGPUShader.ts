import { Shader } from "../Shader";

export class WebGPUShader extends Shader {
    public readonly module: GPUShaderModule;

    constructor(
        device: GPUDevice,
        source: string,
        vertexEntryPoint?: string,
        fragmentEntryPoint?: string
    ) {
        super(source, vertexEntryPoint, fragmentEntryPoint);

        this.module = device.createShaderModule({
            code: source
        });
    }
}
