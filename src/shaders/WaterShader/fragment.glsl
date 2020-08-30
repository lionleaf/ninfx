#define M_PI 3.1415926535897932384626433832795
#define WATER_REFLECTION -0.1428571306122
uniform float frame;
uniform vec3 viewDir;

varying vec2 vUv;
varying vec3 vNormal;
varying vec4 vWorldPos;




void main() {
	vec3 light = vec3(0.0, -0.3, 1.0);

    // ensure it's normalized
    light = normalize(light);

    // Schlick's approximation of fresnel reflectance
	float NdotL = max( 0.0, dot( vNormal, viewDir ) );
    float reflection =  WATER_REFLECTION + ( 1.0 - WATER_REFLECTION ) * pow( ( 1.0 - NdotL ), 5.0 );


    vec3 refraction = vec3(0.0, 0.1, 0.3);
    vec3 specular = vec3(0.53, 0.8, 0.92); // Reflect sky     * max(0.0, dot(vNormal, light)); 

    vec3 color = mix(refraction, specular, reflection);
    //vec3 color = vec3(1.0,0.0,0.0);
    // feed into our frag colour
    gl_FragColor = vec4(color,
                        1.0);  // A
}
