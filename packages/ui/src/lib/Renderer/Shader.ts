export abstract class Shader {
    public readonly vertexEntryPoint: string;
    public readonly fragmentEntryPoint: string;

    constructor(
        public readonly source: string,
        vertexEntryPoint?: string,
        fragmentEntryPoint?: string
    ) {
        this.vertexEntryPoint = vertexEntryPoint ?? "vertex_main";
        this.fragmentEntryPoint = fragmentEntryPoint ?? "fragment_main";
    }
}
