'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Line, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// Bank building icon shape
function BankIcon({
  position,
  label,
  size = 0.4
}: {
  position: [number, number, number];
  label: string;
  size?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.02;
      groupRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group position={position}>
      <group ref={groupRef}>
        {/* Outer glow ring */}
        <mesh>
          <ringGeometry args={[size * 0.9, size * 1.0, 32]} />
          <meshBasicMaterial color="#DAA520" transparent opacity={0.6} />
        </mesh>

        {/* Background circle */}
        <mesh position={[0, 0, -0.01]}>
          <circleGeometry args={[size * 0.85, 32]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>

        {/* Bank building - base */}
        <mesh position={[0, -size * 0.15, 0]}>
          <boxGeometry args={[size * 0.7, size * 0.4, 0.02]} />
          <meshStandardMaterial color="#DAA520" emissive="#B8860B" emissiveIntensity={0.5} />
        </mesh>

        {/* Bank building - pillars */}
        {[-0.22, 0, 0.22].map((x, i) => (
          <mesh key={i} position={[x * size, size * 0.1, 0]}>
            <boxGeometry args={[size * 0.08, size * 0.35, 0.02]} />
            <meshStandardMaterial color="#DAA520" emissive="#B8860B" emissiveIntensity={0.5} />
          </mesh>
        ))}

        {/* Bank building - roof triangle */}
        <mesh position={[0, size * 0.35, 0]}>
          <coneGeometry args={[size * 0.45, size * 0.2, 3]} />
          <meshStandardMaterial color="#FFD700" emissive="#DAA520" emissiveIntensity={0.6} />
        </mesh>

        {/* $ symbol */}
        <Text
          position={[0, -size * 0.15, 0.02]}
          fontSize={size * 0.25}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          $
        </Text>
      </group>

      {/* Label */}
      <Text
        position={[0, -size - 0.08, 0]}
        fontSize={0.1}
        color="#DAA520"
        anchorX="center"
      >
        {label}
      </Text>
    </group>
  );
}

// Supplier/Factory icon
function SupplierIcon({
  position,
  label,
  size = 0.32
}: {
  position: [number, number, number];
  label: string;
  size?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2 + 1) * 0.02;
      groupRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group position={position}>
      <group ref={groupRef}>
        {/* Outer glow ring */}
        <mesh>
          <ringGeometry args={[size * 0.9, size * 1.0, 32]} />
          <meshBasicMaterial color="#4ECDC4" transparent opacity={0.5} />
        </mesh>

        {/* Background circle */}
        <mesh position={[0, 0, -0.01]}>
          <circleGeometry args={[size * 0.85, 32]} />
          <meshStandardMaterial color="#0a1a1a" />
        </mesh>

        {/* Factory building */}
        <mesh position={[0, -size * 0.1, 0]}>
          <boxGeometry args={[size * 0.6, size * 0.4, 0.02]} />
          <meshStandardMaterial color="#2E8B7B" emissive="#4ECDC4" emissiveIntensity={0.4} />
        </mesh>

        {/* Factory chimney 1 */}
        <mesh position={[-size * 0.15, size * 0.2, 0]}>
          <boxGeometry args={[size * 0.12, size * 0.3, 0.02]} />
          <meshStandardMaterial color="#2E8B7B" emissive="#4ECDC4" emissiveIntensity={0.4} />
        </mesh>

        {/* Factory chimney 2 */}
        <mesh position={[size * 0.12, size * 0.15, 0]}>
          <boxGeometry args={[size * 0.1, size * 0.2, 0.02]} />
          <meshStandardMaterial color="#2E8B7B" emissive="#4ECDC4" emissiveIntensity={0.4} />
        </mesh>

        {/* Smoke circles */}
        <mesh position={[-size * 0.15, size * 0.45, 0]}>
          <circleGeometry args={[size * 0.08, 16]} />
          <meshBasicMaterial color="#4ECDC4" transparent opacity={0.6} />
        </mesh>
        <mesh position={[-size * 0.08, size * 0.55, 0]}>
          <circleGeometry args={[size * 0.06, 16]} />
          <meshBasicMaterial color="#4ECDC4" transparent opacity={0.4} />
        </mesh>

        {/* Box/package icon inside */}
        <Text
          position={[0.05, -size * 0.1, 0.02]}
          fontSize={size * 0.2}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          ▣
        </Text>
      </group>

      {/* Label */}
      <Text
        position={[0, -size - 0.08, 0]}
        fontSize={0.09}
        color="#4ECDC4"
        anchorX="center"
      >
        {label}
      </Text>
    </group>
  );
}

