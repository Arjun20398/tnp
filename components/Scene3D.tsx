'use client';

import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { Suspense } from 'react';
import UniverseScene from './UniverseScene';

export default function Scene3D() {
  return (
    <div className="w-full h-screen fixed top-0 left-0 z-0 pointer-events-none">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={75} />
        
        {/* Lighting for the universe */}
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 0, 0]} intensity={2} color="#b026ff" />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00f0ff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#ff006e" />
        
        <Suspense fallback={null}>
          <UniverseScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
