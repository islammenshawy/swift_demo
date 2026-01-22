import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import { getDemo } from '@/data/swift-demos';
import { Demo } from '@/types/demo';

// Dynamic import to avoid Turbopack trying to parse esbuild's binary
async function getEsbuild() {
  return await import('esbuild');
}

const STANDALONE_ENTRY = `
import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';

// Demo data will be injected here
const DEMO_DATA = __DEMO_DATA__;

// Visualization phase counts (must match presentationStore.ts)
const PHASE_COUNTS = {
  'module-consolidation': 6,
  'legacy-problems': 8,
  'technical-challenges': 5,
  'product-opportunities': 6,
  'transformation-goals': 1,
  'elc-reimagination': 1,
  'transformation-metrics': 1,
  'trade-architecture': 1,
  'engineering-score-journey': 5,
  'problem-visual': 1,
  'solution-visual': 1,
  'score-calculation': 1,
  'level-weights': 1,
  'team-benchmarking': 1,
  'ai-capabilities': 1,
  'promotion-pipeline': 1,
  'feature-showcase': 9,
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
    { icon: '3', label: 'Integration Complexity', desc: '100+ service-level connections', detail: '5x industry average • No standard APIs' },
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
    { icon: '⚙️', title: 'Legacy Stack', desc: 'Mule + Java mix', impact: '10+ years old' },
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

// Engineering Score Journey Visualization (5 phases)
function EngineeringScoreJourney({ phase }) {
  const [selectedLevel, setSelectedLevel] = useState(0);
  const levels = ['Junior', 'Mid', 'Senior', 'Lead'];

  const metricGroups = [
    { name: 'Delivery', icon: '🚀', color: '#4ECDC4', metrics: ['Story Points', 'Churn', 'Say/Do Ratio', 'Change Failure Rate', 'Time to Prod', 'Wall-building'] },
    { name: 'Reliability', icon: '🛡️', color: '#6495ED', metrics: ['Defect Closure Rate', 'Commitment Index', 'Timely Escalation', 'Incidents Resolved'] },
    { name: 'Quality', icon: '✨', color: '#C9A227', metrics: ['Defect Rate', 'Defect Leakage', 'Code Grade', 'Test Coverage'] },
    { name: 'Collaboration', icon: '🤝', color: '#A855F7', metrics: ['PR Reviews', 'Unplanned Work', 'Cross-team Help', 'Knowledge Sharing'] },
    { name: 'Efficiency', icon: '⚡', color: '#F59E0B', metrics: ['AI Usage Score', 'Automation Index', 'Commit Frequency', 'Tool Adoption'] },
  ];

  useEffect(() => {
    if (phase === 3) {
      const interval = setInterval(() => setSelectedLevel(prev => (prev + 1) % 4), 2500);
      return () => clearInterval(interval);
    }
  }, [phase]);

  // Phase 0: Opening Question
  if (phase === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl text-white font-light">How do we score</motion.p>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-5xl md:text-6xl text-cyan-400 font-bold mt-4">engineering performance?</motion.p>
        </div>
      </div>
    );
  }

  // Phase 1 & 2: Metrics Display
  if (phase === 1 || phase === 2) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="text-center pt-12 pb-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white">{phase === 1 ? "Too Many Metrics..." : "Different Types of Data"}</h2>
        </div>
        {phase === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center gap-10 py-4">
            <div className="flex items-center gap-3 px-5 py-2.5 rounded-full" style={{ backgroundColor: '#4ECDC420', border: '1px solid #4ECDC4' }}>
              <span className="text-2xl">📊</span><span className="text-base font-bold" style={{ color: '#4ECDC4' }}>Quantitative</span>
            </div>
            <div className="flex items-center gap-3 px-5 py-2.5 rounded-full" style={{ backgroundColor: '#F59E0B20', border: '1px solid #F59E0B' }}>
              <span className="text-2xl">💬</span><span className="text-base font-bold" style={{ color: '#F59E0B' }}>Objective</span>
            </div>
          </motion.div>
        )}
        <div className="flex-1 flex items-center justify-center px-8">
          <div className="flex gap-8 items-start justify-center">
            {metricGroups.map((group, i) => (
              <motion.div key={group.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }} className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full flex flex-col items-center justify-center mb-3" style={{ backgroundColor: group.color + '20', border: '3px solid ' + group.color }}>
                  <span className="text-2xl">{group.icon}</span>
                  <span className="text-[10px] font-bold" style={{ color: group.color }}>{group.name}</span>
                </div>
                <div className="flex flex-col gap-1">
                  {group.metrics.map((metric, j) => (
                    <motion.div key={metric} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.06 + j * 0.03 }} className="px-3 py-1 rounded-full text-xs font-medium text-center whitespace-nowrap" style={{ backgroundColor: group.color + '15', border: '1px solid ' + group.color + '50', color: group.color }}>
                      {metric}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="flex items-center justify-center gap-2 pb-20">
          {metricGroups.map((group, i) => (
            <React.Fragment key={group.name}>
              <span className="px-3 py-1 rounded text-sm font-bold" style={{ backgroundColor: group.color + '20', color: group.color }}>{group.name}</span>
              {i < metricGroups.length - 1 && <span className="text-base text-gray-500">+</span>}
            </React.Fragment>
          ))}
          <span className="text-base text-gray-500 mx-2">→</span>
          <span className="px-3 py-1 rounded text-sm font-bold text-white" style={{ background: 'linear-gradient(90deg, #4ECDC420, #C9A22720)' }}>Weighted Score</span>
        </motion.div>
      </div>
    );
  }

  // Phase 3: Level comparison
  if (phase === 3) {
    const levelColors = ['#22c55e', '#3b82f6', '#a855f7', '#f59e0b'];
    const chartData = [
      { metric: 'Code Commits/week', values: [12, 18, 8, 4] },
      { metric: 'PR Reviews/week', values: [3, 8, 15, 20] },
      { metric: 'Story Points/sprint', values: [8, 13, 10, 5] },
    ];
    const insights = [
      "Juniors focus on code output — high commits, fewer reviews",
      "Mid-level engineers balance coding with collaboration",
      "Seniors review more PRs but commit less — mentoring focus",
      "Leads focus on unblocking others — lowest individual output, highest impact"
    ];
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Different Levels, Different Averages</h2>
        <p className="text-lg text-gray-400 mb-6">Average metrics vary significantly by level</p>
        <div className="flex gap-6 mb-8">
          {levels.map((level, i) => (
            <motion.button key={level} animate={{ scale: selectedLevel === i ? 1.05 : 1 }} className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: selectedLevel === i ? levelColors[i] + '30' : 'transparent', border: selectedLevel === i ? '2px solid ' + levelColors[i] : '2px solid transparent' }} onClick={() => setSelectedLevel(i)}>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: levelColors[i] }} />
              <span className="text-sm font-medium" style={{ color: selectedLevel === i ? levelColors[i] : '#6B7C93' }}>{level}</span>
            </motion.button>
          ))}
        </div>
        <div className="flex gap-16">
          {chartData.map((item, idx) => (
            <div key={item.metric} className="text-center">
              <p className="text-base font-medium text-gray-300 mb-4">{item.metric}</p>
              <div className="flex gap-3 items-end h-44">
                {levelColors.map((color, i) => (
                  <div key={i} className="flex flex-col items-center w-12">
                    <motion.span animate={{ scale: selectedLevel === i ? 1.2 : 1, opacity: selectedLevel === i ? 1 : 0.6 }} className="text-sm font-bold mb-1" style={{ color }}>{item.values[i]}</motion.span>
                    <motion.div initial={{ height: 0 }} animate={{ height: (item.values[i] / 20) * 140, opacity: selectedLevel === i ? 1 : 0.4, scale: selectedLevel === i ? 1.05 : 1 }} transition={{ duration: 0.5 }} className="w-full rounded-t" style={{ backgroundColor: color }} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-8 px-8 py-4 rounded-lg" style={{ backgroundColor: '#C9A22720', border: '1px solid #C9A22750' }}>
          <p className="text-base" style={{ color: '#C9A227' }}>💡 {insights[selectedLevel]}</p>
        </motion.div>
      </div>
    );
  }

  // Phase 4: Fair comparison
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">Fair = Same Level Comparison</h2>
      <div className="flex gap-20 items-center">
        <div className="text-center">
          <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-8xl mb-8">⚖️</motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-5 mb-6">
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: '#a855f720', border: '3px solid #a855f7' }}><span className="text-purple-400 font-bold text-base">Senior</span></div>
            <span className="text-green-400 font-bold text-2xl">vs</span>
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: '#a855f720', border: '3px solid #a855f7' }}><span className="text-purple-400 font-bold text-base">Senior</span></div>
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: 'spring' }} className="text-5xl text-green-400">✓</motion.span>
          </motion.div>
          <div className="flex items-center gap-5 opacity-50">
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: '#22c55e20', border: '2px solid #22c55e' }}><span className="text-green-400 font-bold text-sm">Junior</span></div>
            <span className="text-red-400 text-lg line-through">vs</span>
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: '#a855f720', border: '2px solid #a855f7' }}><span className="text-purple-400 font-bold text-sm">Senior</span></div>
            <span className="text-3xl text-red-400">✗</span>
          </div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="p-8 rounded-2xl" style={{ backgroundColor: '#0F1F35', border: '1px solid #1a2f4a' }}>
          <p className="text-base text-gray-500 mb-6">Percentile within Senior peers</p>
          <div className="space-y-4 w-80">
            {[{ name: 'Alice', percentile: 92, highlight: true }, { name: 'Bob', percentile: 78 }, { name: 'Carol', percentile: 65 }, { name: 'Dave', percentile: 45 }].map((person, i) => (
              <motion.div key={person.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 + i * 0.1 }} className="flex items-center gap-4">
                <span className="text-base text-gray-500 w-14">{person.name}</span>
                <div className="flex-1 h-5 rounded-full overflow-hidden" style={{ backgroundColor: '#1a2f4a' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: person.percentile + '%' }} transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }} className="h-full rounded-full" style={{ backgroundColor: person.highlight ? '#22c55e' : '#a855f7' }} />
                </div>
                <span className="text-base font-bold w-12" style={{ color: person.highlight ? '#22c55e' : '#a855f7' }}>{person.percentile}%</span>
              </motion.div>
            ))}
          </div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="text-base text-green-400 mt-6 text-center font-medium">✨ Top 10% among Senior engineers</motion.p>
        </motion.div>
      </div>
    </div>
  );
}

// Problem Visual
function ProblemVisual() {
  const [phase, setPhase] = useState(0);
  const bullets = [
    { icon: '😤', text: '74% of employees believe 360-degree reviews are unfair, biased, or inaccurate' },
    { icon: '🎭', text: 'Promotions based on perception, not actual contribution' },
    { icon: '📋', text: 'Managers lack data and recommendations to navigate performance discussions' },
    { icon: '❓', text: 'No visibility into how scores are calculated' },
    { icon: '🚪', text: 'Top talent attrition when advancement decisions feel arbitrary' },
  ];
  useEffect(() => { setTimeout(() => setPhase(1), 500); setTimeout(() => setPhase(2), 1500); }, []);
  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="w-full max-w-5xl flex gap-12 items-center">
        <div className="flex-1">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <h2 className="text-4xl font-bold text-white mb-2">The Problem</h2>
            <p className="text-xl text-gray-400">Performance reviews lack objectivity and consistency</p>
          </motion.div>
          <div className="space-y-4">
            {bullets.map((bullet, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.2 }} className="flex items-start gap-3 p-3 rounded-lg border-l-4 border-red-500/50" style={{ backgroundColor: '#0F1F35' }}>
                <span className="text-2xl">{bullet.icon}</span>
                <p className="text-white leading-relaxed">{bullet.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-80 h-80">
            <motion.div initial={{ scale: 0 }} animate={{ scale: phase >= 1 ? 1 : 0 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full flex items-center justify-center z-10" style={{ backgroundColor: '#0F1F35', border: '4px solid #00D4FF30' }}>
              <motion.span animate={{ rotate: phase >= 2 ? [0, -10, 10, -10, 0] : 0 }} transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }} className="text-5xl">😕</motion.span>
            </motion.div>
            {phase >= 2 && [{ emoji: '📝', label: 'Subjective', angle: 0, color: '#ef4444' }, { emoji: '👁️', label: 'Biased', angle: 72, color: '#f97316' }, { emoji: '🎲', label: 'Random', angle: 144, color: '#eab308' }, { emoji: '📉', label: 'Unfair', angle: 216, color: '#ef4444' }, { emoji: '🤷', label: 'Unclear', angle: 288, color: '#f97316' }].map((item, i) => {
              const x = Math.cos((item.angle * Math.PI) / 180) * 120;
              const y = Math.sin((item.angle * Math.PI) / 180) * 120;
              return (
                <motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} className="absolute top-1/2 left-1/2" style={{ marginLeft: x - 28, marginTop: y - 28 }}>
                  <div className="w-14 h-14 rounded-xl flex flex-col items-center justify-center border-2" style={{ backgroundColor: item.color + '20', borderColor: item.color }}>
                    <span className="text-xl">{item.emoji}</span>
                    <span className="text-[8px] font-bold" style={{ color: item.color }}>{item.label}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Solution Visual
function SolutionVisual() {
  const [phase, setPhase] = useState(0);
  const bullets = [
    { icon: '🔗', text: 'Quantitative data from JIRA, GitHub, and Confluence' },
    { icon: '🔄', text: '360-degree feedback enriched with real work metrics' },
    { icon: '📊', text: 'Managers get data-driven talking points and recommendations' },
    { icon: '⚖️', text: 'Fair comparison within same level peers' },
    { icon: '🔍', text: 'Transparent methodology based on real contributions' },
  ];
  useEffect(() => { setTimeout(() => setPhase(1), 500); setTimeout(() => setPhase(2), 1500); setTimeout(() => setPhase(3), 2500); }, []);
  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="w-full max-w-5xl flex gap-12 items-center">
        <div className="flex-1">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <h2 className="text-4xl font-bold text-white mb-2">The Solution</h2>
            <p className="text-xl text-gray-400">Evalio: Quantitative data fused with 360-degree reviews and Objective data</p>
          </motion.div>
          <div className="space-y-4">
            {bullets.map((bullet, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.2 }} className="flex items-start gap-3 p-3 rounded-lg border-l-4" style={{ backgroundColor: '#0F1F35', borderLeftColor: '#00D4FF80' }}>
                <span className="text-2xl">{bullet.icon}</span>
                <p className="text-white leading-relaxed">{bullet.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-96 h-80">
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-center gap-4">
              {[{ icon: '📋', label: 'JIRA', color: '#4ECDC4' }, { icon: '💻', label: 'GitHub', color: '#6495ED' }, { icon: '📝', label: 'Confluence', color: '#FFD700' }].map((source, i) => (
                <motion.div key={source.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: phase >= 1 ? 1 : 0, x: phase >= 1 ? 0 : -20 }} transition={{ delay: i * 0.2 }} className="w-16 h-16 rounded-xl flex flex-col items-center justify-center border-2" style={{ borderColor: source.color, backgroundColor: source.color + '20' }}>
                  <span className="text-2xl">{source.icon}</span>
                  <span className="text-[10px] font-bold" style={{ color: source.color }}>{source.label}</span>
                </motion.div>
              ))}
            </div>
            <motion.div initial={{ scale: 0 }} animate={{ scale: phase >= 2 ? 1 : 0 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <motion.div animate={{ boxShadow: phase >= 3 ? ['0 0 20px #4ECDC450', '0 0 40px #4ECDC480', '0 0 20px #4ECDC450'] : 'none' }} transition={{ duration: 2, repeat: Infinity }} className="w-28 h-28 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00D4FF, #C9A227)' }}>
                <div className="w-24 h-24 rounded-xl flex flex-col items-center justify-center" style={{ backgroundColor: '#0A1628' }}>
                  <span className="text-lg font-bold text-cyan-400">Evalio</span>
                  <span className="text-xs text-gray-500">AI Engine</span>
                </div>
              </motion.div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: phase >= 3 ? 1 : 0, x: phase >= 3 ? 0 : 20 }} className="absolute right-0 top-1/2 -translate-y-1/2">
              <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00D4FF, #C9A227)' }}>
                <div className="w-16 h-16 rounded-full flex flex-col items-center justify-center" style={{ backgroundColor: '#0A1628' }}>
                  <span className="text-xl font-bold text-cyan-400">4.2</span>
                  <span className="text-[8px] text-gray-500">Score</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Score Calculation
function ScoreCalculation() {
  const [phase, setPhase] = useState(0);
  const frameworks = [
    { id: 'jira', name: 'JIRA', weight: 30, score: 4.2, color: '#4ECDC4' },
    { id: 'github', name: 'GitHub', weight: 35, score: 4.5, color: '#6495ED' },
    { id: 'confluence', name: 'Confluence', weight: 15, score: 3.8, color: '#FFD700' },
    { id: 'dora', name: 'DORA', weight: 20, score: 4.0, color: '#C9A227' },
  ];
  const finalScore = frameworks.reduce((acc, f) => acc + (f.score * f.weight / 100), 0);
  useEffect(() => { setTimeout(() => setPhase(1), 500); setTimeout(() => setPhase(2), 1500); setTimeout(() => setPhase(3), 3000); }, []);
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-bold text-white mb-2">Multi-Framework Scoring</motion.h2>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-gray-400 mb-8">Weighted combination for objective evaluation</motion.p>
      <div className="w-full max-w-4xl flex gap-8 items-center">
        <div className="flex-1 space-y-4">
          {frameworks.map((fw, i) => (
            <motion.div key={fw.id} initial={{ opacity: 0, x: -30 }} animate={{ opacity: phase >= 1 ? 1 : 0, x: phase >= 1 ? 0 : -30 }} transition={{ delay: i * 0.15 }} className="p-4 rounded-xl" style={{ backgroundColor: '#0F1F35', border: '1px solid #00D4FF30' }}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-white">{fw.name}</span>
                <span className="text-sm text-gray-500">{fw.weight}% weight</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-8 rounded-full overflow-hidden" style={{ backgroundColor: '#0A1628' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: phase >= 2 ? (fw.score / 5) * 100 + '%' : 0 }} transition={{ duration: 0.8, delay: i * 0.15 }} className="h-full rounded-full flex items-center justify-end pr-2" style={{ backgroundColor: fw.color }}>
                    {phase >= 2 && <span className="text-xs font-bold" style={{ color: '#0A1628' }}>{fw.score.toFixed(1)}</span>}
                  </motion.div>
                </div>
                {phase >= 2 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm"><span className="text-gray-500">×{fw.weight}% = </span><span className="font-bold" style={{ color: fw.color }}>{(fw.score * fw.weight / 100).toFixed(2)}</span></motion.div>}
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: phase >= 2 ? 1 : 0, scale: phase >= 2 ? 1 : 0.8 }} className="flex flex-col items-center">
          <div className="text-4xl mb-4">=</div>
          <motion.div animate={{ boxShadow: phase >= 3 ? ['0 0 30px #4ECDC450', '0 0 50px #4ECDC480', '0 0 30px #4ECDC450'] : 'none' }} transition={{ duration: 2, repeat: Infinity }} className="w-40 h-40 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00D4FF, #C9A227)' }}>
            <div className="w-36 h-36 rounded-full flex flex-col items-center justify-center" style={{ backgroundColor: '#0A1628' }}>
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: phase >= 3 ? 1 : 0 }} className="text-4xl font-bold text-cyan-400">{finalScore.toFixed(1)}</motion.span>
              <span className="text-sm text-gray-500">Final Score</span>
            </div>
          </motion.div>
          {phase >= 3 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 px-4 py-2 rounded-full" style={{ backgroundColor: '#00D4FF20', border: '1px solid #00D4FF' }}><span className="text-cyan-400 font-semibold">High Performer</span></motion.div>}
        </motion.div>
      </div>
    </div>
  );
}

// Level Weights
function LevelWeights() {
  const [activeLevel, setActiveLevel] = useState(0);
  const levels = [
    { name: 'Analyst', years: '0-2 years', color: '#4ECDC4', weights: { github: 40, jira: 30, confluence: 10, dora: 20 }, focus: 'Execution & Learning' },
    { name: 'Associate', years: '2-4 years', color: '#6495ED', weights: { github: 35, jira: 30, confluence: 15, dora: 20 }, focus: 'Building Autonomy' },
    { name: 'VP', years: '4-7 years', color: '#FFD700', weights: { github: 30, jira: 25, confluence: 20, dora: 25 }, focus: 'Leadership Emerging' },
    { name: 'Director', years: '7+ years', color: '#C9A227', weights: { github: 20, jira: 15, confluence: 30, dora: 35 }, focus: 'Strategy & Impact' },
  ];
  const metrics = [{ key: 'github', label: 'GitHub', color: '#4ECDC4' }, { key: 'jira', label: 'JIRA', color: '#6495ED' }, { key: 'confluence', label: 'Confluence', color: '#FFD700' }, { key: 'dora', label: 'DORA', color: '#C9A227' }];
  useEffect(() => { const interval = setInterval(() => setActiveLevel(prev => (prev + 1) % 4), 4000); return () => clearInterval(interval); }, []);
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6">
      <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-bold text-white mb-2">Level-Adjusted Weights</motion.h2>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-gray-400 mb-6">Different expectations for different career stages</motion.p>
      <div className="w-full max-w-5xl flex gap-6">
        <div className="flex-1 p-6 rounded-2xl" style={{ backgroundColor: '#0F1F35', border: '1px solid #00D4FF30' }}>
          <p className="text-sm text-gray-500 mb-4">Weight Distribution by Level</p>
          <div className="space-y-3">
            {levels.map((level, idx) => (
              <motion.div key={level.name} animate={{ scale: activeLevel === idx ? 1.02 : 1 }} className="relative">
                <div className="flex items-center gap-3">
                  <div className="w-20 text-right"><span className="text-xs font-medium" style={{ color: activeLevel === idx ? '#fff' : '#6B7C93' }}>{level.name}</span></div>
                  <div className="flex-1 h-8 flex rounded-lg overflow-hidden" style={{ backgroundColor: '#0A1628' }}>
                    {metrics.map((metric) => (<motion.div key={metric.key} initial={{ width: 0 }} animate={{ width: level.weights[metric.key] + '%' }} transition={{ duration: 0.8 }} className="h-full flex items-center justify-center" style={{ backgroundColor: metric.color }}>{level.weights[metric.key] >= 15 && <span className="text-xs font-bold" style={{ color: '#0A1628' }}>{level.weights[metric.key]}%</span>}</motion.div>))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-4 pt-4 border-t" style={{ borderColor: '#00D4FF20' }}>
            {metrics.map((metric) => (<div key={metric.key} className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{ backgroundColor: metric.color }} /><span className="text-xs text-gray-500">{metric.label}</span></div>))}
          </div>
        </div>
        <div className="w-72 flex flex-col gap-4">
          <div className="p-4 rounded-xl border-2" style={{ backgroundColor: '#0F1F35', borderColor: levels[activeLevel].color }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold" style={{ backgroundColor: levels[activeLevel].color + '30', color: levels[activeLevel].color }}>{levels[activeLevel].name[0]}</div>
              <div><p className="font-semibold text-white">{levels[activeLevel].name}</p><p className="text-xs text-gray-500">{levels[activeLevel].years}</p></div>
            </div>
            <p className="text-xs text-gray-400 mb-3">Focus: {levels[activeLevel].focus}</p>
            <div className="space-y-2">
              {metrics.map((metric) => (<div key={metric.key} className="flex items-center gap-2"><div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#0A1628' }}><motion.div key={activeLevel + metric.key} initial={{ width: 0 }} animate={{ width: levels[activeLevel].weights[metric.key] + '%' }} className="h-full rounded-full" style={{ backgroundColor: metric.color }} /></div><span className="text-xs w-8 text-right" style={{ color: metric.color }}>{levels[activeLevel].weights[metric.key]}%</span></div>))}
            </div>
          </div>
          <div className="flex flex-wrap gap-1 justify-center">
            {levels.map((level, i) => (<motion.button key={level.name} onClick={() => setActiveLevel(i)} animate={{ scale: activeLevel === i ? 1.05 : 1 }} className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: level.color + '30', color: level.color, opacity: activeLevel === i ? 1 : 0.6 }}>{level.name}</motion.button>))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Team Benchmarking
function TeamBenchmarking() {
  const [phase, setPhase] = useState(0);
  const teams = [
    { id: 'alpha', name: 'Alpha Squad', score: 4.6, members: 8, trend: '+0.3', avatar: 'A' },
    { id: 'beta', name: 'Beta Force', score: 4.2, members: 6, trend: '+0.5', avatar: 'B' },
    { id: 'gamma', name: 'Gamma Unit', score: 3.9, members: 7, trend: '+0.2', avatar: 'G' },
    { id: 'delta', name: 'Delta Core', score: 3.5, members: 5, trend: '-0.1', avatar: 'D' },
  ];
  const getZoneColor = (score) => score >= 4.5 ? '#4ECDC4' : score >= 4.0 ? '#6495ED' : score >= 3.5 ? '#FFD700' : '#C9A227';
  useEffect(() => { setTimeout(() => setPhase(1), 300); setTimeout(() => setPhase(2), 1000); }, []);
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-bold text-white mb-2">Team Benchmarking</motion.h2>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-gray-400 mb-8">Where does your team stand against the industry?</motion.p>
      <div className="w-full max-w-4xl space-y-3">
        {teams.map((team, i) => {
          const color = getZoneColor(team.score);
          return (
            <motion.div key={team.id} initial={{ opacity: 0, x: -30 }} animate={{ opacity: phase >= 1 ? 1 : 0, x: phase >= 1 ? 0 : -30 }} transition={{ delay: i * 0.1 }} className="p-4 rounded-xl" style={{ backgroundColor: '#0F1F35', border: '1px solid #00D4FF30' }}>
              <div className="flex items-center gap-4">
                <motion.div initial={{ scale: 0 }} animate={{ scale: phase >= 2 ? 1 : 0 }} className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg" style={{ background: i === 0 ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : i === 1 ? 'linear-gradient(135deg, #d1d5db, #9ca3af)' : i === 2 ? 'linear-gradient(135deg, #d97706, #92400e)' : '#0A1628', color: i < 3 ? '#000' : '#6B7C93' }}>{i + 1}</motion.div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold" style={{ backgroundColor: color + '30', color }}>{team.avatar}</div>
                <div className="flex-1"><div className="flex items-center gap-2"><span className="font-semibold text-white">{team.name}</span><span className="text-xs text-gray-500">({team.members} members)</span></div><div className="mt-2 h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#0A1628' }}><motion.div initial={{ width: 0 }} animate={{ width: (team.score / 5) * 100 + '%' }} transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }} className="h-full rounded-full" style={{ backgroundColor: color }} /></div></div>
                <div className="text-right"><span className="text-2xl font-bold" style={{ color }}>{team.score.toFixed(1)}</span><div className="text-xs font-medium" style={{ color: team.trend.startsWith('+') ? '#22c55e' : '#ef4444' }}>{team.trend} this quarter</div></div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// AI Capabilities
function AICapabilities() {
  const [phase, setPhase] = useState(0);
  const bullets = [
    { icon: '✅', text: 'Narrative validation: AI cross-references input with performance data', color: '#4ECDC4' },
    { icon: '🎯', text: 'Consistency insights: Highlights areas where feedback and metrics may differ', color: '#ef4444' },
    { icon: '📈', text: 'Promotion readiness: Objective assessment with development recommendations', color: '#FFD700' },
    { icon: '💬', text: 'Conversational insights: Ask questions in natural language', color: '#6495ED' },
    { icon: '👥', text: 'Comparative analysis: How does Employee A compare to their peers?', color: '#C9A227' },
  ];
  useEffect(() => { setTimeout(() => setPhase(1), 500); setTimeout(() => setPhase(2), 1500); }, []);
  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="w-full max-w-5xl flex gap-12 items-center">
        <div className="flex-1">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <h2 className="text-4xl font-bold text-white mb-2">AI-Powered Intelligence</h2>
            <p className="text-xl text-gray-400">LLM analyzes what humans miss</p>
          </motion.div>
          <div className="space-y-4">
            {bullets.map((bullet, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.2 }} className="flex items-start gap-3 p-3 rounded-lg border-l-4" style={{ backgroundColor: '#0F1F35', borderLeftColor: bullet.color }}>
                <span className="text-2xl">{bullet.icon}</span>
                <p className="text-white leading-relaxed">{bullet.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-80 h-80">
            <motion.div initial={{ scale: 0 }} animate={{ scale: phase >= 1 ? 1 : 0 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <motion.div animate={{ boxShadow: phase >= 2 ? ['0 0 30px #4ECDC450', '0 0 50px #C9A22750', '0 0 30px #4ECDC450'] : 'none' }} transition={{ duration: 3, repeat: Infinity }} className="w-32 h-32 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00D4FF, #C9A227)' }}>
                <div className="w-28 h-28 rounded-full flex items-center justify-center" style={{ backgroundColor: '#0A1628' }}>
                  <motion.span animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-5xl">🧠</motion.span>
                </div>
              </motion.div>
            </motion.div>
            {phase >= 2 && [{ icon: '📊', angle: -60, color: '#4ECDC4' }, { icon: '🔍', angle: 0, color: '#6495ED' }, { icon: '💡', angle: 60, color: '#FFD700' }, { icon: '⚡', angle: 120, color: '#C9A227' }, { icon: '🎯', angle: 180, color: '#ef4444' }, { icon: '📈', angle: 240, color: '#4ECDC4' }].map((node, i) => {
              const x = Math.cos((node.angle * Math.PI) / 180) * 110;
              const y = Math.sin((node.angle * Math.PI) / 180) * 110;
              return (<motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} className="absolute top-1/2 left-1/2" style={{ marginLeft: x - 20, marginTop: y - 20 }}><motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }} className="w-10 h-10 rounded-lg flex items-center justify-center border" style={{ backgroundColor: node.color + '20', borderColor: node.color }}><span className="text-lg">{node.icon}</span></motion.div></motion.div>);
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Promotion Pipeline
function PromotionPipeline() {
  const [phase, setPhase] = useState(0);
  const candidates = [
    { name: 'Alex Chen', score: 4.5, level: 'Associate', status: 'ready', avatar: '👨‍💻' },
    { name: 'Sam Williams', score: 4.2, level: 'VP', status: 'ready', avatar: '👩‍💼' },
    { name: 'Jordan Smith', score: 3.8, level: 'Associate', status: 'developing', avatar: '👨‍🔬' },
    { name: 'Taylor Brown', score: 4.0, level: 'Analyst', status: 'review', avatar: '👩‍🎓' },
  ];
  const stages = [{ id: 'identified', label: 'Identified', icon: '🎯' }, { id: 'reviewed', label: 'Under Review', icon: '🔍' }, { id: 'approved', label: 'Approved', icon: '✅' }, { id: 'promoted', label: 'Promoted', icon: '🚀' }];
  useEffect(() => { setTimeout(() => setPhase(1), 500); setTimeout(() => setPhase(2), 1500); setTimeout(() => setPhase(3), 2500); setTimeout(() => setPhase(4), 3500); }, []);
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-bold text-white mb-2">Promo Readiness Pipeline</motion.h2>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-gray-400 mb-8">Data-driven candidate identification and tracking</motion.p>
      <div className="w-full max-w-5xl mb-8">
        <div className="flex justify-between items-center relative">
          <div className="absolute left-0 right-0 top-1/2 h-2 rounded-full -translate-y-1/2" style={{ backgroundColor: '#0F1F35' }} />
          <motion.div initial={{ width: 0 }} animate={{ width: phase >= 4 ? '100%' : phase >= 3 ? '66%' : phase >= 2 ? '33%' : '0%' }} transition={{ duration: 0.8 }} className="absolute left-0 top-1/2 h-2 rounded-full -translate-y-1/2" style={{ background: 'linear-gradient(90deg, #00D4FF, #C9A227)' }} />
          {stages.map((stage, i) => (<motion.div key={stage.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: phase >= 1 ? 1 : 0, scale: phase >= i + 1 ? 1 : 0.8 }} transition={{ delay: i * 0.2 }} className="relative z-10 flex flex-col items-center"><motion.div animate={{ backgroundColor: phase >= i + 1 ? '#00D4FF' : '#0F1F35' }} className="w-16 h-16 rounded-full border-4 flex items-center justify-center text-2xl" style={{ borderColor: '#00D4FF' }}>{stage.icon}</motion.div><p className="mt-2 text-sm font-medium text-white">{stage.label}</p></motion.div>))}
        </div>
      </div>
      <div className="w-full max-w-5xl grid grid-cols-4 gap-4">
        {candidates.map((candidate, i) => (<motion.div key={candidate.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 20 }} transition={{ delay: i * 0.15 }} className="p-4 rounded-xl border-2" style={{ backgroundColor: '#0F1F35', borderColor: candidate.status === 'ready' ? '#00D4FF' : candidate.status === 'review' ? '#C9A227' : '#00D4FF30' }}><div className="text-center mb-3"><span className="text-4xl">{candidate.avatar}</span></div><h4 className="font-medium text-white text-center">{candidate.name}</h4><p className="text-xs text-gray-500 text-center mb-3">{candidate.level}</p><div className="relative w-20 h-20 mx-auto mb-3"><svg className="w-full h-full -rotate-90"><circle cx="40" cy="40" r="35" fill="none" stroke="#0A1628" strokeWidth="6" /><motion.circle cx="40" cy="40" r="35" fill="none" stroke={candidate.status === 'ready' ? '#4ECDC4' : candidate.status === 'review' ? '#FFD700' : '#6495ED'} strokeWidth="6" strokeLinecap="round" initial={{ strokeDasharray: '0 220' }} animate={{ strokeDasharray: (candidate.score / 5) * 220 + ' 220' }} transition={{ duration: 1, delay: 0.5 + i * 0.15 }} /></svg><div className="absolute inset-0 flex items-center justify-center"><span className="text-lg font-bold text-white">{candidate.score}</span></div></div><div className="text-center text-xs py-1 px-2 rounded-full" style={{ backgroundColor: candidate.status === 'ready' ? '#00D4FF20' : candidate.status === 'review' ? '#C9A22720' : '#00D4FF10', color: candidate.status === 'ready' ? '#00D4FF' : candidate.status === 'review' ? '#C9A227' : '#6B7C93' }}>{candidate.status === 'ready' && '✓ Promotion Ready'}{candidate.status === 'review' && '⏳ Under Review'}{candidate.status === 'developing' && '📈 Developing'}</div></motion.div>))}
      </div>
    </div>
  );
}

// Feature Showcase
function FeatureShowcase({ phase = 0 }: { phase?: number }) {
  const [autoPhase, setAutoPhase] = useState(0);

  // Auto-trigger initial animations
  useEffect(() => {
    const timer1 = setTimeout(() => setAutoPhase(1), 500);
    const timer2 = setTimeout(() => setAutoPhase(2), 1200);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  // Effective phase: max of provided phase and auto phase
  const effectivePhase = Math.max(phase, autoPhase);

  const features = [
    { icon: '📊', title: 'Metrics Management Dashboard', description: 'Organization and team views with live performance metrics', color: '#4ECDC4' },
    { icon: '⚙️', title: 'Flexible Metrics Creation', description: 'Create and customize metrics on the fly', color: '#6495ED' },
    { icon: '🔄', title: 'Automated Rescoring', description: 'Scores update automatically as new data flows in', color: '#FFD700' },
    { icon: '👤', title: 'Employee Profiles', description: 'Radar charts, trends, and performance history', color: '#C9A227' },
    { icon: '🔌', title: 'API Integrations', description: 'Connect to your existing HR systems', color: '#4ECDC4' },
    { icon: '🧠', title: 'Performance Evaluation Sessions', description: 'LLM-powered insights to guide manager discussions', color: '#A855F7' },
    { icon: '💬', title: 'LLM-Powered 360° Feedback Scoring', description: 'AI analyzes employee feedback for objective scoring', color: '#22c55e' },
  ];
  // Active feature based on phase (phases 2+ cycle through features)
  const activeFeature = effectivePhase >= 2 ? Math.min(effectivePhase - 2, features.length - 1) : 0;
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-bold text-white mb-2">Key Features</motion.h2>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-gray-400 mb-8">Flexible metrics management for fair evaluations</motion.p>
      <div className="w-full max-w-5xl flex gap-8">
        <div className="flex-1 space-y-3">
          {features.map((feature, i) => (<motion.div key={feature.title} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} onClick={() => setActiveFeature(i)} className="p-4 rounded-xl border-2 cursor-pointer transition-all" style={{ backgroundColor: activeFeature === i ? '#00D4FF10' : '#0F1F35', borderColor: activeFeature === i ? '#00D4FF' : '#00D4FF30' }}><div className="flex items-center gap-3"><span className="text-2xl">{feature.icon}</span><div><h4 className="font-medium" style={{ color: activeFeature === i ? '#00D4FF' : '#fff' }}>{feature.title}</h4><p className="text-xs text-gray-500">{feature.description}</p></div>{activeFeature === i && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#00D4FF' }}><span className="text-xs" style={{ color: '#0A1628' }}>✓</span></motion.div>}</div></motion.div>))}
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-80 h-96 rounded-2xl border-2 overflow-hidden" style={{ backgroundColor: '#0F1F35', borderColor: '#00D4FF30' }}>
          <div className="p-4 border-b" style={{ borderColor: '#00D4FF30' }}><h4 className="font-medium text-white flex items-center gap-2"><span>{features[activeFeature].icon}</span>{features[activeFeature].title}</h4></div>
          <div className="h-72 p-4 flex items-center justify-center"><motion.div key={activeFeature} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center"><span className="text-6xl mb-4 block">{features[activeFeature].icon}</span><p className="text-gray-400 text-sm">{features[activeFeature].description}</p></motion.div></div>
        </motion.div>
      </div>
    </div>
  );
}

// Timeline Slide
function TimelineSlide({ content }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-bold text-white mb-8">{content.title}</motion.h2>
      <div className="w-full max-w-5xl">
        <div className="relative">
          <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2" style={{ background: 'linear-gradient(90deg, #00D4FF, #C9A227)' }} />
          <div className="flex justify-between">
            {content.timeline?.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2 }} className="relative flex flex-col items-center" style={{ width: '22%' }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 z-10" style={{ background: 'linear-gradient(135deg, #00D4FF, #C9A227)' }}>
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: '#0A1628' }}>{item.year}</div>
                </div>
                <h4 className="text-lg font-bold text-white text-center mb-1">{item.title}</h4>
                <p className="text-sm text-gray-400 text-center">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Chart Slide
function ChartSlide({ content }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-bold text-white mb-2">{content.title}</motion.h2>
      {content.subtitle && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-gray-400 mb-8">{content.subtitle}</motion.p>}
      <div className="w-full max-w-4xl flex items-end justify-center gap-8" style={{ height: '300px' }}>
        {content.chartData?.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }} className="flex flex-col items-center">
            <motion.div initial={{ height: 0 }} animate={{ height: (item.value / 100) * 200 }} transition={{ duration: 0.8, delay: 0.3 + i * 0.15 }} className="w-20 rounded-t-lg mb-2" style={{ backgroundColor: item.color }} />
            <span className="text-2xl font-bold text-white mb-1">{item.value}%</span>
            <span className="text-sm text-gray-400 text-center w-24">{item.label}</span>
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
  if (slide.type === 'timeline') {
    return <TimelineSlide content={slide.content} />;
  }
  if (slide.type === 'chart') {
    return <ChartSlide content={slide.content} />;
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
    // Evalio visualizations
    if (viz === 'engineering-score-journey') return <EngineeringScoreJourney phase={phase} />;
    if (viz === 'problem-visual') return <ProblemVisual />;
    if (viz === 'solution-visual') return <SolutionVisual />;
    if (viz === 'score-calculation') return <ScoreCalculation />;
    if (viz === 'level-weights') return <LevelWeights />;
    if (viz === 'team-benchmarking') return <TeamBenchmarking />;
    if (viz === 'ai-capabilities') return <AICapabilities />;
    if (viz === 'promotion-pipeline') return <PromotionPipeline />;
    if (viz === 'feature-showcase') return <FeatureShowcase phase={phase} />;
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
    // Get the demo data from static files
    const demoData = getDemo(demoId);
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
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
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
