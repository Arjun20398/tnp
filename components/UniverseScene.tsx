'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Stellar Color Palette (O, B, A, F, G, K, M star classes)
const starPalette = [
  new THREE.Color("#9bb0ff"), // Class O (Blue)
  new THREE.Color("#aabfff"), // Class B (Deep Blue White)
  new THREE.Color("#cad7ff"), // Class A (Blue White)
  new THREE.Color("#f8f7ff"), // Class F (White)
  new THREE.Color("#fff4ea"), // Class G (Yellowish White)
  new THREE.Color("#ffd2a1"), // Class K (Pale Orange)
  new THREE.Color("#ffcc6f"), // Class M (Red Orange)
  new THREE.Color("#5533ff"), // Nebula Purple
];

// Vertex Shader
const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uSpeed;
  attribute float aSize;
  varying vec3 vColor;
  varying float vDist;

  void main() {
    vColor = color;
    
    vec3 pos = position;
    
    // Subtle breathing movement
    pos.x += sin(uTime * 0.5 + position.y) * 0.01;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    // Cursor Interaction
    float dist = distance(position.xy, uMouse.xy * 6.0);
    vDist = dist;

    float sizeEffect = 1.0;
    if (dist < 1.8) {
      sizeEffect = 1.0 + (1.8 - dist) * 2.5;
    }

    gl_PointSize = aSize * sizeEffect * (1.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// Fragment Shader
const fragmentShader = `
  varying vec3 vColor;
  varying float vDist;
  uniform float uSpeed;

  void main() {
    float r = distance(gl_PointCoord, vec2(0.5));
    if (r > 0.5) discard;
    
    // Brighten particles based on mouse speed
    float glow = pow(0.8 - r, 2.5) * 8.0;
    vec3 finalColor = vColor + (uSpeed * 0.5);
    
    float alpha = (1.0 - r * 2.0) * 0.8;
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

// Stellar Interactive Particles
function StellarParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const { pointer, camera } = useThree();
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const prevMouseRef = useRef(new THREE.Vector2(0, 0));
  const mouseSpeedRef = useRef(0);
  const targetRotationSpeedRef = useRef(0.0005);
  const currentRotationSpeedRef = useRef(0.0005);

  const PARTICLE_COUNT = 20000;

  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Spherical distribution
      const r = 8 * Math.pow(Math.random(), 0.5);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Auto-assign random stellar color
      const chosenColor = starPalette[Math.floor(Math.random() * starPalette.length)];
      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;

      sizes[i] = Math.random() * 25 + 5;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uSpeed: { value: 0.0 }
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    });

    return { geometry: geo, material: mat };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const t = state.clock.getElapsedTime();

    // Update mouse position
    mouseRef.current.set(pointer.x, pointer.y);
    
    // Calculate mouse speed
    const delta = mouseRef.current.distanceTo(prevMouseRef.current);
    mouseSpeedRef.current = Math.min(delta * 15, 1.0);
    
    targetRotationSpeedRef.current = 0.0005 + (mouseSpeedRef.current * 0.1);
    prevMouseRef.current.copy(mouseRef.current);

    // Update uniforms
    material.uniforms.uTime.value = t;
    material.uniforms.uMouse.value.lerp(mouseRef.current, 0.1);
    
    // Smooth rotation speed
    currentRotationSpeedRef.current = THREE.MathUtils.lerp(
      currentRotationSpeedRef.current,
      targetRotationSpeedRef.current,
      0.05
    );
    material.uniforms.uSpeed.value = currentRotationSpeedRef.current * 5.0;

    // Rotate Universe
    pointsRef.current.rotation.y += currentRotationSpeedRef.current;
    pointsRef.current.rotation.z += currentRotationSpeedRef.current * 0.2;

    // FOV Warp effect (only for PerspectiveCamera)
    if (camera instanceof THREE.PerspectiveCamera) {
      const targetFOV = 75 + (currentRotationSpeedRef.current * 400);
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFOV, 0.05);
      camera.updateProjectionMatrix();
    }

    // Passive deceleration
    targetRotationSpeedRef.current = THREE.MathUtils.lerp(
      targetRotationSpeedRef.current,
      0.0008,
      0.01
    );
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}

export default function UniverseScene() {
  return (
    <group>
      <StellarParticles />
    </group>
  );
}
