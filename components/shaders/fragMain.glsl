
    vec2 repeatedUv = mod(vUv * 2.0, 1.0); 
    float angle = -0.2; // Adjust this value to change the angle of the separation
    vec4 textureColor = (vPosition.x + angle * vPosition.y < 0.0) ? texture2D(u_white, repeatedUv) : texture2D(u_black, repeatedUv);

    vec4 diffuseColor = textureColor;
