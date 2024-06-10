
vec2 repeatedUv = mod(vUv * 2.5, 1.0); 
float angle = -0.2; 
vec4 textureColor;
if(isMobile) {
    textureColor = (vPosition.y + angle * vPosition.x < 0.0) ? texture2D(u_white, repeatedUv) : texture2D(u_black, repeatedUv);
}else{
    textureColor = (vPosition.x + angle * vPosition.y < 0.0) ? texture2D(u_black, repeatedUv) : texture2D(u_white, repeatedUv);
}

vec4 diffuseColor = textureColor;
