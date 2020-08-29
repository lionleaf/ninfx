uniform float frame;

varying vec2 vUv;
varying vec3 vNormal;
varying vec4 vWorldPos;


void main() {
    vUv = uv;
    vec4 worldPos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    worldPos.y += 50.0*sin(worldPos.x/80.0+frame/30.0);
    vNormal = normalize(vec3(1.0, cos(worldPos.x/80.0+frame/30.0), 0.0));
    vWorldPos = worldPos;
    gl_Position =  worldPos;
}
