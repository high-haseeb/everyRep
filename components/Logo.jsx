import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useStateStore } from "@/stores/state";
import { MeshBasicMaterial } from "three";

export function Intro(props) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/models/intro.glb");
  const { actions } = useAnimations(animations, group);
  const {setIntroDone, introDone} = useStateStore();
  
  // play the animation
  useEffect(() => {
    for (const key in actions) {
      const action = actions[key];
      action.loop = THREE.LoopOnce;
      action.clampWhenFinished = true;
      action.play();
    }
  }, []);

  // intro done flag
  useFrame(() => {
    if(!introDone){
      setIntroDone(!actions["Shape1Action.002"].isRunning());
    }
  })
  const white_mat = new MeshBasicMaterial({color: 'white'});
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <mesh name="Shape1" geometry={nodes.Shape1.geometry} material={white_mat} position={[-10, 0, 0]} rotation={[Math.PI / 2, 0, -Math.PI]} scale={0} />
        <mesh name="Curve002" geometry={nodes.Curve002.geometry} material={white_mat} position={[-0.362, 0, -0.009]} />
        <mesh name="Curve003" geometry={nodes.Curve003.geometry} material={white_mat} position={[-0.257, 0, -0.004]} />
        <mesh name="Curve005" geometry={nodes.Curve005.geometry} material={white_mat} position={[-0.045, 0, -0.002]} />
        <mesh name="Curve006" geometry={nodes.Curve006.geometry} material={white_mat} position={[0.058, 0, -0.003]} />
        <mesh name="Curve008" geometry={nodes.Curve008.geometry} material={white_mat} position={[0.252, 0, -0.008]} />
        <mesh name="Curve009" geometry={nodes.Curve009.geometry} material={white_mat} position={[0.355, 0, -0.003]} />
        <mesh name="Curve010" geometry={nodes.Curve010.geometry} material={white_mat} position={[0.151, 0, -0.002]} />
        <mesh name="Curve012" geometry={nodes.Curve012.geometry} material={white_mat} position={[-0.15, 0, 0.001]} />
      </group>
    </group>
  );
}

useGLTF.preload("/models/intro.glb");
