"use client";
import { useStateStore } from "@/stores/state";
import { Cloud, Clouds, MapControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { lerp } from "three/src/math/MathUtils.js";

export default function PanControls() {
  const introDone = useStateStore((state) => state.introDone);
  // experimentally found values
  // const x = 0;
  const y = 3.8;
  const z = 21;
  // const {y, z} = useControls({y: {value: 9, min: -10, max: 10}, z: {value: 25, min: -100, max: 100}})
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
  const xOffest = 2;

  useEffect(() => {
    if (introDone) {
      setCameraChase(camera.position.z - 10);
      if (section === "black") {
        setX(-xOffest);
      } else if (section === "white") {
        setX(xOffest);
      } else {
        setX(0);
      }
    }
  }, [section]);

  const cloudsRef = useRef();
  const speed = 3.0;
  useFrame(({ camera }, delta) => {
    if (!introDone) return;
    if (cameraChase !== 0) {
      camera.position.z = lerp(camera.position.z, cameraChase, 0.1);
      if (cameraChase - camera.position.z > 0.5) {
        setCameraChase(0);
      }
    }
    if (section === "home") {
      camera.position.z -= delta * speed;
    }
    cloudsRef.current.position.z = camera.position.z - 30;
    camera.lookAt(new THREE.Vector3(0, 0, camera.position.z - z));
    camera.position.x = lerp(camera.position.x, x, 0.1);
    camera.position.y = lerp(camera.position.y, y, 0.1);
  });
  return (
    <>
      <Clouds ref={cloudsRef} position={[0, 0, -20]} >
        <Cloud position={[10, 1, 0]} bounds={new THREE.Vector3(1, 1, 20)} opacity={0.4} />
        <Cloud position={[-10, 1, 0]} bounds={new THREE.Vector3(1, 1, 20)} opacity={0.4} />
      </Clouds>
      <MapControls enableRotate={false} enableZoom={false} enableDamping={true} enabled={introDone} makeDefault dampingFactor={0.1} panSpeed={0.02}/>
    </>
  );
}
