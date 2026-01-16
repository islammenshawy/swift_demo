import * as fs from 'fs';
import * as path from 'path';

// Dynamic import to avoid build issues
async function getEsbuild() {
  return await import('esbuild');
}

const STANDALONE_ENTRY = `
import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';

// Demo data will be injected here
const DEMO_DATA = __DEMO_DATA__;

// Visualization phase counts
const PHASE_COUNTS = {
  'module-consolidation': 5,
  'legacy-problems': 1,
  'technical-challenges': 1,
  'product-opportunities': 1,
  'transformation-goals': 1,
};

function getPhaseCount(slide) {
  if (slide.type === 'interactive' && slide.content.visualization) {
    return PHASE_COUNTS[slide.content.visualization] || 1;
  }
  return 1;
}

// Module Consolidation Visualization
function ModuleConsolidation({ phase }) {
  const [highlightedModule, setHighlightedModule] = useState(-1);

  const backendPlatforms = [
    { id: 'tps', name: 'Platform A', fullName: 'Trade System', icon: '🏦', color: '#00D4FF' },
    { id: 'apar', name: 'Platform B', fullName: 'Accounts Platform', icon: '💳', color: '#C9A227' },
  ];

  const duplicatedModules = [
    { name: 'Billing', icon: '🧾', color: '#00D4FF' },
    { name: 'Participation', icon: '🤝', color: '#C9A227' },
    { name: 'CIF', icon: '👥', color: '#10B981' },
    { name: 'Pricing', icon: '💰', color: '#8B5CF6' },
  ];

  useEffect(() => {
    if (phase === 1) {
      const timer = setInterval(() => {
        setHighlightedModule(prev => (prev + 1) % duplicatedModules.length);
      }, 500);
      return () => clearInterval(timer);
    } else {
      setHighlightedModule(-1);
    }
  }, [phase]);

  const showFrontend = phase >= 2;
  const showShared = phase >= 3;
  const isConsolidated = phase >= 4;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fff', marginBottom: '0.5rem' }}>
          {phase < 2 ? 'The Duplication Problem' : phase < 4 ? 'Introducing Unified Frontend & Shared Modules' : 'Consolidation Complete'}
        </h2>
        <p style={{ color: '#B4C7E7' }}>
          {phase < 2 ? 'Same modules duplicated across Platform A & Platform B systems' : phase < 4 ? 'Frontend connects to both platforms' : 'Single codebase • Reduced maintenance'}
        </p>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <AnimatePresence>
          {showFrontend && (
            <motion.div
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ padding: '1rem 2rem', background: 'rgba(16, 185, 129, 0.2)', border: '2px solid #10B981', borderRadius: '12px' }}
            >
              <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>🔄</span>
              <span style={{ color: '#10B981', fontWeight: 'bold' }}>Unified Frontend - Unified Entry Point</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ display: 'flex', gap: '3rem', marginTop: '1rem' }}>
          {backendPlatforms.map((platform, idx) => (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, x: idx === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0, scale: isConsolidated ? 0.9 : 1 }}
              transition={{ delay: idx * 0.2 }}
              style={{
                padding: '1.5rem',
                background: 'rgba(15, 31, 53, 0.8)',
                border: \`2px solid \${platform.color}50\`,
                borderRadius: '12px',
                minWidth: '200px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{platform.icon}</span>
                <span style={{ color: platform.color, fontWeight: 'bold' }}>{platform.name}</span>
              </div>

              {!showShared && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {duplicatedModules.map((mod, modIdx) => (
                    <motion.div
                      key={mod.name}
                      animate={{
                        scale: phase === 1 && highlightedModule === modIdx ? 1.1 : 1,
                        borderColor: phase === 1 && highlightedModule === modIdx ? '#ff6b6b' : mod.color + '50',
                      }}
                      style={{
                        padding: '0.5rem 0.75rem',
                        background: mod.color + '20',
                        border: '1px solid ' + mod.color + '50',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        color: '#fff',
                      }}
                    >
                      {mod.icon} {mod.name}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {showShared && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginTop: '1rem',
                padding: '1rem 2rem',
                background: 'rgba(139, 92, 246, 0.2)',
                border: '2px solid #8B5CF6',
                borderRadius: '12px',
              }}
            >
              <div style={{ color: '#8B5CF6', fontWeight: 'bold', marginBottom: '0.5rem' }}>Shared Modules</div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {duplicatedModules.map(mod => (
                  <div key={mod.name} style={{ padding: '0.5rem 0.75rem', background: mod.color + '20', borderRadius: '6px', fontSize: '0.75rem', color: '#fff' }}>
                    {mod.icon} {mod.name}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isConsolidated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ marginTop: '2rem', display: 'flex', gap: '2rem' }}
          >
            {[
              { label: 'Code Reduction', value: '40%', color: '#10B981' },
              { label: 'Maintenance', value: '-60%', color: '#00D4FF' },
              { label: 'Deploy Time', value: '-50%', color: '#C9A227' },
            ].map(metric => (
              <div key={metric.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: metric.color }}>{metric.value}</div>
                <div style={{ fontSize: '0.875rem', color: '#B4C7E7' }}>{metric.label}</div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Title Slide
function TitleSlide({ content }) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontSize: '4rem',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #C9A227, #00D4FF)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textAlign: 'center',
          marginBottom: '1.5rem',
        }}
      >
        {content.title}
      </motion.h1>
      {content.subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ fontSize: '1.5rem', color: '#B4C7E7', textAlign: 'center', maxWidth: '800px' }}
        >
          {content.subtitle}
        </motion.p>
      )}
    </div>
  );
}

// Content Slide
function ContentSlide({ content }) {
  return (
    <div style={{ width: '100%', height: '100%', padding: '4rem', display: 'flex', flexDirection: 'column' }}>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ fontSize: '2.5rem', color: '#00D4FF', marginBottom: '2rem' }}
      >
        {content.title}
      </motion.h2>
      {content.body && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ fontSize: '1.25rem', color: '#B4C7E7', lineHeight: 1.8, marginBottom: '2rem' }}
        >
          {content.body}
        </motion.p>
      )}
      {content.bullets && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {content.bullets.map((bullet, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * idx }}
              style={{ padding: '0.75rem 0', paddingLeft: '2rem', position: 'relative', color: '#B4C7E7', fontSize: '1.25rem' }}
            >
              <span style={{ position: 'absolute', left: 0, color: '#C9A227' }}>→</span>
              {bullet}
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Slide Renderer
function SlideRenderer({ slide, phase }) {
  if (slide.type === 'title') {
    return <TitleSlide content={slide.content} />;
  }
  if (slide.type === 'interactive' && slide.content.visualization === 'module-consolidation') {
    return <ModuleConsolidation phase={phase} />;
  }
  return <ContentSlide content={slide.content} />;
}

// Main Presentation App
function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [direction, setDirection] = useState(1);

  const slides = DEMO_DATA.slides;
  const totalPhases = getPhaseCount(slides[currentSlide]);

  const next = useCallback(() => {
    if (currentPhase < totalPhases - 1) {
      setCurrentPhase(prev => prev + 1);
      setDirection(1);
    } else if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
      setCurrentPhase(0);
      setDirection(1);
    }
  }, [currentSlide, currentPhase, totalPhases, slides.length]);

  const prev = useCallback(() => {
    if (currentPhase > 0) {
      setCurrentPhase(prev => prev - 1);
      setDirection(-1);
    } else if (currentSlide > 0) {
      const prevSlidePhases = getPhaseCount(slides[currentSlide - 1]);
      setCurrentSlide(prev => prev - 1);
      setCurrentPhase(prevSlidePhases - 1);
      setDirection(-1);
    }
  }, [currentSlide, currentPhase, slides]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          next();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prev();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [next, prev, toggleFullscreen]);

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  // Calculate total steps for progress
  let totalSteps = 0;
  let currentStep = 0;
  for (let i = 0; i < slides.length; i++) {
    const phases = getPhaseCount(slides[i]);
    if (i < currentSlide) {
      currentStep += phases;
    } else if (i === currentSlide) {
      currentStep += currentPhase + 1;
    }
    totalSteps += phases;
  }

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0A1628', overflow: 'hidden', position: 'relative', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Progress bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '4px', background: '#0F1F35', zIndex: 100 }}>
        <motion.div
          style={{ height: '100%', background: 'linear-gradient(90deg, #C9A227, #00D4FF)' }}
          animate={{ width: (currentStep / totalSteps * 100) + '%' }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Slide content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <SlideRenderer slide={slides[currentSlide]} phase={currentPhase} />
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div style={{
        position: 'fixed',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        background: 'rgba(15, 31, 53, 0.95)',
        padding: '0.75rem 1.5rem',
        borderRadius: '50px',
        border: '1px solid rgba(0, 212, 255, 0.3)',
        zIndex: 100,
      }}>
        <button onClick={prev} disabled={currentSlide === 0 && currentPhase === 0} style={navBtnStyle}>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 14l-4-4 4-4"/></svg>
        </button>
        <span style={{ color: '#6B7C93', fontSize: '0.875rem', minWidth: '60px', textAlign: 'center' }}>
          {currentStep} / {totalSteps}
        </span>
        <button onClick={next} disabled={currentSlide === slides.length - 1 && currentPhase === totalPhases - 1} style={navBtnStyle}>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 14l4-4-4-4"/></svg>
        </button>
        <div style={{ width: '1px', height: '24px', background: 'rgba(0, 212, 255, 0.3)' }} />
        <button onClick={toggleFullscreen} style={navBtnStyle}>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 8V4m0 0h4M4 4l5 5m7-1V4m0 0h-4m4 0l-5 5M4 10v4m0 0h4m-4 0l5-5m7 1v4m0 0h-4m4 0l-5-5"/>
          </svg>
        </button>
      </div>

      {/* Help text */}
      <div style={{ position: 'fixed', top: '1rem', right: '1rem', color: '#6B7C93', fontSize: '0.7rem', textAlign: 'right', zIndex: 100 }}>
        ← → Navigate | Space Next | F Fullscreen
      </div>
    </div>
  );
}

const navBtnStyle = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  border: '1px solid #00D4FF',
  background: 'transparent',
  color: '#B4C7E7',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

// Mount the app
const root = createRoot(document.getElementById('root'));
root.render(<App />);
`;

