import React, { useRef } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from 'three'

export function Stich(props) {
  const { nodes, materials } = useGLTF("/models//stich.glb");
  const tex = useTexture('/images/bitmap.png');
  tex.repeat = new THREE.Vector2(1, 100) 
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return (
    <mesh geometry={nodes.Plane001001.geometry} {...props} scale={[1, 1, 1]}>
      <meshStandardMaterial map={tex} transparent color={'black'}/>
    </mesh>
  );
}

useGLTF.preload("/models/stich.glb");
