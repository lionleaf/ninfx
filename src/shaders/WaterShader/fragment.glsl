#define M_PI 3.1415926535897932384626433832795
#define WATER_REFLECTION -0.1428571306122
uniform float frame;

varying vec2 vUv;
varying vec3 vNormal;
varying vec4 vWorldPos;




void main() {
	vec3 light = vec3(1.0, 1.0, -1.0);

    // ensure it's normalized
    light = normalize(light);

	float NdotL = max( 0.0, dot( vNormal, light ) );

    float reflection =  WATER_REFLECTION + ( 1.0 - WATER_REFLECTION ) * pow( ( 1.0 - NdotL ), 5.0 );


    vec3 refraction = vec3(0.0, 0.1, 0.3);
    vec3 specular = vec3(1.0, 1.0, 1.0) * max(0.0, dot(vNormal, light)); 

    vec3 color = mix(refraction, specular, reflection);
    //vec3 color = vec3(1.0,0.0,0.0);
    // feed into our frag colour
    gl_FragColor = vec4(color,
                        1.0);  // A
}
