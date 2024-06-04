"use client";
import { Environment, MapControls, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Model } from "./Logo";
import PanControls from "./PanControls";
import React, { useEffect, useRef } from "react";
import {BoundingBox} from 'three'

const Scene = () => {
  return (
    <div className="w-full h-full">
      <Canvas>
        <Environment preset="city" />
        <OrbitControls/>
        <Model scale={20} rotation={[Math.PI / 2, 0,0]}/>
        {/* <MapControls /> */}
      </Canvas>
    </div>
  );
};
function MovingPlane  ()  {
  const modelRef = useRef();
  const {camera} = useThree();
  useFrame(() => {
    if(camera.position.z > modelRef.current.geometry.boundingBox.max.y || camera.position.z < modelRef.current.geometry.boundingBox.min.y){
      console.log('moved over')
      modelRef.current.position.z = 2 * (modelRef.current.geometry.boundingBox.max.y + modelRef.current.geometry.boundingBox.min.y)
    }
  })
  useEffect(() => {
    if(modelRef.current){
      console.log(modelRef.current.geometry.boundingBox.max, modelRef.current.geometry.boundingBox.min)
    }
  },[modelRef.current])
  return <Model ref={modelRef} />;
};

const InfinitePlane = () => {
  const { camera } = useThree();
  const planesRef = useRef([]);
  const numPlanes = 2;
  const planeSize = 217;

  useFrame(() => {
    planesRef.current.forEach((plane, index) => {
      if (camera.position.z > plane.position.z + planeSize / 2) {
        plane.position.z += planeSize * numPlanes;
      }
      if (camera.position.z < plane.position.z - planeSize / 2) {
        plane.position.z -= planeSize * numPlanes;
      }
    });
  });

  return (
    <>
      <MapControls
        /*minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 4} */ enableRotate={
          true
        }
      />
      {Array.from({ length: numPlanes }).map((_, index) => (
        <mesh
          key={index}
          position={[0, 0, index * planeSize]}
          rotation={[0, Math.PI * index, 0]}
          ref={(el) => (planesRef.current[index] = el)}
        >
          <Model />
        </mesh>
      ))}
    </>
  );
};

export default Scene;
