import { RendererInterface } from "../lib/Renderer/Renderer.interface";
import { createRenderer } from "../lib/Renderer";
import type { Ref } from "vue";

export function useRenderer(canvas: Ref<HTMLCanvasElement | null>) {
    const renderer = ref<RendererInterface | null>(null);

    onMounted(async () => {
        if (!canvas.value)
            return;

        try {
            renderer.value = await createRenderer(canvas.value);
        }
        catch (error) {
            console.log(error);
            renderer.value = null;
        }
    });

    return renderer;
}
