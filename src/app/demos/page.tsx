'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useDemoStore } from '@/stores/demoStore';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DemosPage() {
  const { demos, isInitialized, initializeDemos } = useDemoStore();

  useEffect(() => {
    initializeDemos();
  }, [initializeDemos]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-[var(--text-secondary)]">Loading demos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-16 px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <Link
          href="/"
          className="inline-block mb-8 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
        >
          ← Back to Home
        </Link>
        <h1 className="text-5xl md:text-6xl font-bold text-[var(--text-primary)] mb-4">
          Demo Gallery
        </h1>
        <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
          Select a presentation to explore SWIFT trade finance initiatives and concepts
        </p>
      </motion.div>

      {/* Demo grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {demos.map((demo, index) => (
          <motion.div key={demo.id} variants={item}>
            <Link href={`/demo/${demo.id}`}>
              <div className="group relative h-64 bg-[var(--bg-secondary)] rounded-2xl overflow-hidden border border-[var(--accent-cyan)]/20 hover:border-[var(--accent-cyan)]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--accent-cyan)]/10">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-gold)]/30 to-[var(--accent-cyan)]/30" />
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <defs>
                      <pattern
                        id={`grid-${index}`}
                        width="10"
                        height="10"
                        patternUnits="userSpaceOnUse"
                      >
                        <circle cx="1" cy="1" r="0.5" fill="currentColor" />
                      </pattern>
                    </defs>
                    <rect
                      width="100"
                      height="100"
                      fill={`url(#grid-${index})`}
                      className="text-[var(--accent-cyan)]"
                    />
                  </svg>
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-end p-6">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 text-xs font-medium text-[var(--accent-gold)] bg-[var(--accent-gold)]/10 rounded-full">
                      {demo.slides.length} slides
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2 group-hover:text-gradient-gold transition-colors">
                    {demo.title}
                  </h3>
                  <p className="text-[var(--text-secondary)] text-sm line-clamp-2">
                    {demo.description}
                  </p>

                  {/* Hover arrow */}
                  <motion.div
                    className="absolute top-6 right-6 text-[var(--accent-cyan)]"
                    initial={{ opacity: 0, x: -10 }}
                    whileHover={{ opacity: 1, x: 0 }}
                  >
                    <svg
                      className="w-6 h-6 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </motion.div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}

        {/* Add new demo card */}
        <motion.div variants={item}>
          <Link href="/admin/create">
            <div className="group h-64 bg-[var(--bg-tertiary)]/50 rounded-2xl border-2 border-dashed border-[var(--text-muted)]/30 hover:border-[var(--accent-gold)]/50 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-[var(--accent-gold)]/10 flex items-center justify-center mb-4 group-hover:bg-[var(--accent-gold)]/20 transition-colors">
                <svg
                  className="w-8 h-8 text-[var(--accent-gold)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <p className="text-[var(--text-secondary)] font-medium">
                Create New Demo
              </p>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Add slides manually
              </p>
            </div>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
