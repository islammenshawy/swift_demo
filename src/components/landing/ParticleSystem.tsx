'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useLandingStore } from '@/stores/landingStore';

const PARTICLE_COUNT = 5000;

// Zone definitions
const ZONES = {
  suppliers: { x: -4.5, y: 0, color: new THREE.Color('#4ECDC4'), label: 'SUPPLIERS' },
  banks: { x: 0, y: 0, color: new THREE.Color('#FFD700'), label: 'BANKS' },
  buyers: { x: 4.5, y: 0, color: new THREE.Color('#6495ED'), label: 'BUYERS' },
};

// Animated label component
function ZoneLabel({
  position,
  text,
  color,
  delay = 0
}: {
  position: [number, number, number];
  text: string;
  color: string;
  delay?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Pulsing scale
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2 + delay) * 0.05;
      groupRef.current.scale.setScalar(pulse);
    }
    if (ringRef.current) {
      // Rotating ring
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group position={position} ref={groupRef}>
      {/* Outer ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[0.8, 0.85, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
      {/* Inner glow */}
      <mesh>
        <circleGeometry args={[0.75, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.08} />
      </mesh>
      {/* Label */}
      <Text
        position={[0, 0, 0.1]}
        fontSize={0.25}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {text}
      </Text>
    </group>
  );
}

