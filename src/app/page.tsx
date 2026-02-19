'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
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
  const { data: session, status } = useSession();
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
          className="relative"
        >
          {/* Auth navigation */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute top-6 right-6 z-50 flex items-center gap-3"
          >
            {status === 'loading' ? (
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            ) : session ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-slate-300 hover:text-white text-sm font-medium transition"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </motion.div>

          <LandingScene onEnterPresentation={handleEnterPresentation} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
