"use client";
import React, { useEffect, useRef } from "react";
import {
  Environment,
  Loader,
  MapControls,
  OrbitControls,
  Stats,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useStateStore } from "@/stores/state";
import * as THREE from "three";

import PanControls from "@/components/PanControls";
import Artifact from "@/components/Artifact";
import { Intro } from "./Logo";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
} from "@react-three/postprocessing";
import { useControls } from "leva";

const Scene = () => {
  const introDone = useStateStore((state) => state.introDone);
  useEffect(() => {
    console.log(introDone);
  }, [introDone]);
  return (
    <div className="w-full h-full bg-black">
      <Loader />
      <Canvas camera={{ zoom: 4 }}>
        <Environment preset="city" />
        {/* <directionalLight /> */}
        {introDone ? (
          <>
            <PanControls />
            <InfinitePlane />
            <Artifact />
          </>
        ) : (
          <Intro scale={10} rotation={[Math.PI / 2, 0, 0]} />
        )}
        <Stats />
        <EffectComposer>
          {/* <Bloom luminanceThreshold={0.7} intensity={0.23} height={300} /> */}
        </EffectComposer>
      </Canvas>
    </div>
  );
};

const InfinitePlane = () => {
  const { camera } = useThree();

  const { color, texRepeat } = useControls({
    color: { value: "white", options: ["white", "black"] },
    texRepeat: { value: 1, min: 1, max: 4, step: 0.1 },
  });
  const tex = useTexture(`/images/${color}_tex.jpg`);
  tex.repeat = new THREE.Vector2(texRepeat, texRepeat);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  const { nodes, _materials } = useGLTF("/models/cloth.glb");

  const planesRef = useRef([]);
  const numPlanes = 4;
  const planeSize = 20;

  useFrame(() => {
    planesRef.current.forEach((plane, _index) => {
      if (camera.position.z > plane.position.z + planeSize / 2) {
        plane.position.z += planeSize * numPlanes;
      }
      if (camera.position.z < plane.position.z - planeSize) {
        plane.position.z -= planeSize * numPlanes;
      }
    });
  });

  // TODO: make this instancd mesh
  return (
    <group>
      {Array.from({ length: numPlanes }).map((_, index) => (
        <group
          position={[0, 0, index * planeSize]}
          ref={(el) => (planesRef.current[index] = el)}
        >
          <mesh
            key={index}
            rotation={[0, Math.PI, 0]}
            geometry={nodes.Plane001.geometry}
          >
            <meshStandardMaterial map={tex} side={THREE.DoubleSide} />
          </mesh>
          <Artifact />

          {/* <mesh */}
          {/*   rotation={[0, -Math.PI / 2, 0]} */}
          {/*   position={[21, 0, index * planeSize]} */}
          {/*   ref={(el) => (planesRef.current[index + numPlanes] = el)} */}
          {/*   geometry={nodes.Plane001.geometry} */}
          {/* > */}
          {/*   <meshStandardMaterial map={tex} side={THREE.DoubleSide} /> */}
          {/* </mesh> */}
        </group>
      ))}
    </group>
  );
};
useGLTF.preload("/models/cloth.glb");
useTexture.preload('/images/white_tex.jpg')
useTexture.preload('/images/black_tex.jpg')

export default Scene;
