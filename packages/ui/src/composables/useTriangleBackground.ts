import { useRenderer } from "./useRenderer";
import { useRafFn, watchOnce } from "@vueuse/core";
import { Ref } from "vue";
import shaderCode from "../shaders/TestShader.wgsl?raw";
import { IndexLayout } from "../lib/Renderer/Renderer.interface";
import { mat4, vec4 } from "gl-matrix";
import { Shader } from "../lib/Renderer/Shader";
import { UniformBuffer, VertexBuffer } from "../lib/Renderer/buffers";
import { WebGPUStorageBuffer } from "../lib/Renderer/webgpu/WebGPUStorageBuffer";

export function useTriangleBackground(canvas: Ref<HTMLCanvasElement | null>) {
    const rendererRef = useRenderer(canvas);

    let shader: Shader | null = null;
    let vertexBuffer: VertexBuffer | null = null;
    let uniformBuffer: UniformBuffer | null = null;
    let storageBuffer: WebGPUStorageBuffer | null = null;

    const instanceData: Array<{ position: vec4, size: vec4, velocity: number }> = [];

    const minSize = 100;
    const maxSize = 400;
    const instanceAmount = 40;

    watchOnce(rendererRef, async () => {
        if (rendererRef.value === null)
            return;

        const renderer = rendererRef.value;
        shader = renderer.createShader(shaderCode);

        vertexBuffer = renderer.createBuffer("vertex", IndexLayout.Quad);
        vertexBuffer.float32x4();
        vertexBuffer.float32x4();
        vertexBuffer.lockLayout(4);

        vertexBuffer.add([0, 1, 0.0, 1.0], [1.0, 0.0, 0.0, 1.0]);
        vertexBuffer.add([1, 1, 0.0, 1.0], [1.0, 0.0, 1.0, 1.0]);
        vertexBuffer.add([0, 0, 0.0, 1.0], [0.0, 1.0, 0.0, 1.0]);
        vertexBuffer.add([1, 0, 0.0, 1.0], [0.0, 0.0, 1.0, 1.0]);

        uniformBuffer = renderer.createBuffer("uniform");
        uniformBuffer.mat4x4();
        uniformBuffer.mat4x4();
        uniformBuffer.vec2();
        uniformBuffer.vec2();
        uniformBuffer.lockLayout();

        const instanceDataSize
            = 4 * 4 // position
              + 2 * 4; // size

        storageBuffer = renderer.createBuffer("storage") as WebGPUStorageBuffer; // todo : fix this
        storageBuffer.lock(instanceDataSize * instanceAmount);

        for (let i = 0; i < instanceAmount; i++) {
            const size = Math.random() * (maxSize - minSize) + minSize;

            instanceData.push({
                position: vec4.fromValues(Math.random() * canvas.value!.clientWidth - size / 2, Math.random() * canvas.value!.clientHeight - size / 2, 0, 1),
                size: vec4.fromValues(size, size, 1, 1),
                velocity: Math.random() * 20
            });
        }

        storageBuffer.setData(0, instanceData.flatMap(({ position, size }) => [
            ...position,
            ...size
        ]));
    });

    let fps = 0;
    let elapsed = 0;

    useRafFn(async (time) => {
        if (rendererRef.value === null)
            return;

        if (elapsed > 1) {
            console.log(`FPS: ${fps}`);
            elapsed = 0;
            fps = 0;
        }
        else {
            fps++;
            elapsed += time.delta / 1000;
        }

        for (const instance of instanceData) {
            vec4.add(instance.position, instance.position, [0, instance.velocity * time.delta / 1000, 0, 0]);

            if (instance.position[1] > canvas.value!.clientHeight + instance.size[1] / 2) {
                const size = Math.random() * (maxSize - minSize) + minSize;
                instance.position[1] = -instance.size[1];
                instance.position[0] = Math.random() * canvas.value!.clientWidth - size / 2;

                instance.velocity = Math.random() * 100;

                instance.size[0] = size;
                instance.size[1] = size;
            }
        }

        storageBuffer!.setData(0, instanceData.flatMap(({ position, size }) => [
            ...position,
            ...size
        ]));

        if (canvas.value!.width !== canvas.value!.clientWidth)
            canvas.value!.width = canvas.value!.clientWidth;
        if (canvas.value!.height !== canvas.value!.clientHeight)
            canvas.value!.height = canvas.value!.clientHeight;

        const renderer = rendererRef.value;

        const view = mat4.create();
        mat4.orthoZO(view, 0, canvas.value!.clientWidth, 0, canvas.value!.clientHeight, 0, 1);
        uniformBuffer!.bind(0, view);

        const model = mat4.create();
        mat4.identity(model);
        uniformBuffer!.bind(1, model);
        uniformBuffer!.bind(2, [200, 200]);

        renderer.begin();
        renderer.clear([0.25, 0.5, 1, 0.0]);
        renderer.bindShader(shader!);
        renderer.bindVertexBuffer(vertexBuffer!);
        renderer.bindBuffer(0, uniformBuffer!);
        renderer.bindBuffer(1, storageBuffer!);
        renderer.drawIndexed(6, instanceAmount);

        renderer.end();
    });
}
