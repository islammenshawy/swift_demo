'use client';

import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Preload } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useLandingStore } from '@/stores/landingStore';
import ParticleSystem from './ParticleSystem';
import GlobeNetwork from './GlobeNetwork';
import DataStreams from './DataStreams';
import MinimalistMotion from './MinimalistMotion';
import AnimationSelector from './AnimationSelector';

function AnimationContent() {
  const { animationStyle } = useLandingStore();

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00D4FF" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#C9A227" />

      {/* Direct conditional rendering - AnimatePresence doesn't work with R3F */}
      {animationStyle === 'particles' && <ParticleSystem />}
      {animationStyle === 'globe' && <GlobeNetwork />}
      {animationStyle === 'dataStreams' && <DataStreams />}
      {animationStyle === 'minimalist' && <MinimalistMotion />}

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
      />
    </>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#C9A227" wireframe />
    </mesh>
  );
}

interface LandingSceneProps {
  onEnterPresentation: () => void;
}

export default function LandingScene({ onEnterPresentation }: LandingSceneProps) {
  const { setMousePosition, shouldExit } = useLandingStore();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [setMousePosition]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[var(--bg-primary)]">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={<LoadingFallback />}>
          <AnimationContent />
          <Preload all />
        </Suspense>
      </Canvas>

      {/* Overlay Content - positioned at edges to not block animation */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top bar - minimal */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="absolute top-0 left-0 right-0 flex justify-between items-start p-6 bg-gradient-to-b from-[var(--bg-primary)] to-transparent"
        >
          <div>
            <h1 className="text-2xl font-bold text-gradient-gold">Trade Finance Offsite Workshop</h1>
          </div>
          <div className="text-right">
            <div className="text-xl font-mono text-[var(--accent-cyan)]">
              <CurrentTime />
            </div>
          </div>
        </motion.div>

        {/* Bottom content area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/80 to-transparent pt-16 pb-8 px-8"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
              Supply Chain Finance
            </h2>
            <p className="text-sm md:text-base text-[var(--text-secondary)] mb-6">
              Connecting Buyers, Suppliers & Banks Globally
            </p>

            {/* Action buttons */}
            <div className="pointer-events-auto flex flex-col sm:flex-row gap-3 items-center justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onEnterPresentation}
                className="px-6 py-3 rounded-full gradient-gold text-[var(--bg-primary)] font-semibold text-sm shadow-lg hover:shadow-xl transition-shadow"
              >
                Start Presentation
              </motion.button>
              <motion.a
                href="/demos"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-full border border-[var(--accent-cyan)] text-[var(--accent-cyan)] font-semibold text-sm hover:bg-[var(--accent-cyan)]/10 transition-colors"
              >
                View Demos
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Animation selector */}
      <AnimationSelector />
    </div>
  );
}

function CurrentTime() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return <span>{time || '--:--:--'}</span>;
}
