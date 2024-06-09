
varying vec3 vNormal;
varying vec4 vPosition;
varying vec2 vUv;

void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vUv = uv;
    gl_Position = vPosition;
}
