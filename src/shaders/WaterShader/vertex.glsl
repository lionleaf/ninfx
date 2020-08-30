uniform float frame;

uniform vec3 nearLeft;
uniform vec3 nearRight;
uniform vec3 farLeft;
uniform vec3 farRight;

varying vec2 vUv;
varying vec3 vNormal;
varying vec4 vWorldPos;


void main() {
    vUv = uv;
    vec3 nearInterpolated = mix(nearLeft, nearRight, uv.x);
    vec3 farInterpolated = mix(farLeft, farRight, uv.x);
    vec4 interpolatedPos = vec4(mix(nearInterpolated, farInterpolated, uv.y), 1.0);

    vec4 worldPos = projectionMatrix * modelViewMatrix * interpolatedPos;
    worldPos.y += 5.0*sin(worldPos.x/80.0+frame/30.0);
    vNormal = normalize(vec3(1.0, cos(worldPos.y/80.0+frame/30.0), 0.0));
    vWorldPos = worldPos;
    gl_Position =  worldPos;
}
