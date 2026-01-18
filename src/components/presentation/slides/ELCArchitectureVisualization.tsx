'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const currentSteps = ['Pre-Registration', 'Registration', 'Data Input', 'Authorize', 'Pre-release', 'System Release'];
const proposedSteps = ['Registration', 'Booking', 'Review', 'Release'];

// Full SVG-based diagram matching the Lucid layout exactly
export function ELCArchitecture() {
  const [activeCurrentStep, setActiveCurrentStep] = useState(-1);
  const [activeProposedStep, setActiveProposedStep] = useState(-1);
  const [showTransform, setShowTransform] = useState(false);
  const [cycleComplete, setCycleComplete] = useState(false);

  // Zoom controls state
  const [zoom, setZoom] = useState(1);
  const [showControls, setShowControls] = useState(false);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Show controls on mouse move, hide after 2 seconds of inactivity
  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 2000);
  }, []);

  // Zoom handlers
  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => {
      const newZoom = Math.max(prev - 0.25, 0.5);
      if (newZoom <= 1) {
        setPanPosition({ x: 0, y: 0 });
      }
      return newZoom;
    });
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoom(1);
    setPanPosition({ x: 0, y: 0 });
  }, []);

  // Mouse wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      if (e.deltaY < 0) {
        handleZoomIn();
      } else {
        handleZoomOut();
      }
    }
  }, [handleZoomIn, handleZoomOut]);

  // Pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom > 1 && e.button === 0) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
    }
  }, [zoom, panPosition]);

  const handleMouseMoveForPan = useCallback((e: React.MouseEvent) => {
    handleMouseMove();
    if (isPanning && zoom > 1) {
      setPanPosition({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
  }, [isPanning, zoom, panStart, handleMouseMove]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  // Animation cycle: highlight current steps one by one, then transform, then proposed steps
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const runCycle = () => {
      // Reset
      setActiveCurrentStep(-1);
      setActiveProposedStep(-1);
      setShowTransform(false);
      setCycleComplete(false);

      // Animate through current steps (6 steps, 400ms each)
      currentSteps.forEach((_, i) => {
        timeout = setTimeout(() => setActiveCurrentStep(i), i * 400);
      });

      // Show transform arrow after current steps
      timeout = setTimeout(() => {
        setShowTransform(true);
      }, currentSteps.length * 400 + 200);

      // Animate through proposed steps
      proposedSteps.forEach((_, i) => {
        timeout = setTimeout(() => {
          setActiveProposedStep(i);
        }, currentSteps.length * 400 + 600 + i * 400);
      });

      // Mark cycle complete and pause
      timeout = setTimeout(() => {
        setCycleComplete(true);
      }, currentSteps.length * 400 + 600 + proposedSteps.length * 400 + 500);

      // Restart cycle after pause
      timeout = setTimeout(() => {
        runCycle();
      }, currentSteps.length * 400 + 600 + proposedSteps.length * 400 + 3000);
    };

    runCycle();

    return () => clearTimeout(timeout);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full flex flex-col p-4 overflow-hidden bg-[var(--bg-primary)]"
    >
      {/* Title */}
      <div className="text-center mb-2 mt-6">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">ELC Reimagined Ops Flow</h2>
        <p className="text-xs text-[var(--text-secondary)]">Maker-Checker Pattern with AI Augmentation</p>
      </div>

      {/* Transaction States - Animated Flow Comparison */}
      <div className="flex items-center justify-center gap-6 mb-3 px-4">
        {/* Current - 6 Steps */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-[var(--text-muted)] mb-1 font-medium">CURRENT (6 Steps)</span>
          <div className="flex items-center gap-1 px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-red-500/30">
            {currentSteps.map((step, i) => (
              <div key={step} className="flex items-center">
                <motion.span
                  className="text-[8px] px-1.5 py-0.5 rounded whitespace-nowrap"
                  animate={{
                    backgroundColor: activeCurrentStep >= i
                      ? 'rgba(239, 68, 68, 0.6)'
                      : 'rgba(239, 68, 68, 0.15)',
                    color: activeCurrentStep >= i ? '#ffffff' : '#f87171',
                    scale: activeCurrentStep === i ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {step}
                </motion.span>
                {i < currentSteps.length - 1 && (
                  <motion.span
                    className="mx-0.5 text-[10px]"
                    animate={{
                      color: activeCurrentStep > i ? '#ef4444' : '#f8717150',
                      scale: activeCurrentStep === i ? 1.3 : 1,
                    }}
                    transition={{ duration: 0.15 }}
                  >
                    →
                  </motion.span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Arrow showing transformation */}
        <motion.div
          className="flex flex-col items-center"
          animate={{
            opacity: showTransform ? 1 : 0.3,
            scale: showTransform && !cycleComplete ? 1.2 : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.span
            className="text-[var(--accent-gold)] text-2xl"
            animate={{
              x: showTransform && !cycleComplete ? [0, 5, 0] : 0,
            }}
            transition={{ duration: 0.4, repeat: showTransform && !cycleComplete ? 2 : 0 }}
          >
            ⟹
          </motion.span>
          <span className="text-[8px] text-[var(--accent-gold)]">Simplified</span>
        </motion.div>

        {/* Proposed - 4 Steps */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-[var(--accent-gold)] mb-1 font-medium">PROPOSED (4 Steps)</span>
          <div className="flex items-center gap-1 px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--accent-gold)]/50">
            {proposedSteps.map((step, i) => (
              <div key={step} className="flex items-center">
                <motion.span
                  className="text-[9px] px-2 py-0.5 rounded font-semibold whitespace-nowrap"
                  animate={{
                    backgroundColor: activeProposedStep >= i
                      ? 'rgba(201, 162, 39, 0.7)'
                      : 'rgba(201, 162, 39, 0.15)',
                    color: activeProposedStep >= i ? '#0A1628' : '#C9A227',
                    scale: activeProposedStep === i ? 1.15 : 1,
                    boxShadow: activeProposedStep === i
                      ? '0 0 12px rgba(201, 162, 39, 0.6)'
                      : '0 0 0px rgba(201, 162, 39, 0)',
                  }}
                  transition={{ duration: 0.25 }}
                >
                  {step}
                </motion.span>
                {i < proposedSteps.length - 1 && (
                  <motion.span
                    className="mx-0.5 text-[10px]"
                    animate={{
                      color: activeProposedStep > i ? '#C9A227' : '#C9A22750',
                      scale: activeProposedStep === i ? 1.3 : 1,
                    }}
                    transition={{ duration: 0.15 }}
                  >
                    →
                  </motion.span>
                )}
              </div>
            ))}
          </div>
          {/* Step reduction indicator */}
          <motion.div
            className="mt-1 text-[8px] text-[var(--accent-gold)] font-bold"
            animate={{
              opacity: cycleComplete ? 1 : 0,
              y: cycleComplete ? 0 : 5,
            }}
            transition={{ duration: 0.3 }}
          >
            ✓ 33% Fewer Steps
          </motion.div>
        </div>
      </div>

      {/* Main SVG Diagram */}
      <div
        ref={containerRef}
        className="flex-1 relative bg-[var(--bg-secondary)] rounded-lg border border-[var(--accent-cyan)]/20 overflow-hidden"
        onMouseMove={handleMouseMoveForPan}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{ cursor: zoom > 1 ? (isPanning ? 'grabbing' : 'grab') : 'default' }}
      >
        {/* Zoom Controls - appear on mouse move */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-3 right-3 z-10 flex items-center gap-2 bg-[var(--bg-primary)]/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-[var(--accent-cyan)]/30"
            >
              <button
                onClick={handleZoomOut}
                className="w-7 h-7 flex items-center justify-center rounded bg-[var(--bg-secondary)] hover:bg-[var(--accent-cyan)]/20 text-[var(--text-primary)] transition-colors"
                title="Zoom Out"
              >
                <span className="text-lg font-bold">−</span>
              </button>
              <span className="text-xs text-[var(--text-secondary)] min-w-[45px] text-center font-mono">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="w-7 h-7 flex items-center justify-center rounded bg-[var(--bg-secondary)] hover:bg-[var(--accent-cyan)]/20 text-[var(--text-primary)] transition-colors"
                title="Zoom In"
              >
                <span className="text-lg font-bold">+</span>
              </button>
              {zoom !== 1 && (
                <button
                  onClick={handleZoomReset}
                  className="ml-1 px-2 h-7 flex items-center justify-center rounded bg-[var(--bg-secondary)] hover:bg-[var(--accent-cyan)]/20 text-[var(--text-secondary)] text-xs transition-colors"
                  title="Reset Zoom"
                >
                  Reset
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Zoomable SVG container - transform applied here, SVG viewBox unchanged for export */}
        <div
          style={{
            transform: `scale(${zoom}) translate(${panPosition.x / zoom}px, ${panPosition.y / zoom}px)`,
            transformOrigin: 'center center',
            transition: isPanning ? 'none' : 'transform 0.2s ease-out',
            width: '100%',
            height: '100%'
          }}
        >
          <svg viewBox="-140 0 1450 700" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            {/* Arrow markers - larger for dashed lines (Yes/No) */}
            <marker id="arrow-cyan" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#00D4FF" />
            </marker>
            <marker id="arrow-gray" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#64748b" />
            </marker>
            <marker id="arrow-red" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#ef4444" />
            </marker>
            <marker id="arrow-gold" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#C9A227" />
            </marker>
            {/* Smaller arrows for solid lines */}
            <marker id="arrow-cyan-sm" markerWidth="5" markerHeight="5" refX="4" refY="2" orient="auto">
              <path d="M0,0 L0,4 L5,2 z" fill="#00D4FF" />
            </marker>
            <marker id="arrow-gray-sm" markerWidth="5" markerHeight="5" refX="4" refY="2" orient="auto">
              <path d="M0,0 L0,4 L5,2 z" fill="#64748b" />
            </marker>
            {/* Reverse arrows for bidirectional */}
            <marker id="arrow-gray-start" markerWidth="5" markerHeight="5" refX="1" refY="2" orient="auto">
              <path d="M5,0 L5,4 L0,2 z" fill="#64748b" />
            </marker>
          </defs>

          {/* ========== BACKGROUND LANES ========== */}
          {/* Lane boundaries: SM=-95-430 (525), HM=430-780 (350), SC=780-930 (150), HC=930-1200 (270) */}
          <rect x="-95" y="40" width="525" height="560" fill="#0F1F35" fillOpacity="0.3" />
          <rect x="430" y="40" width="350" height="560" fill="#0F1F35" fillOpacity="0.5" />
          <rect x="780" y="40" width="150" height="560" fill="#0F1F35" fillOpacity="0.3" />
          <rect x="930" y="40" width="270" height="560" fill="#0F1F35" fillOpacity="0.5" />

          {/* ========== LANE HEADERS ========== */}
          <rect x="-95" y="40" width="525" height="30" fill="#0A1628" stroke="#00D4FF" strokeOpacity="0.3" />
          <text x="168" y="60" textAnchor="middle" fill="#00D4FF" fontSize="11" fontWeight="600">🤖 System As Maker</text>

          <rect x="430" y="40" width="350" height="30" fill="#0A1628" stroke="#00D4FF" strokeOpacity="0.3" />
          <text x="605" y="60" textAnchor="middle" fill="#00D4FF" fontSize="11" fontWeight="600">👤 Human Maker</text>

          <rect x="780" y="40" width="150" height="30" fill="#0A1628" stroke="#00D4FF" strokeOpacity="0.3" />
          <text x="855" y="60" textAnchor="middle" fill="#00D4FF" fontSize="11" fontWeight="600">🔍 System As Checker</text>

          <rect x="930" y="40" width="270" height="30" fill="#0A1628" stroke="#00D4FF" strokeOpacity="0.3" />
          <text x="1065" y="60" textAnchor="middle" fill="#00D4FF" fontSize="11" fontWeight="600">👤 Human Checker</text>

          {/* ========== ROW LABELS (left of main boxes) ========== */}
          <text x="-115" y="120" fill="#B4C7E7" fontSize="8" fontWeight="500" writingMode="vertical-rl" textAnchor="middle">Registration</text>
          <text x="-115" y="270" fill="#B4C7E7" fontSize="8" fontWeight="500" writingMode="vertical-rl" textAnchor="middle">Extraction</text>
          <text x="-115" y="485" fill="#B4C7E7" fontSize="8" fontWeight="500" writingMode="vertical-rl" textAnchor="middle">Booking</text>

          {/* Grid lines - row separators */}
          <line x1="-95" y1="70" x2="1200" y2="70" stroke="#00D4FF" strokeOpacity="0.2" />
          <line x1="-95" y1="170" x2="1200" y2="170" stroke="#00D4FF" strokeOpacity="0.2" />
          <line x1="-95" y1="370" x2="1200" y2="370" stroke="#00D4FF" strokeOpacity="0.2" />
          <line x1="-95" y1="600" x2="1200" y2="600" stroke="#00D4FF" strokeOpacity="0.2" />
          {/* Lane dividers */}
          <line x1="-95" y1="40" x2="-95" y2="700" stroke="#00D4FF" strokeOpacity="0.2" />
          <line x1="430" y1="40" x2="430" y2="600" stroke="#00D4FF" strokeOpacity="0.15" />
          {/* Line at 780 - continuous through all rows */}
          <line x1="780" y1="40" x2="780" y2="600" stroke="#00D4FF" strokeOpacity="0.15" />
          {/* Line at 930 stops at Booking row (y=370) to merge SC and HC in row 3 */}
          <line x1="930" y1="40" x2="930" y2="370" stroke="#00D4FF" strokeOpacity="0.15" />
          {/* Right border of column 4 (Human Checker) */}
          <line x1="1200" y1="40" x2="1200" y2="600" stroke="#00D4FF" strokeOpacity="0.15" />

          {/* ========== REGISTRATION ROW ========== */}
          {/* Lane centers: SM=255, HM=565, SC=815, HC=1065 */}

          {/* Start (oval) - System Maker */}
          <ellipse cx="130" cy="120" rx="35" ry="18" fill="none" stroke="#4ECDC4" strokeWidth="2" />
          <text x="130" y="124" textAnchor="middle" fill="#4ECDC4" fontSize="10">Start</text>

          {/* Arrow: Start → Auto Registration */}
          <line x1="165" y1="120" x2="200" y2="120" stroke="#00D4FF" strokeWidth="1.5" markerEnd="url(#arrow-cyan-sm)" />

          {/* Auto Registration - System Maker */}
          <rect x="200" y="105" width="110" height="30" rx="4" fill="#0F1F35" stroke="#00D4FF" strokeWidth="1" />
          <text x="255" y="124" textAnchor="middle" fill="#fff" fontSize="9">Auto Registration</text>

          {/* Arrow: Auto Registration → Manual Registration (Failure) */}
          <path d="M310,120 L455,120" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="5,3" markerEnd="url(#arrow-red)" />
          <text x="320" y="112" fill="#ef4444" fontSize="8">Failure</text>

          {/* Manual Registration - Human Maker (centered in lane 430-700) */}
          <rect x="455" y="105" width="120" height="30" rx="4" fill="#0F1F35" stroke="#00D4FF" strokeWidth="1" />
          <text x="515" y="124" textAnchor="middle" fill="#fff" fontSize="9">Manual Registration</text>

          {/* Arrow: Manual Registration → Done (down to extraction) */}
          <path d="M515,135 L515,185" fill="none" stroke="#4ECDC4" strokeWidth="1" strokeDasharray="5,3" markerEnd="url(#arrow-cyan)" />
          <text x="520" y="148" fill="#4ECDC4" fontSize="8">Done</text>

          {/* Arrow: Auto Registration → Success (down to System Party Data Mapper) - routes along left edge within border */}
          <path d="M255,135 L255,148 L-88,148 L-88,471 L-45,471" fill="none" stroke="#4ECDC4" strokeWidth="1" strokeDasharray="5,3" markerEnd="url(#arrow-cyan)" />
          <text x="200" y="145" fill="#4ECDC4" fontSize="8">Success</text>

          {/* ========== EXTRACTION ROW - SYSTEM MAKER (x=-95-430) ========== */}

          {/* P1 - Parent group containing G1 (Classification/Extraction) and G2 (Checks) - 8a is OUTSIDE P1 */}
          <rect x="-70" y="225" width="430" height="110" rx="8" fill="#9333ea" fillOpacity="0.08" stroke="#9333ea" strokeWidth="2" strokeOpacity="0.5" />
          {/* P1 Label - inline on border */}
          <rect x="-50" y="218" width="155" height="14" rx="2" fill="#0A1628" />
          <text x="28" y="228" textAnchor="middle" fill="#9333ea" fontSize="9" fontWeight="600">P1: Extraction Engine (Sys)</text>

          {/* G1 - Classification/Extraction group box - positioned left of checks */}
          <rect x="-60" y="240" width="120" height="85" rx="4" fill="#0F1F35" stroke="#00D4FF" strokeWidth="1" />
          {/* AI indicator - partially overlapping circles at top right edge */}
          <circle cx="55" cy="243" r="5" fill="none" stroke="#4ECDC4" strokeWidth="1.5" />
          <circle cx="61" cy="243" r="5" fill="#4ECDC4" />
          <text x="0" y="258" textAnchor="middle" fill="#00D4FF" fontSize="8">• Classification</text>
          <text x="0" y="272" textAnchor="middle" fill="#00D4FF" fontSize="8">• Extraction</text>
          <rect x="-52" y="280" width="104" height="18" rx="3" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="3,2" />
          <circle cx="-42" cy="289" r="3" fill="#4ECDC4" />
          <text x="5" y="292" textAnchor="middle" fill="#B4C7E7" fontSize="6">Doc Classification</text>
          <rect x="-52" y="302" width="104" height="18" rx="3" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="3,2" />
          <circle cx="-42" cy="311" r="3" fill="#4ECDC4" />
          <text x="5" y="314" textAnchor="middle" fill="#B4C7E7" fontSize="6">Data Extraction</text>

          {/* Arrow from Classification/Extraction to Checks group */}
          <line x1="60" y1="285" x2="78" y2="285" stroke="#00D4FF" strokeWidth="1.5" markerEnd="url(#arrow-cyan-sm)" />

          {/* G2 - Checks flow - horizontal within System Maker lane */}
          <rect x="80" y="260" width="270" height="50" rx="4" fill="none" stroke="#00D4FF" strokeWidth="1" strokeOpacity="0.5" />

          {/* 5 - Sanctions */}
          <rect x="88" y="270" width="58" height="30" rx="3" fill="#0F1F35" stroke="#64748b" strokeWidth="1" strokeDasharray="3,2" />
          <text x="117" y="289" textAnchor="middle" fill="#fff" fontSize="7">Sanctions</text>
          {/* AI indicator - at top right edge */}
          <circle cx="141" cy="273" r="4" fill="none" stroke="#4ECDC4" strokeWidth="1" />
          <circle cx="146" cy="273" r="4" fill="#4ECDC4" />

          <line x1="146" y1="285" x2="155" y2="285" stroke="#00D4FF" strokeWidth="1" markerEnd="url(#arrow-cyan-sm)" />

          {/* 6 - Doc check */}
          <rect x="160" y="270" width="62" height="30" rx="3" fill="#0F1F35" stroke="#64748b" strokeWidth="1" strokeDasharray="3,2" />
          <text x="191" y="289" textAnchor="middle" fill="#fff" fontSize="7">Doc check</text>
          {/* AI indicator - at top right edge */}
          <circle cx="217" cy="273" r="4" fill="none" stroke="#4ECDC4" strokeWidth="1" />
          <circle cx="222" cy="273" r="4" fill="#4ECDC4" />

          <line x1="222" y1="285" x2="231" y2="285" stroke="#00D4FF" strokeWidth="1" markerEnd="url(#arrow-cyan-sm)" />

          {/* 7 - TBML */}
          <rect x="236" y="270" width="50" height="30" rx="3" fill="#0F1F35" stroke="#64748b" strokeWidth="1" strokeDasharray="3,2" />
          <text x="261" y="289" textAnchor="middle" fill="#fff" fontSize="7">TBML</text>
          {/* AI indicator - at top right edge */}
          <circle cx="281" cy="273" r="4" fill="none" stroke="#4ECDC4" strokeWidth="1" />
          <circle cx="286" cy="273" r="4" fill="#4ECDC4" />

          <line x1="286" y1="285" x2="295" y2="285" stroke="#00D4FF" strokeWidth="1" markerEnd="url(#arrow-cyan-sm)" />

          {/* 8 - Other */}
          <rect x="300" y="270" width="45" height="30" rx="3" fill="#0F1F35" stroke="#64748b" strokeWidth="1" strokeDasharray="3,2" />
          <text x="323" y="289" textAnchor="middle" fill="#fff" fontSize="7">Other</text>
          {/* AI indicator - at top right edge */}
          <circle cx="340" cy="273" r="4" fill="none" stroke="#4ECDC4" strokeWidth="1" />
          <circle cx="345" cy="273" r="4" fill="#4ECDC4" />

          {/* Arrow from checks group to Manual Review box */}
          <line x1="350" y1="285" x2="363" y2="285" stroke="#00D4FF" strokeWidth="1.5" markerEnd="url(#arrow-cyan-sm)" />

          {/* 8a - Manual Review box - right of checks group, INSIDE System Maker lane */}
          <rect x="365" y="265" width="55" height="32" rx="4" fill="#0F1F35" stroke="#00D4FF" strokeWidth="1" />
          <text x="393" y="278" textAnchor="middle" fill="#fff" fontSize="5" fontWeight="600">Manual</text>
          <text x="393" y="288" textAnchor="middle" fill="#fff" fontSize="5" fontWeight="600">Review</text>

          {/* Arrow from 8a (Manual Review) down to 21 (Agentic Maker) - routed below notes */}
          <path d="M393,297 L393,385 L127,385 L127,444" fill="none" stroke="#00D4FF" strokeWidth="1.5" markerEnd="url(#arrow-cyan-sm)" />

          {/* Yellow sticky notes - positioned below checks, same width, different heights */}

          {/* N1 - Under Doc check (component 6) - moved closer */}
          <rect x="155" y="302" width="70" height="50" rx="2" fill="#C9A227" />
          <text x="190" y="313" textAnchor="middle" fill="#0A1628" fontSize="4.5" fontWeight="600">Rules Review:</text>
          <text x="190" y="322" textAnchor="middle" fill="#0A1628" fontSize="4.5">Discrepancy,</text>
          <text x="190" y="331" textAnchor="middle" fill="#0A1628" fontSize="4.5">Consistency Check</text>
          <text x="190" y="340" textAnchor="middle" fill="#0A1628" fontSize="4.5">Full doc Check</text>

          {/* N2 - Under TBML (component 7) */}
          <rect x="232" y="302" width="50" height="38" rx="2" fill="#C9A227" />
          <text x="257" y="315" textAnchor="middle" fill="#0A1628" fontSize="4.5">DUO, HRG</text>
          <text x="257" y="325" textAnchor="middle" fill="#0A1628" fontSize="4.5">Vessel Check</text>
          <text x="257" y="335" textAnchor="middle" fill="#0A1628" fontSize="4.5">BL Tracking</text>

          {/* N3 - Under Other (component 8) - moved right */}
          <rect x="300" y="302" width="50" height="28" rx="2" fill="#C9A227" />
          <text x="325" y="315" textAnchor="middle" fill="#0A1628" fontSize="4.5">Boycott</text>
          <text x="325" y="326" textAnchor="middle" fill="#0A1628" fontSize="4.5">Emerging Risk</text>

          {/* N4 - On top of Manual Review box (component 8a) - overlays from top */}
          <rect x="365" y="240" width="60" height="28" rx="2" fill="#C9A227" />
          <text x="395" y="251" textAnchor="middle" fill="#0A1628" fontSize="4.5">Mandatory manual</text>
          <text x="395" y="262" textAnchor="middle" fill="#0A1628" fontSize="4.5">review needed</text>

          {/* ========== EXTRACTION ROW - HUMAN MAKER (x=430-700) ========== */}

          {/* P2 - Parent group containing G3 (Classification/Extraction) and G4 (Checks) */}
          <rect x="455" y="185" width="205" height="145" rx="8" fill="#9333ea" fillOpacity="0.08" stroke="#9333ea" strokeWidth="2" strokeOpacity="0.5" />
          {/* P2 Label - inline on border */}
          <rect x="475" y="178" width="140" height="14" rx="2" fill="#0A1628" />
          <text x="545" y="188" textAnchor="middle" fill="#9333ea" fontSize="9" fontWeight="600">P2: Extraction (Human)</text>

          {/* 9 - Classification/Extraction group - styled like group 4 */}
          <rect x="463" y="195" width="115" height="85" rx="4" fill="#0F1F35" stroke="#00D4FF" strokeWidth="1" />
          {/* AI indicator - at top right edge */}
          <circle cx="573" cy="198" r="5" fill="none" stroke="#4ECDC4" strokeWidth="1.5" />
          <circle cx="579" cy="198" r="5" fill="#4ECDC4" />
          <text x="520" y="213" textAnchor="middle" fill="#00D4FF" fontSize="8">• Classification</text>
          <text x="520" y="227" textAnchor="middle" fill="#00D4FF" fontSize="8">• Extraction</text>
          <rect x="471" y="235" width="100" height="18" rx="3" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="3,2" />
          <circle cx="481" cy="244" r="3" fill="#4ECDC4" />
          <text x="525" y="247" textAnchor="middle" fill="#B4C7E7" fontSize="6">Doc Classification</text>
          <rect x="471" y="257" width="100" height="18" rx="3" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="3,2" />
          <circle cx="481" cy="266" r="3" fill="#4ECDC4" />
          <text x="525" y="269" textAnchor="middle" fill="#B4C7E7" fontSize="6">Data Extraction</text>

          {/* Vertical checks in Human Maker - centered in P2 */}
          <rect x="583" y="195" width="60" height="20" rx="3" fill="#0F1F35" stroke="#64748b" strokeDasharray="3,2" />
          <text x="613" y="208" textAnchor="middle" fill="#fff" fontSize="7">Sanctions</text>
          {/* AI indicator - at top right edge */}
          <circle cx="638" cy="198" r="4" fill="none" stroke="#4ECDC4" strokeWidth="1" />
          <circle cx="643" cy="198" r="4" fill="#4ECDC4" />

          <line x1="613" y1="215" x2="613" y2="225" stroke="#00D4FF" strokeWidth="1" markerEnd="url(#arrow-cyan-sm)" />

          <rect x="583" y="230" width="60" height="20" rx="3" fill="#0F1F35" stroke="#64748b" strokeDasharray="3,2" />
          <text x="613" y="243" textAnchor="middle" fill="#fff" fontSize="7">Doc check</text>
          {/* AI indicator - at top right edge */}
          <circle cx="638" cy="233" r="4" fill="none" stroke="#4ECDC4" strokeWidth="1" />
          <circle cx="643" cy="233" r="4" fill="#4ECDC4" />

          <line x1="613" y1="250" x2="613" y2="260" stroke="#00D4FF" strokeWidth="1" markerEnd="url(#arrow-cyan-sm)" />

          <rect x="583" y="265" width="60" height="20" rx="3" fill="#0F1F35" stroke="#64748b" strokeDasharray="3,2" />
          <text x="613" y="278" textAnchor="middle" fill="#fff" fontSize="7">TBML</text>
          {/* AI indicator - at top right edge */}
          <circle cx="638" cy="268" r="4" fill="none" stroke="#4ECDC4" strokeWidth="1" />
          <circle cx="643" cy="268" r="4" fill="#4ECDC4" />

          <line x1="613" y1="285" x2="613" y2="295" stroke="#00D4FF" strokeWidth="1" markerEnd="url(#arrow-cyan-sm)" />

          <rect x="583" y="300" width="60" height="20" rx="3" fill="#0F1F35" stroke="#64748b" strokeDasharray="3,2" />
          <text x="613" y="313" textAnchor="middle" fill="#fff" fontSize="7">Other</text>
          {/* AI indicator - at top right edge */}
          <circle cx="638" cy="303" r="4" fill="none" stroke="#4ECDC4" strokeWidth="1" />
          <circle cx="643" cy="303" r="4" fill="#4ECDC4" />

          {/* Bidirectional arrow between P2 and Manual Validation (24) - centered on 24 */}
          <path d="M600,330 L600,470" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="5,3" markerStart="url(#arrow-gray-start)" markerEnd="url(#arrow-gray)" />
          <rect x="580" y="394" width="40" height="12" fill="#0A1628" />
          <text x="600" y="403" textAnchor="middle" fill="#64748b" fontSize="7">Embedded</text>

          {/* ========== EXTRACTION ROW - MERGED CHECKER (x=700-1200) ========== */}

          {/* P4 - Merged parent group spanning System Checker and Human Checker - moved right */}
          <rect x="800" y="192" width="320" height="145" rx="8" fill="#9333ea" fillOpacity="0.08" stroke="#9333ea" strokeWidth="2" strokeOpacity="0.5" />
          {/* P4 Label */}
          <rect x="810" y="185" width="140" height="14" rx="2" fill="#0A1628" />
          <text x="880" y="195" textAnchor="middle" fill="#9333ea" fontSize="8" fontWeight="600">P4: Checker Extraction</text>

          {/* G5 - Classification/Extraction group - centered left */}
          <rect x="810" y="200" width="115" height="85" rx="4" fill="#0F1F35" stroke="#00D4FF" strokeWidth="1" />
          {/* AI indicator - at top right edge */}
          <circle cx="920" cy="203" r="5" fill="none" stroke="#4ECDC4" strokeWidth="1.5" />
          <circle cx="926" cy="203" r="5" fill="#4ECDC4" />
          <text x="868" y="218" textAnchor="middle" fill="#00D4FF" fontSize="8">• Classification</text>
          <text x="868" y="232" textAnchor="middle" fill="#00D4FF" fontSize="8">• Extraction</text>
          <rect x="818" y="240" width="100" height="18" rx="3" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="3,2" />
          <circle cx="828" cy="249" r="3" fill="#4ECDC4" />
          <text x="872" y="252" textAnchor="middle" fill="#B4C7E7" fontSize="6">Doc Classification</text>
          <rect x="818" y="262" width="100" height="18" rx="3" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="3,2" />
          <circle cx="828" cy="271" r="3" fill="#4ECDC4" />
          <text x="872" y="274" textAnchor="middle" fill="#B4C7E7" fontSize="6">Data Extraction</text>

          {/* Bidirectional arrow between P4 and Agentic Checker (27) */}
          <path d="M900,337 L900,375 L825,375 L825,400" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="5,3" markerStart="url(#arrow-gray-start)" markerEnd="url(#arrow-gray)" />
          <rect x="840" y="350" width="40" height="12" fill="#0A1628" />
          <text x="860" y="359" textAnchor="middle" fill="#64748b" fontSize="7">Embedded</text>

          {/* G6 - Vertical checks - moved right with P4 */}
          <rect x="950" y="205" width="65" height="20" rx="3" fill="#0F1F35" stroke="#64748b" strokeDasharray="3,2" />
          <text x="983" y="218" textAnchor="middle" fill="#fff" fontSize="7">Sanctions</text>
          {/* AI indicator - at top right edge */}
          <circle cx="1010" cy="208" r="4" fill="none" stroke="#4ECDC4" strokeWidth="1" />
          <circle cx="1015" cy="208" r="4" fill="#4ECDC4" />

          <line x1="983" y1="225" x2="983" y2="235" stroke="#00D4FF" strokeWidth="1" markerEnd="url(#arrow-cyan-sm)" />

          <rect x="950" y="240" width="65" height="20" rx="3" fill="#0F1F35" stroke="#64748b" strokeDasharray="3,2" />
          <text x="983" y="253" textAnchor="middle" fill="#fff" fontSize="7">Doc check</text>
          {/* AI indicator - at top right edge */}
          <circle cx="1010" cy="243" r="4" fill="none" stroke="#4ECDC4" strokeWidth="1" />
          <circle cx="1015" cy="243" r="4" fill="#4ECDC4" />

          <line x1="983" y1="260" x2="983" y2="270" stroke="#00D4FF" strokeWidth="1" markerEnd="url(#arrow-cyan-sm)" />

          <rect x="950" y="275" width="65" height="20" rx="3" fill="#0F1F35" stroke="#64748b" strokeDasharray="3,2" />
          <text x="983" y="288" textAnchor="middle" fill="#fff" fontSize="7">TBML</text>
          {/* AI indicator - at top right edge */}
          <circle cx="1010" cy="278" r="4" fill="none" stroke="#4ECDC4" strokeWidth="1" />
          <circle cx="1015" cy="278" r="4" fill="#4ECDC4" />

          <line x1="983" y1="295" x2="983" y2="305" stroke="#00D4FF" strokeWidth="1" markerEnd="url(#arrow-cyan-sm)" />

          <rect x="950" y="310" width="65" height="20" rx="3" fill="#0F1F35" stroke="#64748b" strokeDasharray="3,2" />
          <text x="983" y="323" textAnchor="middle" fill="#fff" fontSize="7">Other</text>
          {/* AI indicator - at top right edge */}
          <circle cx="1010" cy="313" r="4" fill="none" stroke="#4ECDC4" strokeWidth="1" />
          <circle cx="1015" cy="313" r="4" fill="#4ECDC4" />

          {/* Yellow note - moved right with P4 */}
          <rect x="1040" y="220" width="70" height="50" rx="2" fill="#C9A227" />
          <text x="1075" y="232" textAnchor="middle" fill="#0A1628" fontSize="4.5">Read only Extraction</text>
          <text x="1075" y="243" textAnchor="middle" fill="#0A1628" fontSize="4.5">and validation data</text>
          <text x="1075" y="254" textAnchor="middle" fill="#0A1628" fontSize="4.5">embedded on TPS</text>
          <text x="1075" y="265" textAnchor="middle" fill="#0A1628" fontSize="4.5">screen</text>

          {/* Bidirectional arrow between P4 and Manual Checker (31) - enters left of top */}
          <path d="M1055,337 L1055,435" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="5,3" markerStart="url(#arrow-gray-start)" markerEnd="url(#arrow-gray)" />
          <rect x="1035" y="380" width="40" height="12" fill="#0A1628" />
          <text x="1055" y="389" textAnchor="middle" fill="#64748b" fontSize="7">Embedded</text>

          {/* ========== BOOKING ENGINE - SYSTEM MAKER (x=80-430) ========== */}

          {/* 19 - System Party Data Mapper - spaced out */}
          <rect x="-45" y="456" width="65" height="30" rx="4" fill="#0F1F35" stroke="#00D4FF" strokeWidth="1" />
          {/* AI indicator - at top right edge */}
          <circle cx="15" cy="459" r="4" fill="none" stroke="#4ECDC4" strokeWidth="1" />
          <circle cx="20" cy="459" r="4" fill="#4ECDC4" />
          <text x="-13" y="468" textAnchor="middle" fill="#fff" fontSize="5">System Party</text>
          <text x="-13" y="478" textAnchor="middle" fill="#fff" fontSize="5">Data Mapper</text>

          {/* Arrow: Mapper → Diamond */}
          <line x1="20" y1="471" x2="48" y2="471" stroke="#00D4FF" strokeWidth="1.5" markerEnd="url(#arrow-cyan-sm)" />

          {/* 20 - Diamond: All required fields mapped - spaced out */}
          <polygon points="50,471 75,451 100,471 75,491" fill="#0F1F35" stroke="#00D4FF" strokeWidth="1" />
          <text x="75" y="468" textAnchor="middle" fill="#fff" fontSize="4">All fields</text>
          <text x="75" y="476" textAnchor="middle" fill="#fff" fontSize="4">mapped?</text>

          {/* Yes arrow from diamond up to G1 (Classification/Extraction) - enters G1 from left */}
          <path d="M75,451 L75,375 L-83,375 L-83,290 L-60,290" fill="none" stroke="#4ECDC4" strokeWidth="1" strokeDasharray="5,3" markerEnd="url(#arrow-cyan)" />
          <text x="82" y="445" fill="#4ECDC4" fontSize="9" fontWeight="bold">Yes</text>

          {/* Arrow: Diamond 20 → Agentic Maker (21) */}
          <line x1="100" y1="471" x2="117" y2="471" stroke="#00D4FF" strokeWidth="1.5" markerEnd="url(#arrow-cyan-sm)" />

          {/* 21 - Agentic Maker - spaced out */}
          <rect x="117" y="446" width="65" height="50" rx="4" fill="#0F1F35" stroke="#00D4FF" strokeWidth="1" />
          {/* AI indicator - at top right edge */}
          <circle cx="177" cy="449" r="5" fill="none" stroke="#4ECDC4" strokeWidth="1.5" />
          <circle cx="183" cy="449" r="5" fill="#4ECDC4" />
          <text x="149" y="461" textAnchor="middle" fill="#fff" fontSize="5" fontWeight="600">Agentic Maker</text>
          <text x="149" y="471" textAnchor="middle" fill="#fff" fontSize="5" fontWeight="600">Booking &amp;</text>
          <text x="149" y="481" textAnchor="middle" fill="#fff" fontSize="5" fontWeight="600">Augmentation</text>

          {/* Yellow sticky: Call to Action - overlays 21 from bottom right */}
          <rect x="165" y="488" width="55" height="25" rx="2" fill="#C9A227" fillOpacity="0.9" />
          <text x="192" y="499" textAnchor="middle" fill="#0A1628" fontSize="4" fontWeight="600">Call to Action</text>
          <text x="192" y="508" textAnchor="middle" fill="#0A1628" fontSize="4">Reimagined screens</text>

          {/* Arrow: Agentic Maker → Accuracy diamond */}
          <line x1="182" y1="471" x2="208" y2="471" stroke="#00D4FF" strokeWidth="1.5" markerEnd="url(#arrow-cyan-sm)" />

          {/* 22 - Diamond: Accuracy less than threshold - spaced out */}
          <polygon points="210,471 235,451 260,471 235,491" fill="#0F1F35" stroke="#00D4FF" strokeWidth="1" />
          <text x="235" y="468" textAnchor="middle" fill="#fff" fontSize="4">Threshold</text>
          <text x="235" y="476" textAnchor="middle" fill="#fff" fontSize="4">check?</text>

          {/* Note for diamond 22 - positioned above diamond */}
          <rect x="210" y="410" width="50" height="30" rx="2" fill="#C9A227" />
          <text x="235" y="420" textAnchor="middle" fill="#0A1628" fontSize="3.5">Accuracy less</text>
          <text x="235" y="428" textAnchor="middle" fill="#0A1628" fontSize="3.5">than threshold</text>
          <text x="235" y="436" textAnchor="middle" fill="#0A1628" fontSize="3.5">or input reqd</text>

          {/* No arrow from diamond 20 down then to Human Maker - Party Data Input (routes under 26/30) - enters at top */}
          <path d="M75,491 L75,570 L442,570 L442,478 L450,478" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="5,3" markerEnd="url(#arrow-red)" />
          <text x="60" y="500" fill="#ef4444" fontSize="9" fontWeight="bold">No</text>

          {/* No from Accuracy (22) → to Manual checker required (25) - enters upper left edge */}
          <path d="M260,471 L290,471 L290,425 L660,425" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="5,3" markerEnd="url(#arrow-red)" />
          <text x="268" y="465" fill="#ef4444" fontSize="9" fontWeight="bold">No</text>

          {/* 26 - Release Workflow - moved up */}
          <rect x="300" y="490" width="55" height="30" rx="4" fill="#0F1F35" stroke="#00D4FF" strokeWidth="1" />
          <text x="327" y="509" textAnchor="middle" fill="#fff" fontSize="5">Release Workflow</text>

          {/* Arrow: Release Workflow → Release/End */}
          <line x1="355" y1="505" x2="367" y2="505" stroke="#00D4FF" strokeWidth="1.5" markerEnd="url(#arrow-cyan-sm)" />

          {/* 30 - Release/End (oval) - moved up */}
          <ellipse cx="395" cy="505" rx="28" ry="12" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="4,2" />
          <text x="395" y="508" textAnchor="middle" fill="#ef4444" fontSize="5">Release/End</text>

          {/* Yes from Accuracy → down to Human Maker (routes under 26/30) - enters at bottom */}
          <path d="M235,491 L235,560 L435,560 L435,492 L450,492" fill="none" stroke="#4ECDC4" strokeWidth="1" strokeDasharray="5,3" markerEnd="url(#arrow-cyan)" />
          <text x="240" y="500" fill="#4ECDC4" fontSize="9" fontWeight="bold">Yes</text>

          {/* ========== BOOKING ENGINE - HUMAN MAKER (x=430-700) ========== */}

          {/* Party Data Input - left side of HM lane */}
          <rect x="450" y="470" width="90" height="30" rx="4" fill="#0F1F35" stroke="#00D4FF" strokeWidth="1" />
          <text x="495" y="482" textAnchor="middle" fill="#fff" fontSize="6">Party Data Input/</text>
          <text x="495" y="492" textAnchor="middle" fill="#fff" fontSize="6">Data Lite Screen</text>

          {/* Arrow from 23 (Party Data Input) to G1 (Classification/Extraction) - exits top, enters G1 from left */}
          <path d="M495,470 L495,362 L-78,362 L-78,305 L-60,305" fill="none" stroke="#00D4FF" strokeWidth="1.5" markerEnd="url(#arrow-cyan-sm)" />

          {/* Manual Validation & Booking - center of HM lane */}
          <rect x="548" y="470" width="80" height="30" rx="4" fill="#0F1F35" stroke="#00D4FF" strokeWidth="1" />
          <text x="588" y="482" textAnchor="middle" fill="#fff" fontSize="6">Manual Validation</text>
          <text x="588" y="492" textAnchor="middle" fill="#fff" fontSize="6">&amp; Booking</text>

          {/* Arrow to Manual checker required diamond - exits from right of 24, enters lower left edge */}
          <path d="M628,485 L638,485 L638,455 L660,455" fill="none" stroke="#00D4FF" strokeWidth="1.5" markerEnd="url(#arrow-cyan-sm)" />

          {/* Diamond: Manual checker required - moved up and bigger */}
          <polygon points="648,440 673,410 698,440 673,470" fill="#0F1F35" stroke="#00D4FF" strokeWidth="1" />
          <text x="673" y="435" textAnchor="middle" fill="#fff" fontSize="5">Manual</text>
          <text x="673" y="445" textAnchor="middle" fill="#fff" fontSize="5">checker?</text>

          {/* Yellow note for component 25 - Manual checker required - on top of 25 */}
          <rect x="630" y="350" width="85" height="55" rx="2" fill="#C9A227" />
          <text x="672" y="360" textAnchor="middle" fill="#0A1628" fontSize="4">For high value transactions</text>
          <text x="672" y="368" textAnchor="middle" fill="#0A1628" fontSize="4">&amp; basis CIF standing</text>
          <text x="672" y="376" textAnchor="middle" fill="#0A1628" fontSize="4">instructions &amp; cover letter</text>
          <text x="672" y="384" textAnchor="middle" fill="#0A1628" fontSize="4" fontWeight="600">Mandatory 2nd level</text>
          <text x="672" y="392" textAnchor="middle" fill="#0A1628" fontSize="4" fontWeight="600">review required</text>

          {/* No arrow from Manual checker required (25) to Agentic Checker (27) - enters from left */}
          <path d="M673,470 L673,490 L770,490 L770,417 L785,417" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="5,3" markerEnd="url(#arrow-red)" />
          <text x="690" y="485" fill="#ef4444" fontSize="9" fontWeight="bold">No</text>

          {/* Yes arrow from Manual checker required (25) to Manual Checker (31) - goes to top right */}
          <path d="M698,440 L730,440 L730,385 L1085,385 L1085,435" fill="none" stroke="#4ECDC4" strokeWidth="1" strokeDasharray="5,3" markerEnd="url(#arrow-cyan)" />
          <text x="703" y="435" fill="#4ECDC4" fontSize="9" fontWeight="bold">Yes</text>

          {/* ========== BOOKING ENGINE - HUMAN CHECKER (x=930-1200) - All checker components moved here ========== */}

          {/* 27 - Agentic Checker - left of 28 */}
          <rect x="785" y="400" width="80" height="35" rx="4" fill="#0F1F35" stroke="#00D4FF" strokeWidth="1" />
          {/* AI indicator - at top right edge */}
          <circle cx="860" cy="403" r="5" fill="none" stroke="#4ECDC4" strokeWidth="1.5" />
          <circle cx="866" cy="403" r="5" fill="#4ECDC4" />
          <text x="825" y="420" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="600">Agentic Checker</text>

          {/* Arrow from Agentic Checker (27) to Accuracy diamond (28) */}
          <line x1="865" y1="417" x2="878" y2="417" stroke="#00D4FF" strokeWidth="1.5" markerEnd="url(#arrow-cyan-sm)" />

          {/* 28 - Diamond: Accuracy - between 27 and 29 */}
          <polygon points="880,417 910,392 940,417 910,442" fill="#0F1F35" stroke="#00D4FF" strokeWidth="1" />
          <text x="910" y="414" textAnchor="middle" fill="#fff" fontSize="5">Accuracy less</text>
          <text x="910" y="422" textAnchor="middle" fill="#fff" fontSize="5">than threshold</text>

          {/* 31 - Manual Checker - top right of 29 */}
          <rect x="1040" y="435" width="90" height="30" rx="4" fill="#0F1F35" stroke="#00D4FF" strokeWidth="1" />
          <text x="1085" y="454" textAnchor="middle" fill="#fff" fontSize="8">Manual Checker</text>

          {/* Arrow from Manual Checker (31) to Approve/Reject (29) - exits left, enters top */}
          <path d="M1040,450 L990,450 L990,460" fill="none" stroke="#00D4FF" strokeWidth="1.5" markerEnd="url(#arrow-cyan-sm)" />

          {/* Yes from Accuracy (28) to Manual Checker (31) - enters right of top */}
          <path d="M940,417 L1115,417 L1115,435" fill="none" stroke="#4ECDC4" strokeWidth="1" strokeDasharray="5,3" markerEnd="url(#arrow-cyan)" />
          <text x="948" y="410" fill="#4ECDC4" fontSize="9" fontWeight="bold">Yes</text>

          {/* No from Accuracy (28) bottom to Approve/Reject (29) - enters from left */}
          <path d="M910,442 L910,485 L960,485" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="5,3" markerEnd="url(#arrow-red)" />
          <text x="918" y="465" fill="#ef4444" fontSize="9" fontWeight="bold">No</text>

          {/* 29 - Approve/Reject diamond - centered in merged cell (SC+HC, row 3) */}
          <polygon points="960,485 990,460 1020,485 990,510" fill="#0F1F35" stroke="#00D4FF" strokeWidth="1" />
          <text x="990" y="488" textAnchor="middle" fill="#fff" fontSize="6">Approve/Reject</text>

          {/* Approve arrow from 29 (right) to Release Workflow (26) - enters from bottom */}
          <path d="M1020,485 L1050,485 L1050,545 L327,545 L327,520" fill="none" stroke="#4ECDC4" strokeWidth="1" strokeDasharray="5,3" markerEnd="url(#arrow-cyan)" />
          <text x="1030" y="478" fill="#4ECDC4" fontSize="9" fontWeight="bold">Approve</text>

          {/* Reject feedback (dashed loop back to Agentic Maker 21) - red dotted style */}
          <path d="M990,510 L990,580 L149,580 L149,498" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="5,3" markerEnd="url(#arrow-red)" />
          <text x="1000" y="525" fill="#ef4444" fontSize="9" fontWeight="bold">Reject</text>

          {/* Yellow note for rejection - on left of 29 reject line */}
          <rect x="920" y="520" width="65" height="38" rx="2" fill="#C9A227" />
          <text x="952" y="531" textAnchor="middle" fill="#0A1628" fontSize="4.5">Rejection Remarks</text>
          <text x="952" y="541" textAnchor="middle" fill="#0A1628" fontSize="4.5">act as feedback for</text>
          <text x="952" y="551" textAnchor="middle" fill="#0A1628" fontSize="4.5">Agentic Maker</text>

          {/* Arrow from merged cell (row 3) to Decision (32) - exits from right edge of cell */}
          <line x1="1200" y1="485" x2="1220" y2="485" stroke="#00D4FF" strokeWidth="1.5" markerEnd="url(#arrow-cyan-sm)" />

          {/* 32 - Decision diamond - outside row 3 column 4, to the right */}
          <polygon points="1220,485 1250,460 1280,485 1250,510" fill="#0F1F35" stroke="#00D4FF" strokeWidth="1" />
          <text x="1250" y="489" textAnchor="middle" fill="#fff" fontSize="8">Decision</text>

          {/* ========== COMMON SERVICES (Shared Layer - spans all lanes) ========== */}

          {/* Common Services background - spans full width with closed border */}
          <rect x="-95" y="600" width="1295" height="60" fill="#0F1F35" fillOpacity="0.6" stroke="#00D4FF" strokeOpacity="0.2" />

          {/* Common Services label on left */}
          <text x="-115" y="630" fill="#B4C7E7" fontSize="8" fontWeight="500" writingMode="vertical-rl" textAnchor="middle">Services</text>

          {/* Services spread across the full width */}
          <rect x="-53" y="608" width="80" height="38" rx="4" fill="#0F1F35" stroke="#64748b" strokeWidth="1" />
          <text x="-13" y="632" textAnchor="middle" fill="#B4C7E7" fontSize="9">CIF Module</text>

          <rect x="37" y="608" width="60" height="38" rx="4" fill="#0F1F35" stroke="#64748b" strokeWidth="1" />
          <text x="67" y="632" textAnchor="middle" fill="#B4C7E7" fontSize="9">KYC</text>

          <rect x="107" y="608" width="100" height="38" rx="4" fill="#0F1F35" stroke="#64748b" strokeWidth="1" />
          <text x="157" y="625" textAnchor="middle" fill="#B4C7E7" fontSize="8">Sanctions /</text>
          <text x="157" y="637" textAnchor="middle" fill="#B4C7E7" fontSize="8">Compliance</text>

          <rect x="217" y="608" width="80" height="38" rx="4" fill="#0F1F35" stroke="#64748b" strokeWidth="1" />
          <text x="257" y="632" textAnchor="middle" fill="#B4C7E7" fontSize="9">Payments</text>

          <rect x="307" y="608" width="80" height="38" rx="4" fill="#0F1F35" stroke="#64748b" strokeWidth="1" />
          <text x="347" y="632" textAnchor="middle" fill="#B4C7E7" fontSize="9">Trade APIs</text>

          {/* Connecting lines from services up to booking layer */}
          {/* 33 - CIF Module → System Party Data Mapper (straight arrow) */}
          <path d="M-13,608 L-13,488" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="4,3" markerEnd="url(#arrow-gray-sm)" />

          {/* ========== LEGEND (below services row - compact) ========== */}
          <rect x="430" y="668" width="150" height="22" rx="3" fill="#0A1628" stroke="#00D4FF" strokeOpacity="0.3" />
          {/* AI indicator - partially overlapping style */}
          <circle cx="443" cy="679" r="4" fill="none" stroke="#4ECDC4" strokeWidth="1" />
          <circle cx="448" cy="679" r="4" fill="#4ECDC4" />
          <text x="458" y="682" fill="#fff" fontSize="7">AI Powered</text>
          <rect x="520" y="674" width="10" height="10" rx="1" fill="#C9A227" />
          <text x="535" y="682" fill="#fff" fontSize="7">Note</text>

          {/* ========== DEBUG NUMBERS (HIDDEN) ========== */}
          <g opacity="0">
            {/* REGISTRATION ROW */}
            <circle cx="130" cy="100" r="8" fill="#ff0000" /><text x="130" y="104" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">1</text>
            <circle cx="255" cy="100" r="8" fill="#ff0000" /><text x="255" y="104" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">2</text>
            <circle cx="515" cy="100" r="8" fill="#ff0000" /><text x="515" y="104" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">3</text>

            {/* EXTRACTION ROW - System Maker */}
            <circle cx="0" cy="235" r="8" fill="#ff0000" /><text x="0" y="239" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">4</text>
            <circle cx="-60" cy="235" r="8" fill="#00aa00" /><text x="-60" y="239" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold">G1</text>
            <circle cx="80" cy="255" r="8" fill="#00aa00" /><text x="80" y="259" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold">G2</text>
            <circle cx="117" cy="265" r="6" fill="#ff0000" /><text x="117" y="268" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold">5</text>
            <circle cx="191" cy="265" r="6" fill="#ff0000" /><text x="191" y="268" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold">6</text>
            <circle cx="261" cy="265" r="6" fill="#ff0000" /><text x="261" y="268" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold">7</text>
            <circle cx="323" cy="265" r="6" fill="#ff0000" /><text x="323" y="268" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold">8</text>
            <circle cx="393" cy="260" r="6" fill="#ff0000" /><text x="393" y="263" textAnchor="middle" fill="#fff" fontSize="4" fontWeight="bold">8a</text>
            <circle cx="-70" cy="218" r="6" fill="#9333ea" /><text x="-70" y="221" textAnchor="middle" fill="#fff" fontSize="5" fontWeight="bold">P1</text>

            {/* EXTRACTION ROW - Human Maker */}
            <circle cx="520" cy="190" r="8" fill="#ff0000" /><text x="520" y="194" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">9</text>
            <circle cx="463" cy="190" r="8" fill="#00aa00" /><text x="463" y="194" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold">G3</text>
            <circle cx="620" cy="190" r="8" fill="#ff0000" /><text x="620" y="194" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold">10</text>
            <circle cx="620" cy="225" r="8" fill="#ff0000" /><text x="620" y="229" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold">11</text>
            <circle cx="620" cy="260" r="8" fill="#ff0000" /><text x="620" y="264" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold">12</text>
            <circle cx="620" cy="295" r="8" fill="#ff0000" /><text x="620" y="299" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold">13</text>
            <circle cx="590" cy="190" r="8" fill="#00aa00" /><text x="590" y="194" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold">G4</text>

            {/* EXTRACTION ROW - Merged Checker (P4) */}
            <circle cx="838" cy="195" r="8" fill="#ff0000" /><text x="838" y="199" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold">14</text>
            <circle cx="780" cy="195" r="8" fill="#00aa00" /><text x="780" y="199" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold">G5</text>
            <circle cx="953" cy="200" r="8" fill="#ff0000" /><text x="953" y="204" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold">15</text>
            <circle cx="953" cy="235" r="8" fill="#ff0000" /><text x="953" y="239" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold">16</text>
            <circle cx="953" cy="270" r="8" fill="#ff0000" /><text x="953" y="274" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold">17</text>
            <circle cx="953" cy="305" r="8" fill="#ff0000" /><text x="953" y="309" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold">18</text>
            <circle cx="920" cy="200" r="8" fill="#00aa00" /><text x="920" y="204" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold">G6</text>

            {/* BOOKING ENGINE - System Maker */}
            <circle cx="-13" cy="451" r="8" fill="#ff0000" /><text x="-13" y="455" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold">19</text>
            <circle cx="75" cy="446" r="8" fill="#ff0000" /><text x="75" y="450" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold">20</text>
            <circle cx="149" cy="415" r="8" fill="#ff0000" /><text x="149" y="419" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold">21</text>
            <circle cx="235" cy="446" r="8" fill="#ff0000" /><text x="235" y="450" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold">22</text>
            <circle cx="327" cy="485" r="8" fill="#ff0000" /><text x="327" y="489" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold">26</text>
            <circle cx="395" cy="488" r="8" fill="#ff0000" /><text x="395" y="492" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold">30</text>

            {/* BOOKING ENGINE - Human Maker */}
            <circle cx="495" cy="465" r="8" fill="#ff0000" /><text x="495" y="469" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold">23</text>
            <circle cx="588" cy="465" r="8" fill="#ff0000" /><text x="588" y="469" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold">24</text>
            <circle cx="673" cy="405" r="8" fill="#ff0000" /><text x="673" y="409" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold">25</text>

            {/* BOOKING ENGINE - Merged SC+HC column */}
            <circle cx="825" cy="395" r="8" fill="#ff0000" /><text x="825" y="399" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold">27</text>
            <circle cx="910" cy="387" r="8" fill="#ff0000" /><text x="910" y="391" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold">28</text>
            <circle cx="1085" cy="430" r="8" fill="#ff0000" /><text x="1085" y="434" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold">31</text>
            <circle cx="990" cy="455" r="8" fill="#ff0000" /><text x="990" y="459" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold">29</text>
            <circle cx="1250" cy="455" r="8" fill="#ff0000" /><text x="1250" y="459" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold">32</text>

            {/* COMMON SERVICES */}
            <circle cx="-13" cy="602" r="8" fill="#ff0000" /><text x="-13" y="606" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold">33</text>
            <circle cx="67" cy="602" r="8" fill="#ff0000" /><text x="67" y="606" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold">34</text>
            <circle cx="157" cy="602" r="8" fill="#ff0000" /><text x="157" y="606" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold">35</text>
            <circle cx="257" cy="602" r="8" fill="#ff0000" /><text x="257" y="606" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold">36</text>
            <circle cx="347" cy="602" r="8" fill="#ff0000" /><text x="347" y="606" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold">37</text>

            {/* YELLOW NOTE DEBUG NUMBERS (BLUE) */}
            <circle cx="190" cy="310" r="7" fill="#0066ff" /><text x="190" y="314" textAnchor="middle" fill="#fff" fontSize="5" fontWeight="bold">N1</text>
            <circle cx="257" cy="310" r="7" fill="#0066ff" /><text x="257" y="314" textAnchor="middle" fill="#fff" fontSize="5" fontWeight="bold">N2</text>
            <circle cx="310" cy="310" r="7" fill="#0066ff" /><text x="310" y="314" textAnchor="middle" fill="#fff" fontSize="5" fontWeight="bold">N3</text>
            <circle cx="428" cy="250" r="7" fill="#0066ff" /><text x="428" y="254" textAnchor="middle" fill="#fff" fontSize="5" fontWeight="bold">N4</text>
            <circle cx="192" cy="483" r="7" fill="#0066ff" /><text x="192" y="487" textAnchor="middle" fill="#fff" fontSize="5" fontWeight="bold">N5</text>
            <circle cx="672" cy="345" r="7" fill="#0066ff" /><text x="672" y="349" textAnchor="middle" fill="#fff" fontSize="5" fontWeight="bold">N6</text>
            <circle cx="952" cy="515" r="7" fill="#0066ff" /><text x="952" y="519" textAnchor="middle" fill="#fff" fontSize="5" fontWeight="bold">N7</text>
            <circle cx="1045" cy="215" r="7" fill="#0066ff" /><text x="1045" y="219" textAnchor="middle" fill="#fff" fontSize="5" fontWeight="bold">N8</text>
          </g>
          {/* ========== END DEBUG NUMBERS ========== */}

        </svg>
        </div>
      </div>

    </motion.div>
  );
}

export default ELCArchitecture;
