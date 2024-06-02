import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Model(props) {
  const { nodes, materials } = useGLTF('/white.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Plane001.geometry} material={materials['16 - Default']} rotation={[-Math.PI / 2, 0, 0]} />
    </group>
  )
}

useGLTF.preload('/white.glb')
