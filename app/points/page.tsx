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
  const { nodes, materials } = useGLTF("/dna.glb");

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
  useFrame(() => {
    // console.log(rand_range(-10, 10))
 const positions = geometry.attributes.position.array;
  const dnaPositions = dna_geo.attributes.position.array;

  for (let index = 0; index < positions.length; index += 3) {
    // For each vertex, find the corresponding range in dna_geo

    const xMin = Math.min(dnaPositions[index], dnaPositions[index + 3 % dnaPositions.length]);
    const xMax = Math.max(dnaPositions[index], dnaPositions[index + 3 % dnaPositions.length]);
    const yMin = Math.min(dnaPositions[index + 1], dnaPositions[index + 4 % dnaPositions.length]);
    const yMax = Math.max(dnaPositions[index + 1], dnaPositions[index + 4 % dnaPositions.length]);
    const zMin = Math.min(dnaPositions[index + 2], dnaPositions[index + 5 % dnaPositions.length]);
    const zMax = Math.max(dnaPositions[index + 2], dnaPositions[index + 5 % dnaPositions.length]);

    // Assign new positions within the ranges
    positions[index] = rand_range(xMin, xMax);
    positions[index + 1] = rand_range(yMin, yMax);
    positions[index + 2] = rand_range(zMin, zMax);
  }
    geometry.attributes.position.needsUpdate = true;
  });
  // console.log(geometry.attributes.position.array);

  return <primitive object={points} />;
};

export default Page;
