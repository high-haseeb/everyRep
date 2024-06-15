"use client";
import React, { useEffect, useRef } from "react";
import { BakeShadows, Environment, Loader, Merged, useGLTF, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useStateStore } from "@/stores/state";
import * as THREE from "three";

import Image from "next/image";

import PanControls from "@/components/PanControls";
import Artifact from "@/components/Artifact";
import { Intro } from "./Logo";
import Overlay from "./Overlay";

import vertPars from "./shaders/vertPars.glsl";
import vertMain from "./shaders/vertMain.glsl";
import fragPars from "./shaders/fragPars.glsl";
import fragMain from "./shaders/fragMain.glsl";
import { EffectComposer } from "@react-three/postprocessing";
import { Fluid } from "@whatisjery/react-fluid-distortion";

const Scene = () => {
  const introDone = useStateStore((state) => state.introDone);
  const section = useStateStore((state) => state.section);
  return (
    <div className="w-full h-full bg-black">
      <div className="w-screen h-screen pointer-events-none bg-transparent absolute top-0 left-0">
        <Image
          src={"/images/logo_main.svg"}
          width={200}
          height={100}
          alt="logo"
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 lg:w-40 mix-blend-difference bg-transparent z-50 pointer-events-none 
  ${section === "home" && introDone ? "block" : "hidden"}`}
        />
      </div>
      <Loader />
      {introDone && <Overlay />}
      <Canvas camera={{ zoom: 4 }} scene={{ background: new THREE.Color(0x000) }} className="fixed top-0 left-0 h-screen w-screen bg-black">
        <Environment preset="city" environmentIntensity={0.6} />

        <spotLight position={[0, 4, 0]} />
        {introDone ? (
          <>
            <fogExp2 attach={"fog"} color={section === "black" ? "black" : section === "white" ? "white" : "black"} density={0.025} />
            <ambientLight intensity={1} />
            <InfinitePlane />
          </>
        ) : (
          <Intro scale={10} rotation={[Math.PI / 2, 0, 0]} />
        )}
        <BakeShadows />
        <EffectComposer>
          <Fluid  fluidColor="#222" swirl={1}/>
        </EffectComposer>
        <PanControls />
      </Canvas>
    </div>
  );
};

const InfinitePlane = () => {
  const { camera, scene } = useThree();
  const section = useStateStore((state) => state.section);

  useEffect(() => {
    if (section == "white") {
      scene.background.set(new THREE.Color("white"));
    } else {
      scene.background.set(new THREE.Color("black"));
    }
  }, [section]);
  const moveBack = 1000;
  useEffect(() => {
    camera.position.set(0, 40, camera.position.z + moveBack);
    console.log(camera.position);
  }, []);

  const planesRef = useRef([]);
  const numPlanes = 4;
  const planeSize = 20;

  useFrame(() => {
    planesRef.current.forEach((plane, _index) => {
      if (camera.position.z > plane.position.z) {
        plane.position.z += planeSize * numPlanes;
      }
      if (camera.position.z < plane.position.z - planeSize / 2) {
        plane.position.z -= planeSize * numPlanes;
      }
    });
  });

  // TODO: make this instancd mesh
  return (
    <group>
      {Array.from({ length: numPlanes }).map((_, index) => (
        <group position={[0, 0, index * planeSize]} ref={(el) => (planesRef.current[index] = el)}>
          <Cloth index={index} />
          {section !== "home" && <Artifact />}
        </group>
      ))}
    </group>
  );
};
const Cloth = ({ index }) => {
  const { nodes, _materials } = useGLTF("/models/cloth.glb");
  const section = useStateStore((state) => state.section);

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
        roughness={0.8}
        metalness={0.5}
        sheen={0.4}
        sheenColorMap={white_tex}
        onBeforeCompile={(shader) => {
          // setting up the uniforms
          materialRef.current.userData.shader = shader;
          shader.uniforms.u_white = { value: white_tex };
          shader.uniforms.u_black = { value: black_tex };
          shader.uniforms.isMobile = { value: window.innerWidth < 600 };

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
useTexture.preload("/images/cat.jpg");

export default Scene;