// Buyer/Store icon
function BuyerIcon({
  position,
  label,
  size = 0.32
}: {
  position: [number, number, number];
  label: string;
  size?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2 + 2) * 0.02;
      groupRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group position={position}>
      <group ref={groupRef}>
        {/* Outer glow ring */}
        <mesh>
          <ringGeometry args={[size * 0.9, size * 1.0, 32]} />
          <meshBasicMaterial color="#6495ED" transparent opacity={0.5} />
        </mesh>

        {/* Background circle */}
        <mesh position={[0, 0, -0.01]}>
          <circleGeometry args={[size * 0.85, 32]} />
          <meshStandardMaterial color="#0a0a1a" />
        </mesh>

        {/* Store/building shape */}
        <mesh position={[0, -size * 0.05, 0]}>
          <boxGeometry args={[size * 0.55, size * 0.45, 0.02]} />
          <meshStandardMaterial color="#4169E1" emissive="#6495ED" emissiveIntensity={0.4} />
        </mesh>

        {/* Store roof/awning */}
        <mesh position={[0, size * 0.25, 0]}>
          <boxGeometry args={[size * 0.65, size * 0.1, 0.02]} />
          <meshStandardMaterial color="#6495ED" emissive="#87CEEB" emissiveIntensity={0.5} />
        </mesh>

        {/* Door */}
        <mesh position={[0, -size * 0.2, 0.01]}>
          <boxGeometry args={[size * 0.15, size * 0.25, 0.01]} />
          <meshStandardMaterial color="#1a1a3a" />
        </mesh>

        {/* Shopping cart symbol */}
        <Text
          position={[0, size * 0.05, 0.02]}
          fontSize={size * 0.22}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          🛒
        </Text>
      </group>

      {/* Label */}
      <Text
        position={[0, -size - 0.08, 0]}
        fontSize={0.09}
        color="#6495ED"
        anchorX="center"
      >
        {label}
      </Text>
    </group>
  );
}

