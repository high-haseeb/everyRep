// fragmentShader.glsl
uniform sampler2D u_black;
uniform sampler2D u_white;
varying vec2 vUv;
varying vec4 vPosition;

void main() {
    vec3 light = vec3(0.5, 0.2, 1.0);
    light = normalize(light);

    // Determine which texture to use based on x position in clip space
    vec4 textureColor = (vPosition.x < 0.0) ? texture2D(u_white, vUv) : texture2D(u_black, vUv);

    // Basic lambertian diffuse shading
    float intensity = max(dot(normalize(vec3(0.0, 0.0, 1.0)), light), 0.0);

    gl_FragColor = vec4(textureColor.rgb * intensity, textureColor.a);
}

