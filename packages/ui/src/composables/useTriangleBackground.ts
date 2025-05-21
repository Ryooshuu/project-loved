import { useRenderer } from "./useRenderer";
import { useRafFn, watchOnce } from "@vueuse/core";
import { Ref } from "vue";
import shaderCode from "../shaders/TestShader.wgsl?raw";
import { IndexLayout } from "../lib/Renderer/Renderer.interface";
import { mat4 } from "gl-matrix";
import { Shader } from "../lib/Renderer/Shader";
import { UniformBuffer, VertexBuffer } from "../lib/Renderer/buffers";

export function useTriangleBackground(canvas: Ref<HTMLCanvasElement | null>) {
    const rendererRef = useRenderer(canvas);

    let shader: Shader | null = null;
    let vertexBuffer: VertexBuffer | null = null;
    let uniformBuffer1: UniformBuffer | null = null;
    let uniformBuffer2: UniformBuffer | null = null;

    watchOnce(rendererRef, async () => {
        if (rendererRef.value === null)
            return;

        const renderer = rendererRef.value;
        shader = renderer.createShader(shaderCode);

        vertexBuffer = renderer.createVertexBuffer(IndexLayout.Quad);
        vertexBuffer.float32x4();
        vertexBuffer.float32x4();
        vertexBuffer.lockLayout(4);

        vertexBuffer.add([0, 1, 0.0, 1.0], [1.0, 0.0, 0.0, 1.0]);
        vertexBuffer.add([1, 1, 0.0, 1.0], [1.0, 0.0, 1.0, 1.0]);
        vertexBuffer.add([0, 0, 0.0, 1.0], [0.0, 1.0, 0.0, 1.0]);
        vertexBuffer.add([1, 0, 0.0, 1.0], [0.0, 0.0, 1.0, 1.0]);

        uniformBuffer1 = renderer.createUniformBuffer();
        uniformBuffer1.mat4x4();
        uniformBuffer1.mat4x4();
        uniformBuffer1.lockLayout();

        uniformBuffer2 = renderer.createUniformBuffer();
        uniformBuffer2.mat4x4();
        uniformBuffer2.mat4x4();
        uniformBuffer2.lockLayout();

        const view = mat4.create();
        const model = mat4.create();
        uniformBuffer1.bind(0, view);
        uniformBuffer1.bind(1, model);
        uniformBuffer2.bind(0, view);
        uniformBuffer2.bind(1, model);
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

        if (canvas.value!.width !== canvas.value!.clientWidth)
            canvas.value!.width = canvas.value!.clientWidth;
        if (canvas.value!.height !== canvas.value!.clientHeight)
            canvas.value!.height = canvas.value!.clientHeight;

        const renderer = rendererRef.value;

        const view = mat4.create();
        mat4.orthoZO(view, 0, canvas.value!.clientWidth, 0, canvas.value!.clientHeight, 0, 1);
        uniformBuffer1!.bind(0, view);
        uniformBuffer2!.bind(0, view);

        const model = mat4.create();
        mat4.identity(model);
        mat4.translate(model, model, [canvas.value!.clientWidth / 2 - 100, canvas.value!.clientHeight / 2 - 100, 0]);
        mat4.scale(model, model, [200, 200, 1]);
        uniformBuffer1!.bind(1, model);

        renderer.begin();
        renderer.clear([0.25, 0.5, 1, 0.0]);
        renderer.bindShader(shader!);
        renderer.bindVertexBuffer(vertexBuffer!);
        renderer.bindUniformBuffer(0, uniformBuffer1!);
        renderer.drawIndexed(6);

        mat4.identity(model);
        mat4.translate(model, model, [canvas.value!.clientWidth / 2 - 100, canvas.value!.clientHeight / 2 - 100, 0]);
        mat4.translate(model, model, [50, 0, 0]);
        mat4.scale(model, model, [200, 200, 1]);
        uniformBuffer2!.bind(1, model);
        renderer.bindUniformBuffer(0, uniformBuffer2!);
        renderer.drawIndexed(6);

        renderer.end();
    });
}