// Large animated money/document with pulsing glow and trail
function FlowingMoney({
  path,
  type,
  speed = 1,
  offset = 0
}: {
  path: THREE.Vector3[];
  type: 'invoice' | 'payment' | 'credit';
  speed?: number;
  offset?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const outerGlowRef = useRef<THREE.Mesh>(null);
  const trail1Ref = useRef<THREE.Group>(null);
  const trail2Ref = useRef<THREE.Group>(null);
  const trail3Ref = useRef<THREE.Group>(null);
  const trail4Ref = useRef<THREE.Group>(null);
  const curve = useMemo(() => new THREE.CatmullRomCurve3(path), [path]);

  const config = {
    invoice: { symbol: '📄', color: '#4ECDC4', bgColor: '#2E8B7B', glowColor: '#4ECDC4', size: 0.13 },
    payment: { symbol: '$', color: '#6495ED', bgColor: '#4169E1', glowColor: '#6495ED', size: 0.15 },
    credit: { symbol: '$', color: '#DAA520', bgColor: '#8B7355', glowColor: '#DAA520', size: 0.16 },
  };

  const { symbol, color, bgColor, glowColor, size } = config[type];

  useFrame((state) => {
    // SLOWER speed - 0.05 instead of 0.12
    const baseT = ((state.clock.elapsedTime * speed * 0.05) + offset) % 1;

    if (groupRef.current) {
      const point = curve.getPoint(baseT);
      groupRef.current.position.copy(point);
    }

    // Pulsing glow effect
    if (glowRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.15;
      glowRef.current.scale.setScalar(pulse);
    }
    if (outerGlowRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      outerGlowRef.current.scale.setScalar(pulse);
    }

    // Trail particles - longer trail
    if (trail1Ref.current) {
      const t1 = (baseT - 0.03 + 1) % 1;
      trail1Ref.current.position.copy(curve.getPoint(t1));
    }
    if (trail2Ref.current) {
      const t2 = (baseT - 0.06 + 1) % 1;
      trail2Ref.current.position.copy(curve.getPoint(t2));
    }
    if (trail3Ref.current) {
      const t3 = (baseT - 0.09 + 1) % 1;
      trail3Ref.current.position.copy(curve.getPoint(t3));
    }
    if (trail4Ref.current) {
      const t4 = (baseT - 0.12 + 1) % 1;
      trail4Ref.current.position.copy(curve.getPoint(t4));
    }
  });

  return (
    <>
      {/* Trail particles - longer, fading */}
      <group ref={trail4Ref}>
        <mesh>
          <circleGeometry args={[size * 0.2, 12]} />
          <meshBasicMaterial color={color} transparent opacity={0.1} />
        </mesh>
      </group>
      <group ref={trail3Ref}>
        <mesh>
          <circleGeometry args={[size * 0.3, 12]} />
          <meshBasicMaterial color={color} transparent opacity={0.2} />
        </mesh>
      </group>
      <group ref={trail2Ref}>
        <mesh>
          <circleGeometry args={[size * 0.4, 12]} />
          <meshBasicMaterial color={color} transparent opacity={0.3} />
        </mesh>
      </group>
      <group ref={trail1Ref}>
        <mesh>
          <circleGeometry args={[size * 0.5, 12]} />
          <meshBasicMaterial color={color} transparent opacity={0.5} />
        </mesh>
      </group>

      {/* Main symbol */}
      <group ref={groupRef}>
        {/* Subtle outer glow */}
        <mesh ref={outerGlowRef}>
          <circleGeometry args={[size * 1.2, 24]} />
          <meshBasicMaterial color={glowColor} transparent opacity={0.08} />
        </mesh>
        {/* Glow ring - subtle pulse */}
        <mesh ref={glowRef}>
          <ringGeometry args={[size * 0.75, size * 0.9, 24]} />
          <meshBasicMaterial color={glowColor} transparent opacity={0.4} />
        </mesh>
        {/* Background circle */}
        <mesh>
          <circleGeometry args={[size * 0.7, 24]} />
          <meshStandardMaterial color={bgColor} emissive={color} emissiveIntensity={0.5} />
        </mesh>
        {/* Symbol */}
        <Text
          position={[0, 0, 0.01]}
          fontSize={size * 0.5}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          {symbol}
        </Text>
      </group>
    </>
  );
}

// Animated connection with glow effect
function AnimatedConnection({
  points,
  color,
  dashColor
}: {
  points: [number, number, number][];
  color: string;
  dashColor: string;
}) {
  return (
    <group>
      {/* Outer glow */}
      <Line
        points={points}
        color={dashColor}
        lineWidth={6}
        transparent
        opacity={0.1}
      />
      {/* Base line */}
      <Line
        points={points}
        color={color}
        lineWidth={3}
        transparent
        opacity={0.4}
      />
      {/* Bright center line */}
      <Line
        points={points}
        color={dashColor}
        lineWidth={1.5}
        transparent
        opacity={0.6}
      />
    </group>
  );
}

export default function DataStreams() {
  // Layout: Suppliers → Banks (multiple) → Buyers
  // With credit facilities flowing between banks

  const suppliers = [
    { pos: [-5.5, 1.4, 0] as [number, number, number], label: 'Supplier A' },
    { pos: [-5.5, 0, 0] as [number, number, number], label: 'Supplier B' },
    { pos: [-5.5, -1.4, 0] as [number, number, number], label: 'Supplier C' },
  ];

  const banks = [
    { pos: [-1.5, 1.0, 0] as [number, number, number], label: 'Bank 1' },
    { pos: [0, -0.2, 0] as [number, number, number], label: 'Bank 2' },
    { pos: [1.5, -1.0, 0] as [number, number, number], label: 'Bank 3' },
  ];

  const buyers = [
    { pos: [5.5, 1.4, 0] as [number, number, number], label: 'Buyer 1' },
    { pos: [5.5, 0, 0] as [number, number, number], label: 'Buyer 2' },
    { pos: [5.5, -1.4, 0] as [number, number, number], label: 'Buyer 3' },
  ];

  // Supplier → Bank paths (invoices)
  const supplierToBankPaths = useMemo(() => [
    [new THREE.Vector3(-5.0, 1.4, 0), new THREE.Vector3(-3.2, 1.2, 0), new THREE.Vector3(-2.0, 1.0, 0)],
    [new THREE.Vector3(-5.0, 0, 0), new THREE.Vector3(-2.5, -0.1, 0), new THREE.Vector3(-0.5, -0.2, 0)],
    [new THREE.Vector3(-5.0, -1.4, 0), new THREE.Vector3(-1.8, -1.2, 0), new THREE.Vector3(1.0, -1.0, 0)],
  ], []);

  // Bank → Bank paths (interbank / credit facilities)
  const bankToBankPaths = useMemo(() => [
    [new THREE.Vector3(-1.0, 0.9, 0), new THREE.Vector3(-0.5, 0.4, 0), new THREE.Vector3(-0.4, -0.1, 0)],
    [new THREE.Vector3(0.4, -0.3, 0), new THREE.Vector3(0.8, -0.6, 0), new THREE.Vector3(1.0, -0.9, 0)],
    [new THREE.Vector3(-1.0, 0.7, 0), new THREE.Vector3(0.2, 0.0, 0), new THREE.Vector3(1.0, -0.8, 0)],
  ], []);

  // Bank → Buyer paths (payments/approvals)
  const bankToBuyerPaths = useMemo(() => [
    [new THREE.Vector3(-1.0, 1.0, 0), new THREE.Vector3(2.2, 1.2, 0), new THREE.Vector3(5.0, 1.4, 0)],
    [new THREE.Vector3(0.5, -0.2, 0), new THREE.Vector3(2.8, -0.1, 0), new THREE.Vector3(5.0, 0, 0)],
    [new THREE.Vector3(2.0, -1.0, 0), new THREE.Vector3(3.5, -1.2, 0), new THREE.Vector3(5.0, -1.4, 0)],
  ], []);

  const pathToPoints = (path: THREE.Vector3[]): [number, number, number][] =>
    path.map(p => [p.x, p.y, p.z]);

  return (
    <group>
      {/* Title */}
      <Text position={[0, 2.6, 0]} fontSize={0.2} color="#FFFFFF" anchorX="center">
        Supply Chain Finance Network
      </Text>

      {/* Column Labels */}
      <Text position={[-5.5, 2.2, 0]} fontSize={0.12} color="#4ECDC4" anchorX="center">
        SUPPLIERS
      </Text>
      <Text position={[0, 2.2, 0]} fontSize={0.12} color="#FFD700" anchorX="center">
        BANKING NETWORK
      </Text>
      <Text position={[5.5, 2.2, 0]} fontSize={0.12} color="#6495ED" anchorX="center">
        BUYERS
      </Text>

      {/* Supplier Icons */}
      {suppliers.map((s, i) => (
        <SupplierIcon key={`s-${i}`} position={s.pos} label={s.label} size={0.35} />
      ))}

      {/* Bank Icons */}
      {banks.map((b, i) => (
        <BankIcon key={`b-${i}`} position={b.pos} label={b.label} size={0.45} />
      ))}

      {/* Buyer Icons */}
      {buyers.map((b, i) => (
        <BuyerIcon key={`by-${i}`} position={b.pos} label={b.label} size={0.35} />
      ))}

      {/* Flow: Supplier → Bank (invoices/documents) - SLOW */}
      {supplierToBankPaths.map((path, i) => (
        <group key={`stb-${i}`}>
          <AnimatedConnection points={pathToPoints(path)} color="#2E8B7B" dashColor="#4ECDC4" />
          <FlowingMoney path={path} type="invoice" speed={0.6} offset={0} />
          <FlowingMoney path={path} type="invoice" speed={0.6} offset={0.5} />
        </group>
      ))}

      {/* Flow: Bank ↔ Bank (credit facilities) - PROMINENT $ */}
      {bankToBankPaths.map((path, i) => (
        <group key={`btb-${i}`}>
          <AnimatedConnection points={pathToPoints(path)} color="#B8860B" dashColor="#FFD700" />
          <FlowingMoney path={path} type="credit" speed={0.5} offset={0.1 * i} />
          <FlowingMoney path={path} type="credit" speed={0.5} offset={0.1 * i + 0.33} />
          <FlowingMoney path={path} type="credit" speed={0.5} offset={0.1 * i + 0.66} />
        </group>
      ))}

      {/* Flow: Bank → Buyer (payments) - SLOW */}
      {bankToBuyerPaths.map((path, i) => (
        <group key={`bby-${i}`}>
          <AnimatedConnection points={pathToPoints(path)} color="#4169E1" dashColor="#6495ED" />
          <FlowingMoney path={path} type="payment" speed={0.55} offset={0.1 * i} />
          <FlowingMoney path={path} type="payment" speed={0.55} offset={0.1 * i + 0.5} />
        </group>
      ))}

      {/* Legend */}
      <group position={[0, -2.2, 0]}>
        {/* Invoice legend */}
        <group position={[-3.8, 0, 0]}>
          <mesh>
            <ringGeometry args={[0.05, 0.065, 16]} />
            <meshBasicMaterial color="#4ECDC4" />
          </mesh>
          <mesh>
            <circleGeometry args={[0.045, 16]} />
            <meshBasicMaterial color="#2E8B7B" />
          </mesh>
          <Text position={[0, 0, 0.01]} fontSize={0.035} color="#FFF" anchorX="center" anchorY="middle">📄</Text>
          <Text position={[0.15, 0, 0]} fontSize={0.08} color="#4ECDC4" anchorX="left">Invoices</Text>
        </group>

        {/* Credit legend */}
        <group position={[-1.2, 0, 0]}>
          <mesh>
            <ringGeometry args={[0.05, 0.065, 16]} />
            <meshBasicMaterial color="#FFD700" />
          </mesh>
          <mesh>
            <circleGeometry args={[0.045, 16]} />
            <meshBasicMaterial color="#B8860B" />
          </mesh>
          <Text position={[0, 0, 0.01]} fontSize={0.035} color="#FFF" anchorX="center" anchorY="middle">💳</Text>
          <Text position={[0.15, 0, 0]} fontSize={0.08} color="#FFD700" anchorX="left">Credit Facilities</Text>
        </group>

        {/* Payment legend */}
        <group position={[1.8, 0, 0]}>
          <mesh>
            <ringGeometry args={[0.05, 0.065, 16]} />
            <meshBasicMaterial color="#6495ED" />
          </mesh>
          <mesh>
            <circleGeometry args={[0.045, 16]} />
            <meshBasicMaterial color="#4169E1" />
          </mesh>
          <Text position={[0, 0, 0.01]} fontSize={0.035} color="#FFF" anchorX="center" anchorY="middle">$</Text>
          <Text position={[0.15, 0, 0]} fontSize={0.08} color="#6495ED" anchorX="left">Payments</Text>
        </group>
      </group>

      {/* Lighting */}
      <ambientLight intensity={0.8} />
      <pointLight position={[0, 5, 5]} intensity={0.4} />
    </group>
  );
}
