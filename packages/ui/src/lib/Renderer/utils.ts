import { GPUUniformFormat } from "./buffers";

export function getVertexTypeSize(format: GPUVertexFormat) {
    const bitsArray = [];
    let multiplier = 1;

    // handles cases like "unorm10-10-10-2"
    if (format.includes("-")) {
        const split = format.split("-");
        bitsArray.push(Number(split[0]?.slice(split[0].split(/\d/)[0]?.length)));
        split.shift();

        while (split.length > 0) {
            bitsArray.push(Number(split.shift()));
        }
    }
    else {
        const split = format.split("x");
        bitsArray.push(Number(split[0]?.slice(split[0].split(/\d/)[0]?.length)));
        split.shift();
        multiplier = Number(split.shift());
    }

    const bits = bitsArray.reduce((p, c) => p + c);
    return (bits * multiplier) / 8;
}

export function getUniformTypeSize(format: GPUUniformFormat) {
    switch (format) {
        case "bool":
        case "f16":
        case "f32":
        case "i32":
            return 1;
        case "vec2": return 2;
        case "vec3": return 3;
        case "vec4": return 4;
        case "mat2x2": return 2 * 2;
        case "mat2x3": return 2 * 3;
        case "mat2x4": return 2 * 4;
        case "mat3x2": return 3 * 2;
        case "mat3x3": return 3 * 3;
        case "mat3x4": return 3 * 4;
        case "mat4x2": return 4 * 2;
        case "mat4x3": return 4 * 3;
        case "mat4x4": return 4 * 4;
    }
}

export function checkFormat(format: GPUVertexFormat, obj: unknown) {
    switch (format) {
        case "float16":
        case "float32":
        case "sint16":
        case "sint32":
        case "uint16":
        case "uint32":
            return checkVector(obj, 1);
        case "float16x2":
        case "float32x2":
        case "sint16x2":
        case "sint32x2":
        case "uint16x2":
        case "uint32x2":
            return checkVector(obj, 2);
        case "float32x3":
        case "sint32x3":
        case "uint32x3":
            return checkVector(obj, 3);
        case "float16x4":
        case "float32x4":
        case "sint16x4":
        case "sint32x4":
        case "uint16x4":
        case "uint32x4":
            return checkVector(obj, 4);
    }

    return false;

    function checkVector(obj: unknown, length: number) {
        return (
            (typeof obj === "object"
              && obj instanceof Float32Array
              && obj.length === length)
            || (typeof obj === "object"
              && obj instanceof Array
              && obj.length === length
            )
        );
    }
}
