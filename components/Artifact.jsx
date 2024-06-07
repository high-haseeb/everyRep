import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import { DoubleSide } from "three";

const Artifact = () => {
  const NUM_ART = 4;
  const positions = [
    [1, 0.5, 7],
    [1, 0.6, 0],
    [1.5, 0.8, -7],
  ];
  const discRef = useRef()

  // make the disc look at camera
  // useFrame(({camera}) => {
    // discRef.current.rotation.y = Math.atan2(camera.position.x - discRef.current.position.x, camera.position.z - discRef.current.position.z);
  // })
  const tex = useTexture('/images/cat.jpg')

  return (
    <>
      {positions.map((pos, index) => (
        <mesh position={pos} ref={discRef} >
          <circleGeometry args={[0.5, 32]} attach="geometry" />
          <meshStandardMaterial side={DoubleSide} map={tex} emissive={'white'} emissiveMap={tex} emissiveIntensity={1.2}/>
        </mesh>
      ))}
    </>
  );
};

export default Artifact;
