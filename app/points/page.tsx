"use client";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import React from "react";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

const Page = () => {
  return (
    <div className="w-screen h-screen bg-[#181818] overflow-hidden">
      <Scene />
    </div>
  );
};
const Scene = () => {
  return (
    <Canvas className="w-full h-full">
      <OrbitControls />
      {/* <directionalLight color={'lime'} position={[0, 0, 0]} intensity={10.0}/> */}
      <Model />
      <EffectComposer>
        <Bloom
          intensity={1.0}
          luminanceThreshold={0.9}
          luminanceSmoothing={0.025}
          mipmapBlur={false}
        />
      </EffectComposer>
      {/* <mesh> */}
      {/*   <sphereGeometry args={[0.1]} /> */}
      {/*   <meshStandardMaterial */}
      {/*     color={"lime"} */}
      {/*     emissive={"orange"} */}
      {/*     emissiveIntensity={2.0} */}
      {/*   /> */}
      {/* </mesh> */}
    </Canvas>
  );
};
const Model = () => {
  const { nodes, materials } : {nodes: any, materials :any}= useGLTF("/dna.glb");

  const geometry = new THREE.BufferGeometry();
  const dna_geo = nodes.Mesh001.geometry;

  const NUM_POINTS = dna_geo.attributes.position.count;

  const vertices = new Float32Array(NUM_POINTS * 3);

  for (let index = 0; index < NUM_POINTS * 3; index++) {
    vertices[index] = Math.random() * 2.0 - 1.0;
  }

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3),
  );
  // Vertex Shader
  const vertexShader = `
 float pointSize = 50.0;
 float minSize = 1.0;
 float maxSize = 10.0;
 float scaleFactor = 1.0;

void main() {
    // Calculate the distance from the camera
    float distance = length((modelViewMatrix * vec4(position, 1.0)).xyz);
    
    // Adjust point size based on distance
    float adjustedSize = pointSize / (distance * scaleFactor);
    adjustedSize = clamp(adjustedSize, minSize, maxSize);

    gl_PointSize = adjustedSize;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
      `;

  // Fragment Shader
  const fragmentShader = `
precision mediump float;

void main() {
    // Calculate the distance from the center of the point
    float distance = length(gl_PointCoord - vec2(0.5));
    
    // Create a smooth radial gradient from the center to the edge
    float alpha = 1.0 - smoothstep(0.4, 0.5, distance);
    
    // Set the color, adjusting the alpha to create the glow effect
    gl_FragColor = vec4(0.8, 0.7, 0.2, alpha); // RGBA color with glow
}
      `;
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
  });
  console.log(dna_geo.attributes.position.count);

  const points = new THREE.Points(geometry, material);
  points.scale.set(0.1, 0.1, 0.1);
  const rand_range = (min: number, max: number) =>
    Math.random() * (max - min) + min;

  const positions = geometry.attributes.position.array;
  
  const dnaGeo = new THREE.SphereGeometry(4);//.attributes.positions.array;
  const dnaPositions = dnaGeo.attributes.position.array
   // Calculate min and max for x, y, and z
  const xPositions = [];
  const yPositions = [];
  const zPositions = [];

  for (let i = 0; i < dnaPositions.length; i += 3) {
    xPositions.push(dnaPositions[i]);
    yPositions.push(dnaPositions[i + 1]);
    zPositions.push(dnaPositions[i + 2]);
  }

  const xMin = Math.min(...xPositions);
  const xMax = Math.max(...xPositions);
  const yMin = Math.min(...yPositions);
  const yMax = Math.max(...yPositions);
  const zMin = Math.min(...zPositions);
  const zMax = Math.max(...zPositions);
  const delta = 0.01;
  useFrame(() => {
    for (let index = 0; index < positions.length; index += 3) {
      let dx = rand_range(-1, 1);
      let dy = rand_range(-1, 1);
      let dz = rand_range(-1, 1);
      if(positions[index + 0] + dx < xMax && positions[index + 0] + dx > xMin){
        positions[index + 0] += dx;
      }else { dx *= -1 }

      if(positions[index + 1] + dy < yMax && positions[index + 1] + dy > yMin){
        positions[index + 1] += dy;
      }else { dy *= -1 }
      if(positions[index + 2] + dz < zMax && positions[index + 2] + dz > zMin){
        positions[index + 2] += dz;
      }else { dz *= -1 }
    }
    geometry.attributes.position.needsUpdate = true;
  });
  // console.log(geometry.attributes.position.array);

  return <primitive object={points} />;
};

export default Page;
