'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Torus, Box } from '@react-three/drei';
import * as THREE from 'three';

export default function Product3D() {
  const groupRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const torusRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.2;
    }
    
    if (sphereRef.current) {
      sphereRef.current.position.y = Math.sin(t) * 0.3;
    }
    
    if (torusRef.current) {
      torusRef.current.rotation.x = t * 0.5;
      torusRef.current.rotation.z = t * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main Product - Futuristic Sphere */}
      <Sphere ref={sphereRef} args={[1, 64, 64]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color="#00f0ff"
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          emissive="#00f0ff"
          emissiveIntensity={0.5}
        />
      </Sphere>

      {/* Orbiting Ring */}
      <Torus ref={torusRef} args={[1.8, 0.1, 16, 100]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#b026ff"
          emissive="#b026ff"
          emissiveIntensity={0.5}
          metalness={1}
          roughness={0.2}
        />
      </Torus>

      {/* Floating Cubes */}
      <Box args={[0.3, 0.3, 0.3]} position={[2.5, 1, 0]}>
        <meshStandardMaterial
          color="#ff006e"
          emissive="#ff006e"
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.1}
        />
      </Box>

      <Box args={[0.25, 0.25, 0.25]} position={[-2.5, -1, 0]}>
        <meshStandardMaterial
          color="#39ff14"
          emissive="#39ff14"
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.1}
        />
      </Box>

      <Box args={[0.2, 0.2, 0.2]} position={[0, 2, -1]}>
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.1}
        />
      </Box>
    </group>
  );
}
