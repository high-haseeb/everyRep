"use client";
import {
  Environment,
  OrbitControls,
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
        {/* <directionalLight /> */}
        <OrbitControls />
        {/* {introDone ? ( */}
        <InfinitePlane />
        {/* ) : ( */}
        {/*   <Intro scale={20} rotation={[Math.PI / 2, 0, 0]} /> */}
        {/* )} */}
      </Canvas>
    </div>
  );
};

const InfinitePlane = () => {
  const { camera } = useThree();
  const Y_OFFSET = 4;
  const Z_OFFSET = Y_OFFSET - 1;

  useEffect(() => {
    camera.position.set(-2, Y_OFFSET, 0);
    console.log("INFO: camera position set to ", camera.position);
  }, []);
  //
  useFrame(({ pointer }) => {
    camera.position.z -= pointer.x;
    camera.lookAt(new THREE.Vector3(0, 0, camera.position.z - Z_OFFSET));
  });

  const tex = useTexture("/black_tex.jpg");
  const { nodes, _materials } = useGLTF("/cloth.glb");

  const planesRef = useRef([]);
  const numPlanes = 4;
  const planeSize = 20;
  // const box = useRef();

  useFrame(({ pointer }) => {
    planesRef.current.forEach((plane, _index) => {
      if (camera.position.z > plane.position.z + planeSize / 2) {
        plane.position.z += planeSize * numPlanes;
      }
      if (camera.position.z < plane.position.z - planeSize) {
        plane.position.z -= planeSize * numPlanes;
      }
    });
  });
  
  return(
    <group>
      {Array.from({ length: numPlanes }).map((_, index) => (
        <group>
          <mesh
            key={index}
            rotation={[0, Math.PI, 0]}
            position={[0, 0, index * planeSize]}
            ref={(el) => (planesRef.current[index] = el)}
            geometry={nodes.Plane001.geometry}
          >
            <meshStandardMaterial
              map={tex}
              side={THREE.DoubleSide}
            />
          </mesh>

          <mesh
            rotation={[0, -Math.PI / 2, 0]}
            position={[21, 0, index * planeSize]}
            ref={(el) => (planesRef.current[index + numPlanes] = el)}
            geometry={nodes.Plane001.geometry}
          >
            <meshStandardMaterial map={tex} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export default Scene;
