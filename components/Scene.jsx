'use client'
import { Environment, MapControls } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {Model} from './White'
import React, { useRef } from 'react'

const Scene = () => {
  return (
    <div className='w-full h-full'>
      <Canvas camera={{ position: [0, 200, 0] }}>
        <Environment preset='city' />
        <InfinitePlane />
      </Canvas>
    </div>
  )
}

const InfinitePlane = () => {
  const { camera } = useThree()
  const planesRef = useRef([])
  const numPlanes = 7
  const planeSize = 200

  useFrame(() => {
    planesRef.current.forEach((plane, index) => {
      if (camera.position.z > plane.position.z + planeSize / 2) {
        plane.position.z += planeSize * numPlanes
      }
      if (camera.position.z < plane.position.z - planeSize / 2) {
        plane.position.z -= planeSize * numPlanes
      }
    })
  })

  return (
    <>
      <MapControls minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 4} enableRotate={false} />
      {Array.from({ length: numPlanes }).map((_, index) => (
        <mesh
          key={index}
          position={[0, 0, index * planeSize]}
          ref={(el) => (planesRef.current[index] = el)}
        >
          <Model/>
        </mesh>
      ))}
    </>
  )
}

export default Scene
