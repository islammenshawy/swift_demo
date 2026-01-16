'use client';

import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useDemoStore } from '@/stores/demoStore';
import { Demo } from '@/types/demo';
import PresentationContainer from '@/components/presentation/PresentationContainer';
import PresentationModeEntry from '@/components/presentation/PresentationModeEntry';

function DemoContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const demoId = params.demoId as string;

  const { getDemoById, demos, isInitialized, initializeDemos } = useDemoStore();

  const [demo, setDemo] = useState<Demo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [presentationMode, setPresentationMode] = useState(false);
  const [initialSlide, setInitialSlide] = useState(0);

  useEffect(() => {
    // Initialize store if needed
    if (!isInitialized) {
      initializeDemos();
    }
  }, [isInitialized, initializeDemos]);

  useEffect(() => {
    if (!isInitialized) return;

    const loadedDemo = getDemoById(demoId);
    setDemo(loadedDemo || null);
    setIsLoading(false);

    // Check for slide param in URL
    const slideParam = searchParams.get('slide');
    if (slideParam) {
      const slideIndex = parseInt(slideParam, 10) - 1; // URL uses 1-based index
      if (!isNaN(slideIndex) && slideIndex >= 0) {
        setInitialSlide(slideIndex);
        setPresentationMode(true); // Auto-start if coming from URL with slide param
      }
    }

    // Check for mode param
    const modeParam = searchParams.get('mode');
    if (modeParam === 'present') {
      setPresentationMode(true);
    }
  }, [demoId, searchParams, isInitialized, getDemoById]);

  const handleStartPresentation = (fullscreen: boolean) => {
    setPresentationMode(true);
    // Update URL to include mode param
    router.replace(`/demo/${demoId}?mode=present&slide=1`, { scroll: false });
  };

  if (isLoading || !isInitialized) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-[var(--accent-gold)] border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-[var(--text-secondary)]">Loading presentation...</p>
        </motion.div>
      </div>
    );
  }

  if (!demo) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <div className="text-6xl mb-6">🔍</div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
            Demo Not Found
          </h1>
          <p className="text-[var(--text-secondary)] mb-8">
            The presentation "{demoId}" doesn't exist or has been removed.
          </p>

          <div className="space-y-4">
            <h3 className="text-lg text-[var(--text-primary)] mb-4">
              Available Demos:
            </h3>
            {demos.slice(0, 5).map((d) => (
              <Link
                key={d.id}
                href={`/demo/${d.id}`}
                className="block p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--accent-cyan)]/20 hover:border-[var(--accent-cyan)]/50 transition-colors"
              >
                <h4 className="text-[var(--text-primary)] font-medium">
                  {d.title}
                </h4>
                <p className="text-sm text-[var(--text-muted)]">
                  {d.slides.length} slides
                </p>
              </Link>
            ))}
          </div>

          <Link
            href="/"
            className="inline-block mt-8 px-6 py-3 rounded-full gradient-gold text-[var(--bg-primary)] font-medium hover:opacity-90 transition-opacity"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  // Show entry screen first, unless already in presentation mode
  if (!presentationMode) {
    return (
      <PresentationModeEntry demo={demo} onStart={handleStartPresentation} />
    );
  }

  return <PresentationContainer demo={demo} initialSlide={initialSlide} />;
}

export default function DemoPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-screen flex items-center justify-center bg-[var(--bg-primary)]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 border-4 border-[var(--accent-gold)] border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-[var(--text-secondary)]">Loading...</p>
          </motion.div>
        </div>
      }
    >
      <DemoContent />
    </Suspense>
  );
}
