'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Line, Ring } from '@react-three/drei';
import * as THREE from 'three';

// Major banking hubs - evenly distributed every ~45 degrees longitude
const bankingHubs = [
  { name: 'NY', lat: 40, lon: -75, label: '$' },
  { name: 'LON', lat: 45, lon: 0, label: '£' },
  { name: 'DXB', lat: 25, lon: 55, label: '$' },
  { name: 'SGP', lat: 5, lon: 105, label: '$' },
  { name: 'TKY', lat: 35, lon: 140, label: '¥' },
  { name: 'SYD', lat: -30, lon: 150, label: '$' },
  { name: 'SAO', lat: -25, lon: -45, label: '$' },
  { name: 'JHB', lat: -25, lon: 30, label: '$' },
  { name: 'LA', lat: 35, lon: -120, label: '$' },
  { name: 'HK', lat: 20, lon: -170, label: '$' },
  { name: 'MUM', lat: -5, lon: 75, label: '₹' },
  { name: 'MEX', lat: 20, lon: -100, label: '$' },
];

// Suppliers - evenly distributed around globe
const supplierNodes = [
  { name: 'S1', lat: 30, lon: -60 },
  { name: 'S2', lat: 40, lon: -15 },
  { name: 'S3', lat: 15, lon: 40 },
  { name: 'S4', lat: 25, lon: 90 },
  { name: 'S5', lat: 30, lon: 130 },
  { name: 'S6', lat: 10, lon: 170 },
  { name: 'S7', lat: -20, lon: -90 },
  { name: 'S8', lat: -35, lon: -30 },
  { name: 'S9', lat: -15, lon: 20 },
  { name: 'S10', lat: -10, lon: 65 },
  { name: 'S11', lat: -25, lon: 120 },
  { name: 'S12', lat: -40, lon: 175 },
];

// Buyers - evenly distributed around globe
const buyerNodes = [
  { name: 'B1', lat: 50, lon: -80 },
  { name: 'B2', lat: 55, lon: 15 },
  { name: 'B3', lat: 35, lon: 70 },
  { name: 'B4', lat: 45, lon: 120 },
  { name: 'B5', lat: 20, lon: 160 },
  { name: 'B6', lat: 15, lon: -140 },
  { name: 'B7', lat: -30, lon: -70 },
  { name: 'B8', lat: -20, lon: -10 },
  { name: 'B9', lat: -30, lon: 50 },
  { name: 'B10', lat: -15, lon: 100 },
  { name: 'B11', lat: -35, lon: 145 },
  { name: 'B12', lat: -45, lon: -160 },
];

