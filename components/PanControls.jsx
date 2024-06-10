"use client";
import { useStateStore } from "@/stores/state";
import { MapControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import * as THREE from "three";
import { lerp } from "three/src/math/MathUtils.js";

export default function PanControls() {
  // experimentally found values
  // const x = 0;
  const y = 9;
  const z = 25;
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
  const [cameraChase, setCameraChase] = useState(0);
  const [x, setX] = useState(0);
  const section = useStateStore((state) => state.section);
  const { camera } = useThree();
  const xOffest = 4;
  useEffect(() => {
    setCameraChase(camera.position.z - 10);
    if (section === "black") {
      setX(-xOffest);
    } else if (section === "white") {
      setX(xOffest);
    } else {
      setX(0);
    }
  }, [section]);

  const speed = 3.0;
  useFrame(({ camera }, delta) => {
    if (cameraChase !== 0) {
      camera.position.z = lerp(camera.position.z, cameraChase, 0.1);
      if (cameraChase - camera.position.z > 0.5) {
        setCameraChase(0);
      }
    }
    if (section === "home") {
      camera.position.z -= delta * speed;
    }
    camera.lookAt(new THREE.Vector3(0, 0, camera.position.z - z));
    camera.position.x = lerp(camera.position.x, x, 0.1);
    camera.position.y = lerp(camera.position.y, y, 0.1);
  });
  return <MapControls enableRotate={false} enableZoom={false} enableDamping={true} />;
}
