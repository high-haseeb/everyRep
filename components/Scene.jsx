'use client'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, MapControls, useGLTF } from '@react-three/drei'
import React, { useRef, useMemo, useEffect } from 'react'
import * as THREE from 'three'

const Scene = () => {
  return (
    <div className='w-full h-full'>
      <Canvas camera={{ position: [0, 100, 0], zoom: 0.5 }}>
        <Environment preset='city' />
        <InfinitePlane />
      </Canvas>
    </div>
  )
}

const InfinitePlane = () => {
  const { nodes, materials } = useGLTF('/white.glb')
  const { camera } = useThree()
  const instancedMeshRef = useRef()
  const numPlanes = 4
  const spacing = 200

  const dummy = useMemo(() => new THREE.Object3D(), [])

  const positions = useMemo(() => {
    const positions = []
    for (let i = 0; i < numPlanes; i++) {
      positions.push(0, 0, i * spacing)
    }
    return positions
  }, [numPlanes, spacing])

  useFrame(() => {
    const mesh = instancedMeshRef.current
    for (let i = 0; i < numPlanes; i++) {
      const position = new THREE.Vector3().fromArray(positions, i * 3)
      if (camera.position.z > position.z + spacing / 2) {
        position.z += spacing * numPlanes;
        positions[i * 3 + 2] = position.z;
      }
      if (camera.position.z < position.z - spacing / 2) {
        position.z -= spacing * numPlanes
        positions[i * 3 + 2] = position.z
      }
      dummy.position.copy(position)
      // dummy.rotation.set(-Math.PI / 2, 0, 0)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  })

  useEffect(() => {
    const mesh = instancedMeshRef.current
    for (let i = 0; i < numPlanes; i++) {
      const position = new THREE.Vector3().fromArray(positions, i * 3)
      dummy.position.copy(position)
      dummy.rotation.set(-Math.PI / 2, 0, 0)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  }, [positions, dummy, numPlanes])

  return (
    <>
      <MapControls enableRotate={false} enableZoom={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 4} />
      <instancedMesh ref={instancedMeshRef} args={[null, null, numPlanes]}>
        <bufferGeometry attach="geometry" {...nodes.Plane001.geometry} />
        <meshStandardMaterial attach="material" {...materials['16 - Default']} />
      </instancedMesh>
    </>
  )
}

export default Scene
