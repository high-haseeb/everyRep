import { Float, Html, useCursor, useTexture } from "@react-three/drei";
import React, { forwardRef, useRef, useState } from "react";
import { DoubleSide } from "three";

const Artifact = forwardRef((props, ref) => {
  const positions = [
    [1, 0.5, 7],
    [1, 0.6, 0],
    [1.5, 0.8, -7],
  ];

  return (
    <group ref={ref}>
      {positions.map((pos, index) => (
        <Float key={index} floatingRange={[0, 1]} >
          <ArtifactDisc position={pos} />
        </Float>
      ))}
    </group>
  );
});

const ArtifactDisc = ({ position }) => {
  const discRef = useRef();
  const tex = useTexture('/images/cat.jpg');
  const [hovered, set] = useState(false);
  const [show, setShow] = useState(false);
  useCursor(hovered, /*'pointer', 'auto', document.body*/)

  return (
    <>
      <mesh position={position} ref={discRef}onPointerOver={() => set(true)} onPointerOut={() => set(false)} onClick={() => setShow(s => !s)}>
      <circleGeometry args={[0.5, 32]} attach="geometry" />
      <meshStandardMaterial side={DoubleSide} map={tex} emissive={'white'} emissiveMap={tex} emissiveIntensity={1.2}/>
    </mesh></>
  );
};

export default Artifact;
