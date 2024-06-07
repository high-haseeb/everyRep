"use client";
import { MapControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { useEffect, useState } from "react";
import * as THREE from "three";
import { lerp } from "three/src/math/MathUtils.js";

export default function PanControls() {
  const { camera } = useThree();
  // experimentally found values
  const x = -3.2;
  const y = 5.69;
  const z = 15.4;
  // const { x, y, z } = useControls({
  //   x: { value: 2, min: -10, max: 10 },
  //   y: { value: 2, min: 1, max: 10 },
  //   z: { value: 2, min: 1, max: 20 },
  // });
  //
  // TODO: enable scroll controls
  // const {camera, gl} = useThree();
  // const [ dy, setDY ] = useState(0);
  // useEffect(() => {
  //   const handleWheel = (e) => setDY(e.deltaY / 100);
  //   gl.domElement.addEventListener('wheel', e => handleWheel(e))
  //   return gl.domElement.removeEventListener('wheel', handleWheel)
  // }, [])
  //
  useFrame(({ camera }) => {
    camera.lookAt(new THREE.Vector3(0, 0, camera.position.z - z));
    camera.position.x = lerp(camera.position.x, x, 0.1);
    camera.position.y = lerp(camera.position.y, y, 0.1);
    // camera.position.z = lerp(camera.position.z, dy, 0.1);
  });
  return (
    <MapControls enableRotate={false} enableZoom={false} enableDamping={true} />
  );
}
