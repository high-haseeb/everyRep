"use client";
import React, { useEffect, useRef } from "react";
import { Cloud, Clouds, Environment, Loader, MapControls, Sky, Stats, useGLTF, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useStateStore } from "@/stores/state";
import * as THREE from "three";

import PanControls from "@/components/PanControls";
import { Stich } from "@/components/Stich";
import Artifact from "@/components/Artifact";
import { Intro } from "./Logo";
import Overlay from "./Overlay";

import vertPars from "./shaders/vertPars.glsl";
import vertMain from "./shaders/vertMain.glsl";
import fragPars from "./shaders/fragPars.glsl";
import fragMain from "./shaders/fragMain.glsl";

const Scene = () => {
  const introDone = useStateStore((state) => state.introDone);

  return (
    <div className="w-full h-full bg-black">
      <Loader />
      {introDone && <Overlay />}
      <Canvas camera={{ zoom: 4 }} scene={{ background: new THREE.Color(0x000) }}>
        <Environment preset="city" environmentIntensity={0.4} />
        {/* <directionalLight position={[0, 4, 0]} intensity={1} /> */}
        <spotLight position={[0, 4, 0]} />
        {introDone ? (
          <>
            <fog attach={"fog"} color={"white"} near={1} far={100} />
            <ambientLight intensity={1} />
            <PanControls />
            <InfinitePlane />
          </>
        ) : (
          <Intro scale={10} rotation={[Math.PI / 2, 0, 0]} />
        )}
      </Canvas>
    </div>
  );
};

const Experience = () => {
  const { scene } = useThree();
  useEffect(() => {
    scene.background.set("white");
  }, []);

  return (
    <Clouds >
      <Cloud position={[10, 1, 0]} bounds={new THREE.Vector3(1, 1, 10)} opacity={0.4} />
      <Cloud position={[-10, 1, 0]} bounds={new THREE.Vector3(1, 1, 10)} opacity={0.4} />
    </Clouds>
  );
};

const InfinitePlane = () => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 40, camera.position.z);
  }, []);

  const planesRef = useRef([]);
  const numPlanes = 4;
  const planeSize = 20;

  useFrame(() => {
    planesRef.current.forEach((plane, _index) => {
      if (camera.position.z > plane.position.z + planeSize) {
        plane.position.z += planeSize * numPlanes;
      }
      if (camera.position.z < plane.position.z) {
        plane.position.z -= planeSize * numPlanes;
      }
    });
  });

  // TODO: make this instancd mesh
  const section = useStateStore(state => state.section);
  return (
    <group>
      {Array.from({ length: numPlanes }).map((_, index) => (
        <group position={[0, 0, index * planeSize]} ref={(el) => (planesRef.current[index] = el)}>
          <Cloth index={index} />
          <Experience />
          { section !== 'home' && <Artifact /> }
        </group>
      ))}
    </group>
  );
};
const Cloth = ({ index }) => {
  const { nodes, _materials } = useGLTF("/models/cloth.glb");
  const section = useStateStore((state) => state.section);
  const isMobile = useStateStore((state) => state.isMobile);

  const white_tex = useTexture(`/images/white_tex.jpg`);
  const black_tex = useTexture(`/images/black_tex.jpg`);

  const materialRef = useRef();
  const shader = materialRef.current?.userData.shader;

  useEffect(() => {
    if (!shader) return;
    if (section === "white") {
      shader.uniforms.u_black.value = white_tex;
      shader.uniforms.u_white.value = white_tex;
    } else if (section === "black") {
      shader.uniforms.u_white.value = black_tex;
      shader.uniforms.u_black.value = black_tex;
    } else {
      shader.uniforms.u_white.value = white_tex;
      shader.uniforms.u_black.value = black_tex;
    }
  }, [section, shader]);


  return (
    <mesh key={index} rotation={[0, Math.PI, 0]} geometry={nodes.Plane001.geometry}>
      <meshPhysicalMaterial
        ref={materialRef}
        roughness={1.0}
        metalness={0.4}
        sheen={1.0}
        sheenColorMap={white_tex}
        onBeforeCompile={(shader) => {
          // setting up the uniforms
          materialRef.current.userData.shader = shader;
          shader.uniforms.u_white = { value: white_tex };
          shader.uniforms.u_black = { value: black_tex };
          shader.uniforms.isMobile = { value: window.innerWidth < 600 }

          // injecting vertex and fragment shaders
          const parseVertexString = `#include <displacementmap_pars_vertex>`;
          const mainVertexString = `#include <displacementmap_vertex>`;
          shader.vertexShader = shader.vertexShader.replace(parseVertexString, parseVertexString + vertPars);
          shader.vertexShader = shader.vertexShader.replace(mainVertexString, mainVertexString + vertMain);

          const parseFragmentString = `#include <bumpmap_pars_fragment>`;
          const mainFragmentString = `vec4 diffuseColor = vec4( diffuse, opacity );`;
          shader.fragmentShader = shader.fragmentShader.replace(parseFragmentString, parseFragmentString + fragPars);
          shader.fragmentShader = shader.fragmentShader.replace(mainFragmentString, fragMain);
        }}
      />
    </mesh>
  );
};

useGLTF.preload("/models/cloth.glb");
useTexture.preload("/images/white_tex.jpg");
useTexture.preload("/images/black_tex.jpg");
useTexture.preload('/images/cat.jpg')

export default Scene;
