'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Html } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

// Mock schedule data for the timeline nodes
const scheduleData = [
  { id: 'bcg', position: [-4, 0, 0], color: '#10b981', label: 'BCG (Birth)' }, // Green (On-track/Done)
  { id: 'penta1', position: [-1.5, 1.5, 0], color: '#10b981', label: 'PENTA-1 (6W)' },
  { id: 'penta2', position: [1, 0, 0], color: '#10b981', label: 'PENTA-2 (10W)' },
  { id: 'penta3', position: [3.5, -1.5, 0], color: '#ef4444', label: 'PENTA-3 (Missed)' }, // Red
  { id: 'mr1', position: [6, 0, 0], color: '#fbbf24', label: 'MR-1 (9M)' } // Yellow
];

function TimelineCurve() {
  const points = scheduleData.map(d => new THREE.Vector3(...d.position));
  const curve = new THREE.CatmullRomCurve3(points);
  const tubeGeometry = new THREE.TubeGeometry(curve, 64, 0.05, 8, false);

  return (
    <mesh geometry={tubeGeometry}>
      <meshBasicMaterial color="rgb(16, 185, 129)" transparent opacity={0.3} />
    </mesh>
  );
}

function VaccineNode({ position, color, label }: { position: [number, number, number], color: string, label: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.1;
    }
  });

  return (
    <group position={position}>
      <Sphere ref={meshRef} args={[0.3, 32, 32]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} roughness={0.2} metalness={0.8} />
      </Sphere>
      <Html distanceFactor={10} position={[0, -0.6, 0]} center>
        <div style={{ color: color === '#ef4444' ? color : 'var(--foreground)', background: 'var(--glass-bg)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', border: `1px solid ${color}`, whiteSpace: 'nowrap', backdropFilter: 'blur(4px)' }}>
          {label}
        </div>
      </Html>
    </group>
  );
}

export default function Timeline3D() {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      <TimelineCurve />
      
      {scheduleData.map((node) => (
        <VaccineNode key={node.id} position={node.position as [number, number, number]} color={node.color} label={node.label} />
      ))}
      
      <OrbitControls enableZoom={true} enablePan={false} autoRotate={true} autoRotateSpeed={0.5} minPolarAngle={Math.PI/3} maxPolarAngle={Math.PI/2} />
    </Canvas>
  );
}
