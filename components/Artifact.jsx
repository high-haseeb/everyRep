import { Float, Html, useCursor, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import React, { forwardRef, useRef, useState } from "react";
import { DoubleSide } from "three";
import * as THREE from "three";

const Artifact = forwardRef((props, ref) => {
  const positions = [
    // [1, 1.5, 4],
    // [1, 0.6, 0],
    [1.5, 1.8, -4],
  ];

  return (
    <group ref={ref}>
      {positions.map((pos, index) => (
        <ArtifactDisc position={pos} key={index} />
      ))}
    </group>
  );
});

const ArtifactDisc = ({ position }) => {
  const discRef = useRef();
  const tex = useTexture("/images/cat.jpg");
  const [hovered, set] = useState(false);
  const [show, setShow] = useState(false);
  useCursor(hovered /*'pointer', 'auto', document.body*/);
  const addTex = useTexture("/images/select.png");
//   useFrame(({camera}) => {
//     if(camera.position.distanceTo(discRef.current.position)  > 13) {
// discRef.current.visible = false
//     }else{
//
// discRef.current.visible = true
//     }
  // })

  return (
    <group position={position} ref={discRef}>
      <mesh onPointerOver={() => set(true)} onPointerOut={() => set(false)} onClick={() => setShow((s) => !s)}>
        <circleGeometry args={[0.5, 32]} attach="geometry" />
        <Html transform className="w-10 h-10 overflow-hidden text-xs rounded-full">
          <div className="w-full h-full border-red-200 border-[1px] rounded-full flex items-start justify-center">Hello</div>
        </Html>
        <meshStandardMaterial side={DoubleSide} map={tex} emissive={"white"} emissiveMap={tex} emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0, -0.8, 0]} rotation={[Math.PI, 0, 0]} scale={[0.4, 0.4, 0.4]}>
        <planeGeometry args={[0.6, 1.5, 1, 1]} />
        <meshStandardMaterial
          map={addTex}
          transparent
          side={THREE.DoubleSide}
          emissiveMap={addTex}
          envMapIntensity={4.0}
          emissive={"white"}
          emissiveIntensity={4.0}
        />
      </mesh>
    </group>
  );
};

export default Artifact;