function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function Globe() {
  const globeRef = useRef<THREE.Group>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const innerGlowRef = useRef<THREE.Mesh>(null);

  // Shader for gradient globe surface
  const globeShader = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec2 vUv;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec2 vUv;

      void main() {
        // Ocean base color with depth gradient
        vec3 deepOcean = vec3(0.02, 0.08, 0.18);
        vec3 shallowOcean = vec3(0.05, 0.15, 0.3);

        // Create bands/regions for visual interest
        float lat = vPosition.y / 2.0;
        float lon = atan(vPosition.x, vPosition.z);

        // Stylized continent-like regions
        float continent1 = smoothstep(0.3, 0.35, sin(lon * 2.0 + 1.0) * cos(lat * 3.0));
        float continent2 = smoothstep(0.4, 0.45, sin(lon * 3.0 - 2.0) * sin(lat * 2.5 + 0.5));
        float continent3 = smoothstep(0.35, 0.4, cos(lon * 2.5 + 1.5) * cos(lat * 2.0 - 0.3));

        float landMass = max(max(continent1, continent2), continent3) * 0.6;

        // Land colors
        vec3 land = vec3(0.08, 0.2, 0.15);
        vec3 landHighlight = vec3(0.1, 0.25, 0.18);

        // Mix ocean and land
        vec3 surface = mix(mix(deepOcean, shallowOcean, 0.5 + lat * 0.5),
                          mix(land, landHighlight, lat * 0.5 + 0.5), landMass);

        // Add rim lighting effect
        float rimLight = 1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0)));
        rimLight = pow(rimLight, 2.0);
        vec3 rimColor = vec3(0.1, 0.4, 0.6);

        // Final color
        vec3 finalColor = surface + rimColor * rimLight * 0.4;

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `,
  }), []);

  useFrame((state) => {
    if (atmosphereRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
      atmosphereRef.current.scale.setScalar(pulse);
    }
    if (innerGlowRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 0.8 + 1) * 0.015;
      innerGlowRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={globeRef}>
      {/* Outer atmosphere glow - cyan tint */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[2.25, 64, 64]} />
        <meshBasicMaterial
          color="#00D4FF"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Second atmosphere layer */}
      <mesh>
        <sphereGeometry args={[2.18, 64, 64]} />
        <meshBasicMaterial
          color="#1a6a9a"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Inner glow layer */}
      <mesh ref={innerGlowRef}>
        <sphereGeometry args={[2.1, 64, 64]} />
        <meshBasicMaterial
          color="#2a8acc"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Main globe surface with shader */}
      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        <shaderMaterial
          vertexShader={globeShader.vertexShader}
          fragmentShader={globeShader.fragmentShader}
          uniforms={globeShader.uniforms}
        />
      </mesh>

      {/* Globe wireframe overlay - more visible */}
      <mesh>
        <sphereGeometry args={[2.008, 48, 48]} />
        <meshBasicMaterial
          color="#3a6a9c"
          wireframe
          transparent
          opacity={0.08}
        />
      </mesh>

      {/* Latitude lines - brighter */}
      {[-60, -30, 0, 30, 60].map((lat) => {
        const radius = 2.015;
        const y = radius * Math.sin((lat * Math.PI) / 180);
        const r = radius * Math.cos((lat * Math.PI) / 180);
        return (
          <mesh key={lat} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[r - 0.004, r + 0.004, 64]} />
            <meshBasicMaterial color="#4a9acc" transparent opacity={0.35} />
          </mesh>
        );
      })}

      {/* Longitude lines */}
      {[0, 30, 60, 90, 120, 150].map((lon) => (
        <mesh key={lon} rotation={[0, (lon * Math.PI) / 180, 0]}>
          <torusGeometry args={[2.015, 0.004, 8, 64]} />
          <meshBasicMaterial color="#4a9acc" transparent opacity={0.2} />
        </mesh>
      ))}

      {/* Equator highlight - gold accent */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.018, 2.032, 64]} />
        <meshBasicMaterial color="#C9A227" transparent opacity={0.5} />
      </mesh>

      {/* Prime meridian highlight */}
      <mesh>
        <torusGeometry args={[2.02, 0.006, 8, 64]} />
        <meshBasicMaterial color="#5aaacc" transparent opacity={0.35} />
      </mesh>

      {/* Polar caps hint */}
      <mesh position={[0, 1.85, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.7, 32]} />
        <meshBasicMaterial color="#a0d0e8" transparent opacity={0.15} />
      </mesh>
      <mesh position={[0, -1.85, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.7, 32]} />
        <meshBasicMaterial color="#a0d0e8" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

// Styled bank node with building icon
function BankNode({
  position,
  label,
  currencySymbol
}: {
  position: THREE.Vector3;
  label: string;
  currencySymbol: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (pulseRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.03;
      pulseRef.current.scale.setScalar(pulse);
    }
  });

  // Calculate rotation to face outward from globe center
  const normal = position.clone().normalize();
  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);

  const size = 0.12;

  return (
    <group ref={groupRef} position={position} quaternion={quaternion}>
      <group ref={pulseRef}>
        {/* Outer glow ring */}
        <mesh>
          <ringGeometry args={[size * 0.95, size * 1.1, 32]} />
          <meshBasicMaterial color="#FFD700" transparent opacity={0.5} />
        </mesh>

        {/* Background circle */}
        <mesh position={[0, 0, -0.001]}>
          <circleGeometry args={[size * 0.9, 32]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>

        {/* Bank building - base */}
        <mesh position={[0, -size * 0.15, 0]}>
          <boxGeometry args={[size * 0.7, size * 0.35, 0.01]} />
          <meshStandardMaterial color="#DAA520" emissive="#B8860B" emissiveIntensity={0.5} />
        </mesh>

        {/* Bank pillars */}
        {[-0.2, 0, 0.2].map((x, i) => (
          <mesh key={i} position={[x * size, size * 0.08, 0]}>
            <boxGeometry args={[size * 0.08, size * 0.3, 0.01]} />
            <meshStandardMaterial color="#DAA520" emissive="#B8860B" emissiveIntensity={0.5} />
          </mesh>
        ))}

        {/* Bank roof */}
        <mesh position={[0, size * 0.3, 0]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[size * 0.45, size * 0.18, 3]} />
          <meshStandardMaterial color="#FFD700" emissive="#DAA520" emissiveIntensity={0.6} />
        </mesh>

        {/* Currency symbol */}
        <Text
          position={[0, -size * 0.15, 0.015]}
          fontSize={size * 0.22}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {currencySymbol}
        </Text>
      </group>

      {/* City label */}
      <Text
        position={[0, -size * 1.3, 0.01]}
        fontSize={0.04}
        color="#FFD700"
        anchorX="center"
      >
        {label}
      </Text>
    </group>
  );
}

// Styled supplier node with factory icon
function SupplierNode({
  position,
  label
}: {
  position: THREE.Vector3;
  label: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (pulseRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2 + 1) * 0.02;
      pulseRef.current.scale.setScalar(pulse);
    }
  });

  const normal = position.clone().normalize();
  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);

  const size = 0.08;

  return (
    <group ref={groupRef} position={position} quaternion={quaternion}>
      <group ref={pulseRef}>
        {/* Outer glow ring */}
        <mesh>
          <ringGeometry args={[size * 0.9, size * 1.1, 32]} />
          <meshBasicMaterial color="#4ECDC4" transparent opacity={0.5} />
        </mesh>

        {/* Background circle */}
        <mesh position={[0, 0, -0.001]}>
          <circleGeometry args={[size * 0.85, 32]} />
          <meshStandardMaterial color="#0a1a1a" />
        </mesh>

        {/* Factory building */}
        <mesh position={[0, -size * 0.1, 0]}>
          <boxGeometry args={[size * 0.6, size * 0.4, 0.005]} />
          <meshStandardMaterial color="#2E8B7B" emissive="#4ECDC4" emissiveIntensity={0.4} />
        </mesh>

        {/* Factory chimney */}
        <mesh position={[-size * 0.15, size * 0.2, 0]}>
          <boxGeometry args={[size * 0.12, size * 0.35, 0.005]} />
          <meshStandardMaterial color="#2E8B7B" emissive="#4ECDC4" emissiveIntensity={0.4} />
        </mesh>

        {/* Smoke */}
        <mesh position={[-size * 0.15, size * 0.45, 0]}>
          <circleGeometry args={[size * 0.08, 12]} />
          <meshBasicMaterial color="#4ECDC4" transparent opacity={0.5} />
        </mesh>

        {/* Package icon */}
        <Text
          position={[size * 0.08, -size * 0.1, 0.01]}
          fontSize={size * 0.25}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          ▣
        </Text>
      </group>
    </group>
  );
}

// Styled buyer node with store icon
function BuyerNode({
  position,
  label
}: {
  position: THREE.Vector3;
  label: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (pulseRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2 + 2) * 0.02;
      pulseRef.current.scale.setScalar(pulse);
    }
  });

  const normal = position.clone().normalize();
  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);

  const size = 0.08;

  return (
    <group ref={groupRef} position={position} quaternion={quaternion}>
      <group ref={pulseRef}>
        {/* Outer glow ring */}
        <mesh>
          <ringGeometry args={[size * 0.9, size * 1.1, 32]} />
          <meshBasicMaterial color="#6495ED" transparent opacity={0.5} />
        </mesh>

        {/* Background circle */}
        <mesh position={[0, 0, -0.001]}>
          <circleGeometry args={[size * 0.85, 32]} />
          <meshStandardMaterial color="#0a0a1a" />
        </mesh>

        {/* Store building */}
        <mesh position={[0, -size * 0.05, 0]}>
          <boxGeometry args={[size * 0.55, size * 0.45, 0.005]} />
          <meshStandardMaterial color="#4169E1" emissive="#6495ED" emissiveIntensity={0.4} />
        </mesh>

        {/* Store awning/roof */}
        <mesh position={[0, size * 0.25, 0]}>
          <boxGeometry args={[size * 0.65, size * 0.1, 0.005]} />
          <meshStandardMaterial color="#6495ED" emissive="#87CEEB" emissiveIntensity={0.5} />
        </mesh>

        {/* Door */}
        <mesh position={[0, -size * 0.2, 0.003]}>
          <boxGeometry args={[size * 0.15, size * 0.2, 0.003]} />
          <meshStandardMaterial color="#1a1a3a" />
        </mesh>

        {/* Cart symbol */}
        <Text
          position={[0, size * 0.05, 0.01]}
          fontSize={size * 0.22}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          🛒
        </Text>
      </group>
    </group>
  );
}

// Animated dot with outline flowing along a path
function FlowDot({
  start,
  end,
  color,
  outlineColor,
  speed,
  offset,
  size = 0.035
}: {
  start: THREE.Vector3;
  end: THREE.Vector3;
  color: string;
  outlineColor?: string;
  speed: number;
  offset: number;
  size?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const curve = useMemo(() => {
    const midPoint = new THREE.Vector3()
      .addVectors(start, end)
      .multiplyScalar(0.5)
      .normalize()
      .multiplyScalar(2.5);
    return new THREE.QuadraticBezierCurve3(start, midPoint, end);
  }, [start, end]);

  useFrame((state) => {
    if (groupRef.current) {
      const t = ((state.clock.elapsedTime * speed * 0.12) + offset) % 1;
      const point = curve.getPoint(t);
      groupRef.current.position.copy(point);

      // Face camera
      groupRef.current.lookAt(0, 0, 0);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer glow ring */}
      <mesh>
        <ringGeometry args={[size * 1.2, size * 1.8, 16]} />
        <meshBasicMaterial
          color={outlineColor || color}
          transparent
          opacity={0.4}
        />
      </mesh>
      {/* Inner dot */}
      <mesh>
        <circleGeometry args={[size, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.2}
        />
      </mesh>
    </group>
  );
}

// Large animated $ with trail effect
function FlowMoney({
  start,
  end,
  speed,
  offset,
  size = 0.12
}: {
  start: THREE.Vector3;
  end: THREE.Vector3;
  speed: number;
  offset: number;
  size?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const trail1Ref = useRef<THREE.Group>(null);
  const trail2Ref = useRef<THREE.Group>(null);

  const curve = useMemo(() => {
    const midPoint = new THREE.Vector3()
      .addVectors(start, end)
      .multiplyScalar(0.5)
      .normalize()
      .multiplyScalar(2.8); // Higher arc for visibility
    return new THREE.QuadraticBezierCurve3(start, midPoint, end);
  }, [start, end]);

  useFrame((state) => {
    const baseT = ((state.clock.elapsedTime * speed * 0.1) + offset) % 1;

    // Main money symbol
    if (groupRef.current) {
      const point = curve.getPoint(baseT);
      groupRef.current.position.copy(point);
      groupRef.current.lookAt(0, 0, 0);
    }

    // Trail 1 (slightly behind)
    if (trail1Ref.current) {
      const t1 = (baseT - 0.04 + 1) % 1;
      const point1 = curve.getPoint(t1);
      trail1Ref.current.position.copy(point1);
      trail1Ref.current.lookAt(0, 0, 0);
    }

    // Trail 2 (further behind)
    if (trail2Ref.current) {
      const t2 = (baseT - 0.08 + 1) % 1;
      const point2 = curve.getPoint(t2);
      trail2Ref.current.position.copy(point2);
      trail2Ref.current.lookAt(0, 0, 0);
    }
  });

  return (
    <>
      {/* Trail particles */}
      <group ref={trail2Ref}>
        <mesh>
          <circleGeometry args={[size * 0.3, 12]} />
          <meshBasicMaterial color="#FFD700" transparent opacity={0.2} />
        </mesh>
      </group>
      <group ref={trail1Ref}>
        <mesh>
          <circleGeometry args={[size * 0.4, 12]} />
          <meshBasicMaterial color="#FFD700" transparent opacity={0.4} />
        </mesh>
      </group>

      {/* Main money symbol */}
      <group ref={groupRef}>
        {/* Outer glow pulse */}
        <mesh>
          <ringGeometry args={[size * 0.8, size * 1.0, 24]} />
          <meshBasicMaterial color="#FFD700" transparent opacity={0.6} />
        </mesh>
        {/* Inner glow */}
        <mesh>
          <circleGeometry args={[size * 0.75, 24]} />
          <meshBasicMaterial color="#FFFF00" transparent opacity={0.3} />
        </mesh>
        {/* Background circle */}
        <mesh>
          <circleGeometry args={[size * 0.6, 24]} />
          <meshStandardMaterial
            color="#DAA520"
            emissive="#FFD700"
            emissiveIntensity={1.5}
          />
        </mesh>
        {/* $ symbol - LARGE */}
        <Text
          position={[0, 0, 0.02]}
          fontSize={size * 0.7}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          $
        </Text>
      </group>
    </>
  );
}

function NetworkNodes() {
  const bankPositions = useMemo(() =>
    bankingHubs.map(hub => ({
      position: latLonToVector3(hub.lat, hub.lon, 2.12),
      name: hub.name,
      label: hub.label
    })),
  []);

  const supplierPositions = useMemo(() =>
    supplierNodes.map(node => ({
      position: latLonToVector3(node.lat, node.lon, 2.08),
      name: node.name
    })),
  []);

  const buyerPositions = useMemo(() =>
    buyerNodes.map(node => ({
      position: latLonToVector3(node.lat, node.lon, 2.08),
      name: node.name
    })),
  []);

  return (
    <>
      {/* Banks - Gold with currency symbols */}
      {bankPositions.map((bank, i) => (
        <BankNode
          key={`bank-${i}`}
          position={bank.position}
          label={bank.name}
          currencySymbol={bank.label}
        />
      ))}

      {/* Suppliers - Teal with factory icon */}
      {supplierPositions.map((supplier, i) => (
        <SupplierNode
          key={`supplier-${i}`}
          position={supplier.position}
          label={supplier.name}
        />
      ))}

      {/* Buyers - Blue with buyer icon */}
      {buyerPositions.map((buyer, i) => (
        <BuyerNode
          key={`buyer-${i}`}
          position={buyer.position}
          label={buyer.name}
        />
      ))}
    </>
  );
}

function Connections() {
  // Build relationship connections: Supplier → Bank → Buyer
  const connections = useMemo(() => {
    const conns: {
      start: THREE.Vector3;
      end: THREE.Vector3;
      type: 'supplier-bank' | 'bank-buyer' | 'bank-bank';
    }[] = [];

    // Find nearest bank for each supplier
    supplierNodes.forEach((supplier) => {
      const supplierPos = latLonToVector3(supplier.lat, supplier.lon, 2.05);
      let nearestBank = bankingHubs[0];
      let minDist = Infinity;

      bankingHubs.forEach((bank) => {
        const bankPos = latLonToVector3(bank.lat, bank.lon, 2.1);
        const dist = supplierPos.distanceTo(bankPos);
        if (dist < minDist) {
          minDist = dist;
          nearestBank = bank;
        }
      });

      conns.push({
        start: supplierPos,
        end: latLonToVector3(nearestBank.lat, nearestBank.lon, 2.1),
        type: 'supplier-bank'
      });
    });

    // Find nearest bank for each buyer
    buyerNodes.forEach((buyer) => {
      const buyerPos = latLonToVector3(buyer.lat, buyer.lon, 2.05);
      let nearestBank = bankingHubs[0];
      let minDist = Infinity;

      bankingHubs.forEach((bank) => {
        const bankPos = latLonToVector3(bank.lat, bank.lon, 2.1);
        const dist = buyerPos.distanceTo(bankPos);
        if (dist < minDist) {
          minDist = dist;
          nearestBank = bank;
        }
      });

      conns.push({
        start: latLonToVector3(nearestBank.lat, nearestBank.lon, 2.1),
        end: buyerPos,
        type: 'bank-buyer'
      });
    });

    // Bank-to-bank connections (interbank relationships)
    for (let i = 0; i < bankingHubs.length; i++) {
      for (let j = i + 1; j < bankingHubs.length; j++) {
        conns.push({
          start: latLonToVector3(bankingHubs[i].lat, bankingHubs[i].lon, 2.1),
          end: latLonToVector3(bankingHubs[j].lat, bankingHubs[j].lon, 2.1),
          type: 'bank-bank'
        });
      }
    }

    return conns;
  }, []);

  const curves = useMemo(() => {
    return connections.map((conn) => {
      const midPoint = new THREE.Vector3()
        .addVectors(conn.start, conn.end)
        .multiplyScalar(0.5)
        .normalize()
        .multiplyScalar(conn.type === 'bank-bank' ? 2.4 : 2.3);

      const curve = new THREE.QuadraticBezierCurve3(conn.start, midPoint, conn.end);

      return {
        points: curve.getPoints(25).map(p => [p.x, p.y, p.z] as [number, number, number]),
        type: conn.type,
        start: conn.start,
        end: conn.end
      };
    });
  }, [connections]);

  return (
    <group>
      {curves.map((curve, i) => (
        <group key={i}>
          {/* Connection lines - thick and visible */}
          <Line
            points={curve.points}
            color={
              curve.type === 'supplier-bank' ? '#4ECDC4' :
              curve.type === 'bank-buyer' ? '#6495ED' : '#FFD700'
            }
            lineWidth={curve.type === 'bank-bank' ? 3 : 2}
            transparent
            opacity={curve.type === 'bank-bank' ? 0.6 : 0.4}
          />
          {/* Secondary glow line for bank-bank */}
          {curve.type === 'bank-bank' && (
            <Line
              points={curve.points}
              color="#FFFF00"
              lineWidth={5}
              transparent
              opacity={0.15}
            />
          )}

          {/* Animated money flow - PROMINENT */}
          {curve.type === 'supplier-bank' && (
            <>
              <FlowDot start={curve.start} end={curve.end} color="#4ECDC4" outlineColor="#2E8B7B" speed={1.2} offset={i * 0.1} size={0.045} />
              <FlowDot start={curve.start} end={curve.end} color="#4ECDC4" outlineColor="#2E8B7B" speed={1.2} offset={i * 0.1 + 0.33} size={0.045} />
              <FlowDot start={curve.start} end={curve.end} color="#4ECDC4" outlineColor="#2E8B7B" speed={1.2} offset={i * 0.1 + 0.66} size={0.045} />
            </>
          )}

          {curve.type === 'bank-buyer' && (
            <>
              <FlowDot start={curve.start} end={curve.end} color="#6495ED" outlineColor="#4169E1" speed={1.1} offset={i * 0.12} size={0.045} />
              <FlowDot start={curve.start} end={curve.end} color="#6495ED" outlineColor="#4169E1" speed={1.1} offset={i * 0.12 + 0.33} size={0.045} />
              <FlowDot start={curve.start} end={curve.end} color="#6495ED" outlineColor="#4169E1" speed={1.1} offset={i * 0.12 + 0.66} size={0.045} />
            </>
          )}

          {/* Bank to Bank - LOTS of money flowing! */}
          {curve.type === 'bank-bank' && (
            <>
              <FlowMoney start={curve.start} end={curve.end} speed={0.9} offset={i * 0.05} size={0.15} />
              <FlowMoney start={curve.start} end={curve.end} speed={0.9} offset={i * 0.05 + 0.25} size={0.15} />
              <FlowMoney start={curve.start} end={curve.end} speed={0.9} offset={i * 0.05 + 0.5} size={0.15} />
              <FlowMoney start={curve.start} end={curve.end} speed={0.9} offset={i * 0.05 + 0.75} size={0.15} />
            </>
          )}
        </group>
      ))}
    </group>
  );
}

function Legend() {
  const iconSize = 0.1;

  return (
    <group position={[0, 3.3, 0]}>
      {/* Main background panel - encapsulates everything */}
      <mesh position={[0, 0.05, -0.08]}>
        <planeGeometry args={[5.2, 1.3]} />
        <meshBasicMaterial color="#0A1628" transparent opacity={0.9} />
      </mesh>
      {/* Border glow */}
      <mesh position={[0, 0.05, -0.09]}>
        <planeGeometry args={[5.3, 1.4]} />
        <meshBasicMaterial color="#1a3a5c" transparent opacity={0.5} />
      </mesh>
      {/* Top accent line */}
      <mesh position={[0, 0.68, -0.07]}>
        <planeGeometry args={[5.0, 0.02]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.6} />
      </mesh>
      {/* Bottom accent line */}
      <mesh position={[0, -0.58, -0.07]}>
        <planeGeometry args={[5.0, 0.02]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.6} />
      </mesh>

      {/* Title at top */}
      <Text
        position={[0, 0.42, 0]}
        fontSize={0.3}
        color="#FFFFFF"
        anchorX="center"
        fontWeight="bold"
      >
        Global Trade Network
      </Text>
      <Text
        position={[0, 0.15, 0]}
        fontSize={0.12}
        color="#B4C7E7"
        anchorX="center"
      >
        Connecting Banks, Suppliers & Buyers Worldwide
      </Text>

      {/* Divider line */}
      <mesh position={[0, -0.02, -0.06]}>
        <planeGeometry args={[4.6, 0.008]} />
        <meshBasicMaterial color="#3a5a7c" transparent opacity={0.6} />
      </mesh>

      {/* Legend row below title */}
      <group position={[0, -0.28, 0]}>
        {/* Bank legend */}
        <group position={[-1.7, 0, 0]}>
          <mesh>
            <ringGeometry args={[iconSize * 0.85, iconSize * 1.0, 16]} />
            <meshBasicMaterial color="#FFD700" transparent opacity={0.8} />
          </mesh>
          <mesh>
            <circleGeometry args={[iconSize * 0.8, 16]} />
            <meshBasicMaterial color="#1a1a2e" />
          </mesh>
          <Text position={[0, 0, 0.01]} fontSize={iconSize * 0.55} color="#FFD700" anchorX="center" anchorY="middle" fontWeight="bold">$</Text>
          <Text position={[0.18, 0, 0]} fontSize={0.13} color="#FFD700" anchorX="left" fontWeight="bold">Banks</Text>
        </group>

        {/* Supplier legend */}
        <group position={[0, 0, 0]}>
          <mesh>
            <ringGeometry args={[iconSize * 0.8, iconSize * 0.95, 16]} />
            <meshBasicMaterial color="#4ECDC4" transparent opacity={0.7} />
          </mesh>
          <mesh>
            <circleGeometry args={[iconSize * 0.75, 16]} />
            <meshBasicMaterial color="#2E8B7B" />
          </mesh>
          <Text position={[0, 0, 0.01]} fontSize={iconSize * 0.45} color="#FFF" anchorX="center" anchorY="middle">▣</Text>
          <Text position={[0.16, 0, 0]} fontSize={0.13} color="#4ECDC4" anchorX="left" fontWeight="bold">Suppliers</Text>
        </group>

        {/* Buyer legend */}
        <group position={[1.7, 0, 0]}>
          <mesh>
            <ringGeometry args={[iconSize * 0.8, iconSize * 0.95, 16]} />
            <meshBasicMaterial color="#6495ED" transparent opacity={0.7} />
          </mesh>
          <mesh>
            <circleGeometry args={[iconSize * 0.75, 16]} />
            <meshBasicMaterial color="#4169E1" />
          </mesh>
          <Text position={[0, 0, 0.01]} fontSize={iconSize * 0.4} color="#FFF" anchorX="center" anchorY="middle">🛒</Text>
          <Text position={[0.16, 0, 0]} fontSize={0.13} color="#6495ED" anchorX="left" fontWeight="bold">Buyers</Text>
        </group>
      </group>
    </group>
  );
}

function RotatingGlobe() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      <Globe />
      <NetworkNodes />
      <Connections />
    </group>
  );
}

export default function GlobeNetwork() {
  return (
    <group>
      <RotatingGlobe />
      <Legend />
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={0.5} />
    </group>
  );
}
