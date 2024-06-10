"use client";
import { Loader, OrbitControls, useGLTF } from "@react-three/drei";
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
    <>
      <Loader />
      <Canvas className="w-full h-full" camera={{ position: [0, 0, -100] }}>
        <OrbitControls />
        <Model />
        <EffectComposer>
          <Bloom intensity={1.0} luminanceThreshold={0.9} luminanceSmoothing={0.025} mipmapBlur={false} />
        </EffectComposer>
      </Canvas>
    </>
  );
};
const Model = () => {
  const { nodes, materials }: { nodes: any; materials: any } = useGLTF("/models/dna.glb");

  const geometry = new THREE.BufferGeometry();
  const dna_geo = nodes.Mesh001.geometry;

  const NUM_POINTS = dna_geo.attributes.position.count;

  const vertices = new Float32Array(NUM_POINTS * 3);

  for (let index = 0; index < NUM_POINTS * 3; index++) {
    vertices[index] = Math.random() * 2.0 - 1.0;
  }

  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
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
  const rand_range = (min: number, max: number) => Math.random() * (max - min) + min;

  const dnaGeo = new THREE.SphereGeometry(4); //.attributes.positions.array;
  const dnaPositions = dnaGeo.attributes.position.array;
  // Calculate min and max for x, y, and z
  const xPositions = [];
  const yPositions = [];
  const zPositions = [];

  for (let i = 0; i < dnaPositions.length; i += 3) {
    xPositions.push(dnaPositions[i]);
    yPositions.push(dnaPositions[i + 1]);
    zPositions.push(dnaPositions[i + 2]);
  }
  const src = geometry.attributes.position.array;
  const dst = dna_geo.attributes.position.array;
  const init_pos = () => {
    for (let i = 0; i < src.length; i += 3 * 3) {
      // For each vertex, find the corresponding range in dna_geo
      const xMin = Math.min(dst[i + 0], dst[i + 3]);
      const xMax = Math.max(dst[i + 0], dst[i + 3]);
      const yMin = Math.min(dst[i + 1], dst[i + 4]);
      const yMax = Math.max(dst[i + 1], dst[i + 4]);
      const zMin = Math.min(dst[i + 2], dst[i + 5]);
      const zMax = Math.max(dst[i + 2], dst[i + 5]);

      src[i + 0] = rand_range(xMin, xMax);
      src[i + 1] = rand_range(yMin, yMax);
      src[i + 2] = rand_range(zMin, zMax);
    }
    geometry.attributes.position.needsUpdate = true;
  };
  init_pos();

  useFrame((_state, delta) => {
    for (let i = 0; i < src.length; i += 3 * 3) {
      src[i + 0] += Math.random() * delta;
      src[i + 1] += Math.random() * delta;
      src[i + 2] += Math.random() * delta;
    }
    geometry.attributes.position.needsUpdate = true;
  });
  // console.log(geometry.attributes.position.array);

  return <primitive object={points} />;
};

export default Page;
