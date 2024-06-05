"use client";
import {
  Environment,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Intro } from "./Logo";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useStateStore } from "@/stores/state";

const Scene = () => {
  const introDone = useStateStore((state) => state.introDone);
  useEffect(() => {
    console.log(introDone);
  }, [introDone]);
  return (
    <div className="w-full h-full bg-black">
      <Canvas>
        <Environment preset="city" />
        {introDone ? (
          <InfinitePlane />
        ) : (
          <Intro scale={20} rotation={[Math.PI / 2, 0, 0]} />
        )}
      </Canvas>
    </div>
  );
};

const InfinitePlane = () => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 40, 0);
    console.log("INFO: camera position set to ", camera.position);
  }, []);
  useFrame(({ pointer }) => {
    camera.position.z -= pointer.x;
    camera.lookAt(new THREE.Vector3(0, 0, camera.position.z - 40));
  });

  const tex = useTexture("/white_tex.jpg");
  const { nodes, materials } = useGLTF("/black.glb");

  const planesRef = useRef([]);
  const numPlanes = 4;
  const planeSize = 210;

  useFrame(() => {
    planesRef.current.forEach((plane, _index) => {
      if (camera.position.z > plane.position.z + planeSize / 2) {
        plane.position.z += planeSize * numPlanes;
      }
      if (camera.position.z < plane.position.z - planeSize / 2) {
        plane.position.z -= planeSize * numPlanes;
      }
    });
  });

  return (
    <group>
      {Array.from({ length: numPlanes }).map((_, index) => (
        <mesh
          key={index}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, index * planeSize]}
          ref={(el) => (planesRef.current[index] = el)}
          geometry={nodes.Plane001.geometry}
        >
          <meshStandardMaterial map={tex} />
        </mesh>
      ))}
    </group>
  );
};

export default Scene;