export async function buildStandaloneHtml(demoData: object): Promise<string> {
  // Replace the placeholder with actual demo data
  const entryCode = STANDALONE_ENTRY.replace('__DEMO_DATA__', JSON.stringify(demoData));

  // Write temporary entry file
  const tempEntry = path.join(process.cwd(), '.temp-standalone-entry.tsx');
  fs.writeFileSync(tempEntry, entryCode);

  try {
    // Bundle with esbuild (dynamic import)
    const esbuild = await getEsbuild();
    const result = await esbuild.build({
      entryPoints: [tempEntry],
      bundle: true,
      minify: true,
      format: 'iife',
      target: ['es2020'],
      write: false,
      jsx: 'automatic',
      jsxImportSource: 'react',
      define: {
        'process.env.NODE_ENV': '"production"',
      },
    });

    const bundledJs = result.outputFiles[0].text;

    // Create the HTML file
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${(demoData as any).title || 'Presentation'}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { overflow: hidden; }
    button:hover:not(:disabled) { background: #00D4FF !important; color: #0A1628 !important; }
    button:disabled { opacity: 0.3; cursor: not-allowed; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script>${bundledJs}</script>
</body>
</html>`;

    return html;
  } finally {
    // Clean up temp file
    if (fs.existsSync(tempEntry)) {
      fs.unlinkSync(tempEntry);
    }
  }
}
