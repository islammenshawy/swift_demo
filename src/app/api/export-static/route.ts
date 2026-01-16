import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import { getDemo } from '@/data/swift-demos';
import { getDemoById } from '@/lib/database';
import { Demo } from '@/types/demo';

// Dynamic import to avoid Turbopack trying to parse esbuild's binary
async function getEsbuild() {
  return await import('esbuild');
}

// Get demo from static files or database
async function getDemoData(demoId: string): Promise<Demo | null> {
  // First try static demos
  const staticDemo = getDemo(demoId);
  if (staticDemo) return staticDemo;

  // Then try database
  const dbDemo = await getDemoById(demoId);
  return dbDemo;
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
    { name: 'Module P', icon: '🤝', color: '#C9A227' },
    { name: 'Module C', icon: '👥', color: '#10B981' },
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

// Legacy Problems Visualization
function LegacyProblems() {
  const [activeProblem, setActiveProblem] = useState(0);
  const [animPhase, setAnimPhase] = useState(0);

  const problems = [
    { icon: '1', label: 'Monolithic Architecture', desc: 'Tightly coupled codebase', detail: 'Single point of failure • Cannot scale independently' },
    { icon: '2', label: 'Slow Processing', desc: 'T+2 settlement delays', detail: 'Batch processing only • Manual intervention required' },
    { icon: '3', label: 'Integration Complexity', desc: '47+ point-to-point connections', detail: 'No standard APIs • High coordination cost' },
    { icon: '4', label: 'Limited Visibility', desc: 'Batch-generated reports', detail: 'T-1 day data latency • Manual reconciliation' },
    { icon: '5', label: 'Technical Debt', desc: 'High maintenance burden', detail: 'Low documentation • Key-person risk' },
  ];

  useEffect(() => {
    setAnimPhase(0);
    const t1 = setTimeout(() => setAnimPhase(1), 200);
    const t2 = setTimeout(() => setAnimPhase(2), 600);
    const t3 = setTimeout(() => setAnimPhase(3), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [activeProblem]);

  const metrics = [
    { label: 'Deployment Frequency', value: '1x/month', impact: 'vs. industry 10x/day' },
    { label: 'Change Lead Time', value: '6-8 weeks', impact: 'vs. industry <1 week' },
    { label: 'Failure Rate', value: '23%', impact: 'of deployments fail' },
    { label: 'Recovery Time', value: '4-6 hours', impact: 'mean time to restore' },
  ];

  return (
    <div className="w-full h-full flex flex-col p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-4">
        <h2 className="text-4xl font-bold text-white mb-2">The Legacy Challenge</h2>
        <p className="text-lg text-gray-400">Current Trade Systems</p>
      </motion.div>
      <div className="flex-1 flex gap-6">
        <div className="w-64 flex flex-col gap-2">
          {problems.map((problem, i) => (
            <motion.button
              key={i}
              onClick={() => setActiveProblem(i)}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={\`text-left p-3 rounded-xl border-2 transition-all \${activeProblem === i ? 'bg-red-500/20 border-red-500' : 'bg-gray-800/50 border-transparent hover:border-red-500/30'}\`}
            >
              <div className="flex items-center gap-3">
                <div className={\`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold \${activeProblem === i ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-400'}\`}>{problem.icon}</div>
                <div>
                  <p className={\`font-semibold text-sm \${activeProblem === i ? 'text-red-400' : 'text-white'}\`}>{problem.label}</p>
                  <p className="text-xs text-gray-500">{problem.desc}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
        <div className="flex-1 bg-gray-800/30 rounded-2xl border border-red-500/20 p-6">
          <motion.div key={activeProblem} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-xl font-bold text-red-400 mb-2">{problems[activeProblem].label}</p>
            <p className="text-sm text-gray-400 mb-6">{problems[activeProblem].detail}</p>
            <div className="grid grid-cols-2 gap-4">
              {metrics.map((metric, i) => (
                <motion.div key={metric.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: animPhase >= 2 ? 1 : 0, y: animPhase >= 2 ? 0 : 10 }} transition={{ delay: i * 0.1 }} className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                  <p className="text-sm text-gray-400">{metric.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{metric.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{metric.impact}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Technical Challenges Visualization
function TechnicalChallenges() {
  const challenges = [
    { icon: '⚙️', title: 'Legacy Stack', desc: 'COBOL + Java mix', impact: '15+ years old' },
    { icon: '🔗', title: 'Tight Coupling', desc: 'Monolithic design', impact: 'Cannot scale' },
    { icon: '📊', title: 'Data Silos', desc: 'Fragmented data', impact: 'No single source' },
    { icon: '🔄', title: 'Manual Processes', desc: 'High touch ops', impact: '34% manual' },
  ];
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold text-white mb-8">Technical Challenges</motion.h2>
      <div className="grid grid-cols-2 gap-6 max-w-4xl">
        {challenges.map((c, i) => (
          <motion.div key={c.title} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.15 }} className="bg-gray-800/50 rounded-xl border border-orange-500/30 p-6">
            <div className="text-4xl mb-3">{c.icon}</div>
            <h3 className="text-xl font-bold text-orange-400 mb-1">{c.title}</h3>
            <p className="text-gray-300 mb-2">{c.desc}</p>
            <p className="text-sm text-gray-500">{c.impact}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Product Opportunities Visualization
function ProductOpportunities() {
  const opportunities = [
    { icon: '🚀', title: 'Real-time Processing', desc: 'T+0 settlement capability' },
    { icon: '🤖', title: 'AI-Powered Automation', desc: 'Intelligent trade matching' },
    { icon: '📱', title: 'Modern APIs', desc: 'RESTful microservices' },
    { icon: '📈', title: 'Advanced Analytics', desc: 'Real-time dashboards' },
  ];
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold text-white mb-2">Product Opportunities</motion.h2>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg text-gray-400 mb-8">Transform legacy into competitive advantage</motion.p>
      <div className="grid grid-cols-2 gap-6 max-w-4xl">
        {opportunities.map((o, i) => (
          <motion.div key={o.title} initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }} className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl border border-cyan-500/30 p-6">
            <div className="text-4xl mb-3">{o.icon}</div>
            <h3 className="text-xl font-bold text-cyan-400 mb-2">{o.title}</h3>
            <p className="text-gray-300">{o.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Transformation Goals Visualization
function TransformationGoals() {
  const goals = [
    { metric: '95%', label: 'STP Rate', from: '66%' },
    { metric: 'T+0', label: 'Settlement', from: 'T+2' },
    { metric: '10x', label: 'Deploy Freq', from: '1x/month' },
    { metric: '99.9%', label: 'Availability', from: '97%' },
  ];
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold text-white mb-2">Transformation Goals</motion.h2>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg text-gray-400 mb-8">Target State Metrics</motion.p>
      <div className="grid grid-cols-4 gap-6">
        {goals.map((g, i) => (
          <motion.div key={g.label} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }} className="text-center">
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl border border-green-500/30 p-6 mb-3">
              <p className="text-5xl font-bold text-green-400">{g.metric}</p>
            </div>
            <p className="text-white font-semibold">{g.label}</p>
            <p className="text-sm text-gray-500">from {g.from}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ELC Reimagination Visualization
function ELCReimagination() {
  const features = [
    { icon: '📄', title: 'Smart LC Creation', desc: 'AI-assisted document generation' },
    { icon: '✅', title: 'Auto Verification', desc: 'Instant compliance checks' },
    { icon: '🔄', title: 'Real-time Tracking', desc: 'End-to-end visibility' },
    { icon: '⚡', title: 'Instant Settlement', desc: 'T+0 processing' },
  ];
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold text-white mb-2">ELC Reimagined</motion.h2>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg text-gray-400 mb-8">Next-generation Letter of Credit Processing</motion.p>
      <div className="flex gap-4 items-center max-w-5xl">
        {features.map((f, i) => (
          <React.Fragment key={f.title}>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.2 }} className="flex-1 bg-gray-800/50 rounded-xl border border-purple-500/30 p-5 text-center">
              <div className="text-3xl mb-2">{f.icon}</div>
              <h3 className="text-lg font-bold text-purple-400 mb-1">{f.title}</h3>
              <p className="text-sm text-gray-400">{f.desc}</p>
            </motion.div>
            {i < features.length - 1 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.2 + 0.1 }} className="text-2xl text-purple-400">→</motion.div>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// Transformation Metrics Visualization
function TransformationMetrics() {
  const metrics = [
    { label: 'Processing Speed', before: '48 hrs', after: '< 1 min', improvement: '2880x' },
    { label: 'Manual Touch', before: '34%', after: '< 5%', improvement: '-85%' },
    { label: 'Error Rate', before: '8%', after: '< 0.1%', improvement: '-99%' },
    { label: 'Cost per Trade', before: '$45', after: '$3', improvement: '-93%' },
  ];
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold text-white mb-8">Transformation Impact</motion.h2>
      <div className="w-full max-w-4xl space-y-4">
        {metrics.map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }} className="bg-gray-800/50 rounded-xl p-4 flex items-center gap-6">
            <div className="w-40"><p className="text-white font-semibold">{m.label}</p></div>
            <div className="flex-1 flex items-center gap-4">
              <div className="bg-red-500/20 rounded-lg px-4 py-2 text-center">
                <p className="text-xs text-gray-400">Before</p>
                <p className="text-xl font-bold text-red-400">{m.before}</p>
              </div>
              <div className="text-2xl text-gray-500">→</div>
              <div className="bg-green-500/20 rounded-lg px-4 py-2 text-center">
                <p className="text-xs text-gray-400">After</p>
                <p className="text-xl font-bold text-green-400">{m.after}</p>
              </div>
            </div>
            <div className="bg-cyan-500/20 rounded-lg px-4 py-2">
              <p className="text-xl font-bold text-cyan-400">{m.improvement}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Trade Architecture Visualization
function TradeArchitecture() {
  const layers = [
    { name: 'API Gateway', color: 'cyan', items: ['REST APIs', 'GraphQL', 'WebSocket'] },
    { name: 'Services', color: 'blue', items: ['Trade Engine', 'Risk', 'Settlement'] },
    { name: 'Data Layer', color: 'purple', items: ['Event Store', 'Cache', 'Analytics'] },
  ];
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold text-white mb-2">Modern Trade Architecture</motion.h2>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg text-gray-400 mb-8">Cloud-native, event-driven microservices</motion.p>
      <div className="w-full max-w-4xl space-y-4">
        {layers.map((layer, i) => (
          <motion.div key={layer.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2 }} className={\`bg-\${layer.color}-500/10 rounded-xl border border-\${layer.color}-500/30 p-4\`} style={{ background: \`rgba(\${layer.color === 'cyan' ? '0,212,255' : layer.color === 'blue' ? '59,130,246' : '168,85,247'}, 0.1)\`, borderColor: \`rgba(\${layer.color === 'cyan' ? '0,212,255' : layer.color === 'blue' ? '59,130,246' : '168,85,247'}, 0.3)\` }}>
            <p className="text-lg font-bold text-white mb-3">{layer.name}</p>
            <div className="flex gap-3">
              {layer.items.map((item, j) => (
                <motion.div key={item} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.2 + j * 0.1 }} className="flex-1 bg-gray-800/50 rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-300">{item}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Slide Renderer
function SlideRenderer({ slide, phase }) {
  if (slide.type === 'title') {
    return <TitleSlide content={slide.content} />;
  }
  if (slide.type === 'interactive') {
    const viz = slide.content.visualization;
    if (viz === 'module-consolidation') return <ModuleConsolidation phase={phase} />;
    if (viz === 'legacy-problems') return <LegacyProblems />;
    if (viz === 'technical-challenges') return <TechnicalChallenges />;
    if (viz === 'product-opportunities') return <ProductOpportunities />;
    if (viz === 'transformation-goals') return <TransformationGoals />;
    if (viz === 'elc-reimagination') return <ELCReimagination />;
    if (viz === 'transformation-metrics') return <TransformationMetrics />;
    if (viz === 'trade-architecture') return <TradeArchitecture />;
    // Fallback for unknown visualizations
    return <div className="w-full h-full flex items-center justify-center"><p className="text-2xl text-gray-400">{viz}</p></div>;
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

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const demoId = searchParams.get('demoId');

  if (!demoId) {
    return NextResponse.json({ error: 'Missing demoId' }, { status: 400 });
  }

  try {
    // Get the demo data (from static files or database)
    const demoData = await getDemoData(demoId);
    if (!demoData) {
      return NextResponse.json({ error: 'Demo not found' }, { status: 404 });
    }

    // Replace the placeholder with actual demo data
    const entryCode = STANDALONE_ENTRY.replace('__DEMO_DATA__', JSON.stringify(demoData));

    // Write temporary entry file
    const tempEntry = path.join(process.cwd(), '.temp-standalone-entry.tsx');
    fs.writeFileSync(tempEntry, entryCode);

    try {
      // Bundle with esbuild (dynamic import to avoid build issues)
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

      // Create the HTML file with Tailwind CDN for full styling support
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${demoData.title || 'Presentation'}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            'bg-primary': '#0A1628',
            'bg-secondary': '#0F1F35',
            'accent-gold': '#C9A227',
            'accent-cyan': '#00D4FF',
            'text-primary': '#FFFFFF',
            'text-secondary': '#B4C7E7',
            'text-muted': '#6B7C93',
          }
        }
      }
    }
  </script>
  <style>
    :root {
      --bg-primary: #0A1628;
      --bg-secondary: #0F1F35;
      --accent-gold: #C9A227;
      --accent-cyan: #00D4FF;
      --text-primary: #FFFFFF;
      --text-secondary: #B4C7E7;
      --text-muted: #6B7C93;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { overflow: hidden; background: var(--bg-primary); }
    button:hover:not(:disabled) { background: #00D4FF !important; color: #0A1628 !important; }
    button:disabled { opacity: 0.3; cursor: not-allowed; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script>${bundledJs}</script>
</body>
</html>`;

      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html',
          'Content-Disposition': `attachment; filename="${demoData.title.replace(/\s+/g, '-').toLowerCase()}.html"`,
        },
      });
    } finally {
      // Clean up temp file
      if (fs.existsSync(tempEntry)) {
        fs.unlinkSync(tempEntry);
      }
    }
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to create export: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}
