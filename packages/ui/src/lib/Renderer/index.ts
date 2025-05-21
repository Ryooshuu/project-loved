import { RendererInterface } from "./Renderer.interface";
import { DummyRenderer } from "./dummy";
import { WebGPURenderer } from "./webgpu";

export async function createRenderer(canvas: HTMLCanvasElement) {
    let renderer: RendererInterface;

    if (navigator.gpu === undefined) {
        console.error("WebGPU is not supported.");
        renderer = new DummyRenderer();
    }
    else {
        renderer = new WebGPURenderer();
    }

    await renderer.init(canvas);
    return renderer;
}
