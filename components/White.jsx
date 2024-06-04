import React, { forwardRef } from 'react'
import { useGLTF } from '@react-three/drei'

const Model = forwardRef((props, ref) => {
  const { nodes, materials } = useGLTF('/white.glb')
  return (
    <group {...props} dispose={null} >
      <mesh geometry={nodes.Plane001.geometry} material={materials['16 - Default']} rotation={[-Math.PI / 2, 0, 0]} ref={ref}/>
    </group>
  )
})

export { Model };

useGLTF.preload('/white.glb');
