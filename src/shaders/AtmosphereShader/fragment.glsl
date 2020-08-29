uniform float frame;
uniform sampler2D tDiffuse;
#define M_PI 3.1415926535897932384626433832795

varying vec2 vUv;

void main() {
	vec2 FOV = vec2(M_PI / 3.0, M_PI / 3.0 * (16.0/9.0)); // 60 degrees FOV
	vec3 sunDir = vec3(1,0,0);


    gl_FragColor = vec4(vUv,2.0,1.0);
}
