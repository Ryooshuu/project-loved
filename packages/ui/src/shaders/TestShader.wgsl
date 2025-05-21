struct Uniforms {
    view: mat4x4f,
    model: mat4x4f
}

struct Instance {
    position: vec4f,
    size: vec2f
}

@group(0) @binding(0) var<uniform> uni: Uniforms;
@group(0) @binding(1) var<storage, read> instances: array<Instance>;

struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(0) uv: vec2f,
    @location(1) color: vec4f,
    @location(2) size: vec2f
}

fn translateMatrix(v: vec4f) -> mat4x4f {
    return transpose(mat4x4f(
        1.0, 0.0, 0.0, v.x,
        0.0, 1.0, 0.0, v.y,
        0.0, 0.0, 1.0, v.z,
        0.0, 0.0, 0.0, 1.0
    ));
}

fn scaleMatrix(v: vec2f) -> mat4x4f {
    return transpose(mat4x4f(
        v.x, 0.0, 0.0, 0.0,
        0.0, v.y, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    ));
}

@vertex
fn vertex_main(
    @builtin(instance_index) instanceIndex: u32,
    @location(0) position: vec4f,
    @location(1) color: vec4f,
) -> VertexOutput {
    var output: VertexOutput;
    output.uv = position.xy;
    output.color = color;

    let instance = instances[instanceIndex];
    let translate = translateMatrix(instance.position);
    let origin = translateMatrix(vec4f(-vec2f(instance.size / 2), 0.0, 1.0));
    let scale = scaleMatrix(instance.size);
    output.position = uni.view * origin * translate * scale * position;  
    output.size = instance.size;

    return output;
}

fn sdEquilateralTriangle(p: vec2f) -> f32 {
    let k = sqrt(3.);
    var q: vec2f = vec2f(abs(p.x) - 1.0, p.y + 1. / k);
    if (q.x + k * q.y > 0.) {
        q = vec2f(q.x - k * q.y, -k * q.x - q.y) / 2.;
    }
    q.x = q.x - clamp(q.x, -2., 0.);
    return -length(q) * sign(q.y);
}

@fragment
fn fragment_main(
    fragData: VertexOutput
) -> @location(0) vec4f {
    const innerOpacity: f32 = .15;
    const overallOpacity: f32 = .2;
    const smoothing: f32 = 30;

    var uv = fragData.uv - vec2f(0.5, 0.5);
    var d = sdEquilateralTriangle(uv * 2.0 + vec2f(0, .5)); 

    var p1 = 1.0 / fragData.size.x;
    var p2 = 3.0 / fragData.size.x;

    var col = 1.0 - smoothstep(p1, p2, abs(d));
    if (sign(d) < .0 && col < innerOpacity) {
        col = innerOpacity;
    }
    if (col < 0.01) {
        discard;
    }

    let opacity = (uv.y * 0.5 + 0.3) * overallOpacity;
    return vec4f(vec3f(col * opacity), col * opacity);
}
