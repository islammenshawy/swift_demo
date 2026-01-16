'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';

const LandingScene = dynamic(
  () => import('@/components/landing/LandingScene'),
  {
    ssr: false,
    loading: () => <LoadingScreen />
  }
);

function LoadingScreen() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-[var(--bg-primary)]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-[var(--accent-gold)] border-t-transparent rounded-full mx-auto mb-4"
        />
        <p className="text-[var(--text-secondary)]">Loading experience...</p>
      </motion.div>
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

  return <span>{time}</span>;
}

export default function Home() {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);

  const handleEnterPresentation = () => {
    setIsExiting(true);
    setTimeout(() => {
      router.push('/demo/swift-initiatives');
    }, 500);
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <LandingScene onEnterPresentation={handleEnterPresentation} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