// Flowing money particle between zones
function FlowParticle({
  startX,
  endX,
  color,
  speed,
  offset,
  yOffset = 0
}: {
  startX: number;
  endX: number;
  color: string;
  speed: number;
  offset: number;
  yOffset?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const trailRefs = [useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null)];

  useFrame((state) => {
    const t = ((state.clock.elapsedTime * speed * 0.15) + offset) % 1;
    const x = startX + (endX - startX) * t;
    const y = yOffset + Math.sin(t * Math.PI) * 0.8; // Arc motion

    if (groupRef.current) {
      groupRef.current.position.set(x, y, 0);
    }

    // Trail positions
    trailRefs.forEach((ref, i) => {
      if (ref.current) {
        const trailT = Math.max(0, t - (i + 1) * 0.03);
        const trailX = startX + (endX - startX) * trailT;
        const trailY = yOffset + Math.sin(trailT * Math.PI) * 0.8;
        ref.current.position.set(trailX - x, trailY - y, 0);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* Trail */}
      {trailRefs.map((ref, i) => (
        <mesh key={i} ref={ref}>
          <circleGeometry args={[0.04 - i * 0.01, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.3 - i * 0.1} />
        </mesh>
      ))}
      {/* Main particle */}
      <mesh>
        <circleGeometry args={[0.08, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} />
      </mesh>
      {/* Glow */}
      <mesh>
        <circleGeometry args={[0.14, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

// Large $ symbol flowing
function MoneyFlow({
  startX,
  endX,
  speed,
  offset,
  yOffset = 0
}: {
  startX: number;
  endX: number;
  speed: number;
  offset: number;
  yOffset?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = ((state.clock.elapsedTime * speed * 0.1) + offset) % 1;
    const x = startX + (endX - startX) * t;
    const y = yOffset + Math.sin(t * Math.PI) * 1.2;

    if (groupRef.current) {
      groupRef.current.position.set(x, y, 0.1);
    }
    if (glowRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.2;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Glow */}
      <mesh ref={glowRef}>
        <circleGeometry args={[0.25, 16]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.35} />
      </mesh>
      {/* Background */}
      <mesh>
        <circleGeometry args={[0.15, 16]} />
        <meshBasicMaterial color="#B8860B" />
      </mesh>
      {/* $ symbol */}
      <Text
        position={[0, 0, 0.01]}
        fontSize={0.15}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
      >
        $
      </Text>
    </group>
  );
}

// Background particles
function BackgroundParticles() {
  const meshRef = useRef<THREE.Points>(null);
  const { mousePosition } = useLandingStore();

  const { positions, colors, scales } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const scales = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      // Distribute particles with density based on zones
      const zone = Math.random();
      let x, y;

      if (zone < 0.3) {
        // Suppliers zone (left)
        x = -4.5 + (Math.random() - 0.5) * 3;
        y = (Math.random() - 0.5) * 4;
        colors[i3] = 0.3;
        colors[i3 + 1] = 0.8;
        colors[i3 + 2] = 0.77;
      } else if (zone < 0.6) {
        // Banks zone (center)
        x = (Math.random() - 0.5) * 3;
        y = (Math.random() - 0.5) * 4;
        colors[i3] = 1.0;
        colors[i3 + 1] = 0.84;
        colors[i3 + 2] = 0.0;
      } else if (zone < 0.9) {
        // Buyers zone (right)
        x = 4.5 + (Math.random() - 0.5) * 3;
        y = (Math.random() - 0.5) * 4;
        colors[i3] = 0.39;
        colors[i3 + 1] = 0.58;
        colors[i3 + 2] = 0.93;
      } else {
        // Connecting particles
        x = (Math.random() - 0.5) * 12;
        y = (Math.random() - 0.5) * 5;
        colors[i3] = 0.6;
        colors[i3 + 1] = 0.6;
        colors[i3 + 2] = 0.7;
      }

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = (Math.random() - 0.5) * 2;

      scales[i] = Math.random() * 2 + 1;
    }

    return { positions, colors, scales };
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
  }), []);

  const vertexShader = `
    uniform float uTime;
    uniform vec2 uMouse;

    attribute float aScale;
    attribute vec3 aColor;

    varying vec3 vColor;
    varying float vAlpha;

    void main() {
      vec3 pos = position;

      // Gentle floating motion
      pos.y += sin(uTime * 0.5 + position.x * 0.5) * 0.1;
      pos.x += cos(uTime * 0.3 + position.y * 0.5) * 0.05;

      // Mouse repulsion
      vec2 mouseDir = pos.xy - uMouse * 6.0;
      float mouseDist = length(mouseDir);
      float mouseInfluence = smoothstep(2.5, 0.0, mouseDist) * 0.5;
      pos.xy += normalize(mouseDir + 0.001) * mouseInfluence;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      gl_PointSize = aScale * (200.0 / -mvPosition.z);

      vColor = aColor * 0.6;
      vAlpha = 0.4;
    }
  `;

  const fragmentShader = `
    varying vec3 vColor;
    varying float vAlpha;

    void main() {
      float dist = length(gl_PointCoord - vec2(0.5));
      if (dist > 0.5) discard;

      float alpha = 1.0 - smoothstep(0.2, 0.5, dist);
      gl_FragColor = vec4(vColor, alpha * vAlpha * 0.4);
    }
  `;

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    return geo;
  }, [positions, colors, scales]);

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.elapsedTime;
      material.uniforms.uMouse.value.set(mousePosition.x, mousePosition.y);
    }
  });

  return (
    <points ref={meshRef} geometry={geometry}>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Connecting lines between zones
function ConnectionLines() {
  const lineRef1 = useRef<THREE.Line>(null);
  const lineRef2 = useRef<THREE.Line>(null);

  useFrame((state) => {
    // Animate line opacity
    const opacity = 0.12 + Math.sin(state.clock.elapsedTime * 2) * 0.03;
    if (lineRef1.current) {
      (lineRef1.current.material as THREE.LineBasicMaterial).opacity = opacity;
    }
    if (lineRef2.current) {
      (lineRef2.current.material as THREE.LineBasicMaterial).opacity = opacity;
    }
  });

  const points1 = useMemo(() => [
    new THREE.Vector3(-3, 0, 0),
    new THREE.Vector3(-1.5, 0.3, 0),
    new THREE.Vector3(0, 0, 0),
  ], []);

  const points2 = useMemo(() => [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(1.5, 0.3, 0),
    new THREE.Vector3(3, 0, 0),
  ], []);

  return (
    <>
      {/* @ts-expect-error - R3F intrinsic element types */}
      <line ref={lineRef1}>
        <bufferGeometry>
          {/* @ts-expect-error - R3F bufferAttribute typing */}
          <bufferAttribute
            attach="attributes-position"
            count={points1.length}
            array={new Float32Array(points1.flatMap(p => [p.x, p.y, p.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#4ECDC4" transparent opacity={0.15} />
      </line>
      {/* @ts-expect-error - R3F intrinsic element types */}
      <line ref={lineRef2}>
        <bufferGeometry>
          {/* @ts-expect-error - R3F bufferAttribute typing */}
          <bufferAttribute
            attach="attributes-position"
            count={points2.length}
            array={new Float32Array(points2.flatMap(p => [p.x, p.y, p.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#6495ED" transparent opacity={0.15} />
      </line>
    </>
  );
}

// Legend component
function Legend() {
  const items = [
    { label: 'Invoices', color: '#4ECDC4', symbol: '📄' },
    { label: 'Payments', color: '#6495ED', symbol: '💳' },
    { label: 'Financing', color: '#FFD700', symbol: '$' },
  ];

  return (
    <group position={[-5.5, -2.2, 0]}>
      {/* Background panel */}
      <mesh position={[0.9, 0.1, -0.1]}>
        <planeGeometry args={[2.4, 1.2]} />
        <meshBasicMaterial color="#0A1628" transparent opacity={0.7} />
      </mesh>
      {/* Border */}
      <mesh position={[0.9, 0.1, -0.05]}>
        <planeGeometry args={[2.5, 1.3]} />
        <meshBasicMaterial color="#1a2a40" transparent opacity={0.5} />
      </mesh>

      {items.map((item, i) => (
        <group key={item.label} position={[0, -i * 0.35 + 0.35, 0]}>
          {/* Dot */}
          <mesh position={[0.15, 0, 0]}>
            <circleGeometry args={[0.1, 16]} />
            <meshBasicMaterial color={item.color} />
          </mesh>
          {/* Glow */}
          <mesh position={[0.15, 0, -0.01]}>
            <circleGeometry args={[0.15, 16]} />
            <meshBasicMaterial color={item.color} transparent opacity={0.3} />
          </mesh>
          {/* Symbol */}
          <Text
            position={[0.15, 0, 0.01]}
            fontSize={0.08}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
          >
            {item.symbol}
          </Text>
          {/* Label */}
          <Text
            position={[0.45, 0, 0]}
            fontSize={0.16}
            color="#B4C7E7"
            anchorX="left"
            anchorY="middle"
          >
            {item.label}
          </Text>
        </group>
      ))}
    </group>
  );
}

export default function ParticleSystem() {
  return (
    <group>
      {/* Background particles */}
      <BackgroundParticles />

      {/* Zone labels */}
      <ZoneLabel position={[-4.5, 2.2, 0]} text="SUPPLIERS" color="#4ECDC4" delay={0} />
      <ZoneLabel position={[0, 2.2, 0]} text="BANKS" color="#FFD700" delay={1} />
      <ZoneLabel position={[4.5, 2.2, 0]} text="BUYERS" color="#6495ED" delay={2} />

      {/* Subtitle */}
      <Text position={[0, -2.5, 0]} fontSize={0.15} color="#B4C7E7" anchorX="center">
        Supply Chain Finance Ecosystem
      </Text>

      {/* Connection lines */}
      <ConnectionLines />

      {/* Legend */}
      <Legend />

      {/* Flow particles: Suppliers → Banks */}
      {[0, 0.25, 0.5, 0.75].map((offset, i) => (
        <FlowParticle
          key={`sb-${i}`}
          startX={-3.5}
          endX={-0.5}
          color="#4ECDC4"
          speed={0.5}
          offset={offset}
          yOffset={0.3 * (i % 2 === 0 ? 1 : -1)}
        />
      ))}

      {/* Flow particles: Banks → Buyers */}
      {[0, 0.25, 0.5, 0.75].map((offset, i) => (
        <FlowParticle
          key={`bb-${i}`}
          startX={0.5}
          endX={3.5}
          color="#6495ED"
          speed={0.5}
          offset={offset}
          yOffset={0.3 * (i % 2 === 0 ? 1 : -1)}
        />
      ))}

      {/* Money flow: Banks ↔ everywhere */}
      <MoneyFlow startX={-3} endX={0} speed={0.4} offset={0} yOffset={0.5} />
      <MoneyFlow startX={0} endX={3} speed={0.4} offset={0.5} yOffset={-0.3} />
      <MoneyFlow startX={-2} endX={2} speed={0.3} offset={0.25} yOffset={0} />

      {/* Ambient lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[-5, 2, 3]} intensity={0.3} color="#4ECDC4" />
      <pointLight position={[0, 2, 3]} intensity={0.3} color="#FFD700" />
      <pointLight position={[5, 2, 3]} intensity={0.3} color="#6495ED" />
    </group>
  );
}
