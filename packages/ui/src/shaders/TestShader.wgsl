struct Uniforms {
    view: mat4x4f,
    model: mat4x4f,
}

@group(0) @binding(0) var<uniform> uni: Uniforms;

struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(0) uv: vec2f,
    @location(1) color: vec4f
}

@vertex
fn vertex_main(
    @location(0) position: vec4f,
    @location(1) color: vec4f,
) -> VertexOutput {
    var output: VertexOutput;
    output.position = uni.view * uni.model * position;
    output.uv = position.xy;
    output.color = color;
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

    var uv = fragData.uv.xy * 2 - 1;
    var p = uv * 1.1;
    var d = sdEquilateralTriangle(p + vec2f(0, .2));
    var col = 1.0 - smoothstep(0.005, 0.015, abs(d));
    if (sign(d) < .0 && col < innerOpacity) {
        col = innerOpacity;
    }
    if (col < 0.01) {
        discard;
    }

    let opacity = (uv.y * 0.5 + 0.3) * overallOpacity;
    return vec4f(vec3f(col * opacity), col * opacity);
}
