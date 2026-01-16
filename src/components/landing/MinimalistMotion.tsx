'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Line } from '@react-three/drei';
import * as THREE from 'three';

function FloatingText({
  text,
  position,
  size = 0.5,
  color = '#C9A227',
}: {
  text: string;
  position: [number, number, number];
  size?: number;
  color?: string;
}) {
  const textRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (textRef.current) {
      textRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
      <Text
        ref={textRef}
        position={position}
        fontSize={size}
        color={color}
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        {text}
      </Text>
    </Float>
  );
}

function GeometricShape({
  type,
  position,
  color,
}: {
  type: 'ring' | 'diamond' | 'line';
  position: [number, number, number];
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.2;
      if (type === 'diamond') {
        meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      }
    }
  });

  if (type === 'ring') {
    return (
      <mesh ref={meshRef} position={position}>
        <torusGeometry args={[1, 0.02, 16, 100]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.4}
        />
      </mesh>
    );
  }

  if (type === 'diamond') {
    return (
      <mesh ref={meshRef} position={position}>
        <octahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
          wireframe
        />
      </mesh>
    );
  }

  return null;
}

function BackgroundGrid() {
  const gridRef = useRef<THREE.Group>(null);

  const lines = useMemo(() => {
    const linesArray: { start: THREE.Vector3; end: THREE.Vector3 }[] = [];

    // Horizontal lines
    for (let i = -5; i <= 5; i += 2) {
      linesArray.push({
        start: new THREE.Vector3(-8, i, -2),
        end: new THREE.Vector3(8, i, -2),
      });
    }

    // Vertical lines
    for (let i = -8; i <= 8; i += 2) {
      linesArray.push({
        start: new THREE.Vector3(i, -5, -2),
        end: new THREE.Vector3(i, 5, -2),
      });
    }

    return linesArray;
  }, []);

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = -2 + Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
    }
  });

  const linePoints = useMemo(() => {
    return lines.map((line) => [
      [line.start.x, line.start.y, line.start.z] as [number, number, number],
      [line.end.x, line.end.y, line.end.z] as [number, number, number],
    ]);
  }, [lines]);

  return (
    <group ref={gridRef}>
      {linePoints.map((points, i) => (
        <Line
          key={i}
          points={points}
          color="#162A46"
          lineWidth={1}
          transparent
          opacity={0.3}
        />
      ))}
    </group>
  );
}

function AnimatedDots() {
  const dotsRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const dotCount = 50;

  const positions = useMemo(() => {
    const pos: THREE.Vector3[] = [];
    for (let i = 0; i < dotCount; i++) {
      pos.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 2
        )
      );
    }
    return pos;
  }, [dotCount]);

  useFrame((state) => {
    if (dotsRef.current) {
      positions.forEach((pos, i) => {
        dummy.position.set(
          pos.x,
          pos.y + Math.sin(state.clock.elapsedTime + i * 0.5) * 0.2,
          pos.z
        );
        const scale = 0.03 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.01;
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();
        dotsRef.current!.setMatrixAt(i, dummy.matrix);
      });
      dotsRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={dotsRef} args={[undefined, undefined, dotCount]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        color="#4a5a6a"
        emissive="#4a5a6a"
        emissiveIntensity={0.3}
      />
    </instancedMesh>
  );
}

export default function MinimalistMotion() {
  return (
    <group>
      <BackgroundGrid />
      <AnimatedDots />

      {/* Trade Finance Offsite Workshop themed text */}
      <FloatingText text="Trade Finance" position={[0, 1.8, 0]} size={0.7} color="#E8E8E8" />
      <FloatingText
        text="Offsite Workshop"
        position={[0, 0.6, 0]}
        size={0.5}
        color="#8B9BB4"
      />
      <FloatingText
        text="Buyers  |  Suppliers  |  Banks"
        position={[0, -0.2, 0]}
        size={0.2}
        color="#6B7F9E"
      />
      <FloatingText
        text="$$$"
        position={[0, -1.0, 0]}
        size={0.3}
        color="#8B7355"
      />

      {/* Decorative shapes - muted colors */}
      <GeometricShape type="ring" position={[-4, 2, 0]} color="#8B7355" />
      <GeometricShape type="ring" position={[4, -2, 0]} color="#4a6a5a" />
      <GeometricShape type="diamond" position={[-3, -1.5, 0]} color="#4a5a7a" />
      <GeometricShape type="diamond" position={[3, 1.5, 0]} color="#4a6a5a" />
    </group>
  );
}
