'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { SlideContent } from '@/types/demo';

interface InteractiveSlideProps {
  content: SlideContent;
  slideId?: string;
  forcePhase?: number;
  isCapturing?: boolean;
  onPhaseChange?: (phase: number) => void;
}

// Context for passing capture props to visualizations
interface CaptureContextType {
  forcePhase?: number;
  isCapturing: boolean;
  onPhaseChange?: (phase: number) => void;
}

const CaptureContext = React.createContext<CaptureContextType>({ isCapturing: false });

// Message Inbox Visualization - Shows messages piling up
function MessageInbox() {
  const [messages, setMessages] = useState<number[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchIndex, setSearchIndex] = useState(-1);

  useEffect(() => {
    // Add messages one by one
    const addMessages = [0, 1, 2, 3, 4, 5, 6, 7];
    addMessages.forEach((i, idx) => {
      setTimeout(() => {
        setMessages(prev => [...prev, i]);
      }, 300 + idx * 200);
    });

    // Start searching animation after messages appear
    setTimeout(() => {
      setSearching(true);
    }, 2500);
  }, []);

  useEffect(() => {
    if (searching && searchIndex < 7) {
      const timer = setTimeout(() => {
        setSearchIndex(prev => prev + 1);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [searching, searchIndex]);

  const messageData = [
    { from: 'ABC Corp', to: 'XYZ Ltd', type: 'MT700', amount: '$2.5M' },
    { from: 'Global Trade', to: 'Asia Import', type: 'MT710', amount: '$1.8M' },
    { from: 'ABC Corp', to: 'XYZ Ltd', type: 'MT700', amount: '$3.1M' },
    { from: 'Euro Bank', to: 'Pacific Co', type: 'MT760', amount: '$5.0M' },
    { from: 'ABC Corp', to: 'XYZ Ltd', type: 'MT700', amount: '$2.2M' },
    { from: 'Trade Finance', to: 'Import Hub', type: 'MT400', amount: '$900K' },
    { from: 'ABC Corp', to: 'XYZ Ltd', type: 'MT700', amount: '$2.8M' },
    { from: 'Nordic Bank', to: 'South Trade', type: 'MT710', amount: '$4.2M' },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2"
      >
        New LC Request Arrives
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-[var(--text-secondary)] mb-8"
      >
        "I've seen this before... but where?"
      </motion.p>

      <div className="flex gap-8 items-start">
        {/* New Request Card */}
        <motion.div
          initial={{ opacity: 0, x: -50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="w-72 p-6 bg-[var(--accent-gold)]/20 border-2 border-[var(--accent-gold)] rounded-xl"
        >
          <div className="flex items-center gap-2 mb-4">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-3 h-3 rounded-full bg-[var(--accent-gold)]"
            />
            <span className="text-[var(--accent-gold)] font-semibold">NEW REQUEST</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Buyer:</span>
              <span className="text-[var(--text-primary)] font-medium">ABC Corp</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Supplier:</span>
              <span className="text-[var(--text-primary)] font-medium">XYZ Ltd</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Type:</span>
              <span className="text-[var(--text-primary)] font-medium">MT700 ELC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Amount:</span>
              <span className="text-[var(--text-primary)] font-medium">$2.4M</span>
            </div>
          </div>
        </motion.div>

        {/* Arrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: searching ? 1 : 0.3 }}
          className="flex items-center self-center"
        >
          <motion.svg
            animate={{ x: searching ? [0, 10, 0] : 0 }}
            transition={{ duration: 0.5, repeat: searching ? Infinity : 0 }}
            className="w-12 h-12 text-[var(--accent-cyan)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </motion.svg>
        </motion.div>

        {/* Message History */}
        <div className="w-80 h-96 bg-[var(--bg-secondary)] rounded-xl border border-[var(--accent-cyan)]/20 overflow-hidden">
          <div className="p-3 border-b border-[var(--accent-cyan)]/20 flex items-center gap-2">
            <span className="text-[var(--text-secondary)] text-sm">Historical Messages</span>
            {searching && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-[var(--accent-cyan)]"
              >
                Searching...
              </motion.span>
            )}
          </div>
          <div className="p-2 space-y-2 overflow-auto h-80">
            <AnimatePresence>
              {messages.map((i) => {
                const msg = messageData[i];
                const isMatch = msg.from === 'ABC Corp' && msg.to === 'XYZ Ltd';
                const isCurrentSearch = searchIndex === i;
                const isFound = searching && searchIndex > i && isMatch;

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      scale: isCurrentSearch ? 1.02 : 1,
                      borderColor: isFound ? 'rgba(78, 205, 196, 0.8)' : isCurrentSearch ? 'rgba(201, 162, 39, 0.5)' : 'rgba(0, 212, 255, 0.1)'
                    }}
                    className={`p-3 rounded-lg border transition-all ${
                      isFound ? 'bg-[var(--accent-cyan)]/10' : 'bg-[var(--bg-primary)]/50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs text-[var(--text-muted)]">{msg.type}</p>
                        <p className="text-sm text-[var(--text-primary)]">{msg.from} → {msg.to}</p>
                      </div>
                      <span className="text-xs text-[var(--text-secondary)]">{msg.amount}</span>
                    </div>
                    {isFound && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-2 pt-2 border-t border-[var(--accent-cyan)]/30"
                      >
                        <span className="text-xs text-[var(--accent-cyan)]">✓ Match found!</span>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: searching && searchIndex >= 7 ? 1 : 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-lg text-[var(--accent-cyan)]"
      >
        Found 4 similar transactions from the same buyer-supplier pair!
      </motion.p>
    </div>
  );
}

// Side-by-Side Comparison
function TemplateComparison() {
  const [showMatch, setShowMatch] = useState(false);
  const [copiedFields, setCopiedFields] = useState<string[]>([]);

  useEffect(() => {
    setTimeout(() => setShowMatch(true), 800);
  }, []);

  useEffect(() => {
    if (showMatch) {
      const fields = ['docReq', 'shipTerms', 'clauses', 'conditions'];
      fields.forEach((field, i) => {
        setTimeout(() => {
          setCopiedFields(prev => [...prev, field]);
        }, 1500 + i * 600);
      });
    }
  }, [showMatch]);

  const templateFields = [
    { id: 'docReq', label: 'Documentary Requirements', value: 'Commercial Invoice, B/L, Packing List, COO' },
    { id: 'shipTerms', label: 'Shipping Terms', value: 'CIF Hong Kong, Partial Shipment Allowed' },
    { id: 'clauses', label: 'Special Clauses', value: 'Late presentation acceptable up to 21 days' },
    { id: 'conditions', label: 'Payment Conditions', value: '90 days from B/L date, 2% discount if <30 days' },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2"
      >
        Template Matching in Action
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-[var(--text-secondary)] mb-8"
      >
        95% similar to Transaction TXN-2024-1234
      </motion.p>

      <div className="flex gap-6 items-start w-full max-w-5xl">
        {/* Historical Template */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 p-6 bg-[var(--bg-secondary)] rounded-xl border border-[var(--accent-cyan)]/30"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-[var(--accent-cyan)]" />
            <span className="text-[var(--accent-cyan)] font-semibold text-sm">HISTORICAL TEMPLATE</span>
          </div>
          <div className="text-xs text-[var(--text-muted)] mb-4">TXN-2024-1234 | 3 months ago</div>

          <div className="space-y-4">
            {templateFields.map((field) => (
              <motion.div
                key={field.id}
                animate={{
                  borderColor: copiedFields.includes(field.id) ? 'rgba(78, 205, 196, 0.8)' : 'rgba(0, 212, 255, 0.1)',
                  backgroundColor: copiedFields.includes(field.id) ? 'rgba(78, 205, 196, 0.1)' : 'transparent'
                }}
                className="p-3 rounded-lg border transition-all"
              >
                <p className="text-xs text-[var(--text-muted)] mb-1">{field.label}</p>
                <p className="text-sm text-[var(--text-primary)]">{field.value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Arrow animation */}
        <div className="flex flex-col items-center justify-center self-center gap-2">
          {copiedFields.map((field, i) => (
            <motion.div
              key={field}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[var(--accent-gold)]"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.div>
          ))}
        </div>

        {/* New Transaction */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: showMatch ? 1 : 0.5, x: 0 }}
          className="flex-1 p-6 bg-[var(--bg-secondary)] rounded-xl border border-[var(--accent-gold)]/30"
        >
          <div className="flex items-center gap-2 mb-4">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-[var(--accent-gold)]"
            />
            <span className="text-[var(--accent-gold)] font-semibold text-sm">NEW TRANSACTION</span>
          </div>
          <div className="text-xs text-[var(--text-muted)] mb-4">ABC Corp → XYZ Ltd | Today</div>

          <div className="space-y-4">
            {templateFields.map((field) => (
              <motion.div
                key={field.id}
                className="p-3 rounded-lg border border-[var(--accent-gold)]/20"
              >
                <p className="text-xs text-[var(--text-muted)] mb-1">{field.label}</p>
                <AnimatePresence mode="wait">
                  {copiedFields.includes(field.id) ? (
                    <motion.p
                      key="filled"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-[var(--accent-cyan)]"
                    >
                      {field.value} ✓
                    </motion.p>
                  ) : (
                    <motion.p
                      key="empty"
                      className="text-sm text-[var(--text-muted)] italic"
                    >
                      Waiting for input...
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {copiedFields.length === 4 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 flex items-center gap-4"
        >
          <div className="px-6 py-3 bg-[var(--accent-cyan)]/20 border border-[var(--accent-cyan)] rounded-xl">
            <span className="text-[var(--accent-cyan)] font-semibold">Time saved: 20 minutes</span>
          </div>
          <div className="px-6 py-3 bg-[var(--accent-gold)]/20 border border-[var(--accent-gold)] rounded-xl">
            <span className="text-[var(--accent-gold)] font-semibold">Errors prevented: 3</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Memory Train Visualization
function MemoryTrain() {
  const [activeNode, setActiveNode] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveNode(prev => (prev + 1) % 5);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const nodes = [
    { label: 'Transaction 1', date: 'Jan 2024', icon: '📄' },
    { label: 'Transaction 2', date: 'Mar 2024', icon: '📄' },
    { label: 'Transaction 3', date: 'Jun 2024', icon: '📄' },
    { label: 'Transaction 4', date: 'Sep 2024', icon: '📄' },
    { label: 'New Request', date: 'Today', icon: '⭐' },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2"
      >
        The Memory Train
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-[var(--text-secondary)] mb-12"
      >
        Each transaction builds on the knowledge of the past
      </motion.p>

      <div className="relative w-full max-w-4xl">
        {/* Track */}
        <div className="absolute top-1/2 left-0 right-0 h-2 bg-gradient-to-r from-[var(--accent-gold)] to-[var(--accent-cyan)] rounded-full -translate-y-1/2" />

        {/* Moving light */}
        <motion.div
          className="absolute top-1/2 h-2 w-20 bg-white/50 rounded-full -translate-y-1/2 blur-sm"
          animate={{ left: `${activeNode * 22}%` }}
          transition={{ duration: 0.5 }}
        />

        {/* Nodes */}
        <div className="relative flex justify-between">
          {nodes.map((node, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="flex flex-col items-center"
            >
              <motion.div
                animate={{
                  scale: activeNode === i ? 1.2 : 1,
                  borderColor: activeNode === i ? 'var(--accent-gold)' : 'var(--accent-cyan)'
                }}
                className={`w-16 h-16 rounded-full border-4 flex items-center justify-center text-2xl
                  ${activeNode === i ? 'bg-[var(--accent-gold)]/20' : 'bg-[var(--bg-secondary)]'}`}
              >
                {node.icon}
              </motion.div>
              <motion.div
                animate={{ opacity: activeNode === i ? 1 : 0.6 }}
                className="mt-4 text-center"
              >
                <p className="text-sm font-medium text-[var(--text-primary)]">{node.label}</p>
                <p className="text-xs text-[var(--text-muted)]">{node.date}</p>
              </motion.div>

              {/* Knowledge bubble */}
              {activeNode === i && i < 4 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute -bottom-20 px-4 py-2 bg-[var(--accent-cyan)]/20 border border-[var(--accent-cyan)] rounded-lg"
                >
                  <p className="text-xs text-[var(--accent-cyan)]">
                    Knowledge captured & stored
                  </p>
                </motion.div>
              )}

              {activeNode === i && i === 4 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-24 px-4 py-2 bg-[var(--accent-gold)]/20 border border-[var(--accent-gold)] rounded-lg"
                >
                  <p className="text-xs text-[var(--accent-gold)]">
                    Instant access to all past knowledge!
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-24 grid grid-cols-3 gap-8"
      >
        {[
          { value: '85%', label: 'Faster Processing' },
          { value: '60%', label: 'Fewer Errors' },
          { value: '100%', label: 'Knowledge Retention' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 + i * 0.2 }}
            className="text-center"
          >
            <p className="text-3xl font-bold text-[var(--accent-gold)]">{stat.value}</p>
            <p className="text-sm text-[var(--text-secondary)]">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

// Score Calculation Visualization - Shows multi-framework scoring
function ScoreCalculation() {
  const [phase, setPhase] = useState(0);
  const [animatedScores, setAnimatedScores] = useState<Record<string, number>>({});

  const frameworks = [
    { id: 'jira', name: 'JIRA', weight: 30, score: 4.2, color: '#4ECDC4' },
    { id: 'github', name: 'GitHub', weight: 35, score: 4.5, color: '#6495ED' },
    { id: 'confluence', name: 'Confluence', weight: 15, score: 3.8, color: '#FFD700' },
    { id: 'dora', name: 'DORA', weight: 20, score: 4.0, color: '#C9A227' },
  ];

  const finalScore = frameworks.reduce((acc, f) => acc + (f.score * f.weight / 100), 0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 4000),
      setTimeout(() => setPhase(4), 6000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (phase >= 2) {
      frameworks.forEach((f, i) => {
        setTimeout(() => {
          setAnimatedScores(prev => ({ ...prev, [f.id]: f.score }));
        }, i * 400);
      });
    }
  }, [phase]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2"
      >
        Multi-Framework Scoring
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-[var(--text-secondary)] mb-8"
      >
        Weighted combination for objective evaluation
      </motion.p>

      <div className="w-full max-w-4xl flex gap-8 items-center">
        {/* Framework scores */}
        <div className="flex-1 space-y-4">
          {frameworks.map((fw, i) => (
            <motion.div
              key={fw.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: phase >= 1 ? 1 : 0, x: phase >= 1 ? 0 : -30 }}
              transition={{ delay: i * 0.15 }}
              className="p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--accent-cyan)]/20"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-[var(--text-primary)]">{fw.name}</span>
                <span className="text-sm text-[var(--text-muted)]">{fw.weight}% weight</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-8 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: animatedScores[fw.id] ? `${(animatedScores[fw.id] / 5) * 100}%` : 0 }}
                    transition={{ duration: 0.8 }}
                    className="h-full rounded-full flex items-center justify-end pr-2"
                    style={{ backgroundColor: fw.color }}
                  >
                    {animatedScores[fw.id] && (
                      <span className="text-xs font-bold text-[var(--bg-primary)]">
                        {fw.score.toFixed(1)}
                      </span>
                    )}
                  </motion.div>
                </div>

                {phase >= 3 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-sm"
                  >
                    <span className="text-[var(--text-muted)]">×{fw.weight}% = </span>
                    <span className="font-bold" style={{ color: fw.color }}>
                      {(fw.score * fw.weight / 100).toFixed(2)}
                    </span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Calculation result */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: phase >= 3 ? 1 : 0, scale: phase >= 3 ? 1 : 0.8 }}
          className="flex flex-col items-center"
        >
          <div className="text-4xl mb-4">=</div>

          <motion.div
            animate={{
              boxShadow: phase >= 4
                ? ['0 0 30px rgba(78, 205, 196, 0.4)', '0 0 50px rgba(78, 205, 196, 0.6)', '0 0 30px rgba(78, 205, 196, 0.4)']
                : 'none'
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-40 h-40 rounded-full bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-gold)] flex items-center justify-center"
          >
            <div className="w-36 h-36 rounded-full bg-[var(--bg-primary)] flex flex-col items-center justify-center">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: phase >= 4 ? 1 : 0 }}
                className="text-4xl font-bold text-[var(--accent-cyan)]"
              >
                {finalScore.toFixed(1)}
              </motion.span>
              <span className="text-sm text-[var(--text-muted)]">Final Score</span>
            </div>
          </motion.div>

          {phase >= 4 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 px-4 py-2 bg-[var(--accent-cyan)]/20 border border-[var(--accent-cyan)] rounded-full"
            >
              <span className="text-[var(--accent-cyan)] font-semibold">High Performer</span>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Transparency note */}
      {phase >= 4 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-4 bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/30 rounded-xl max-w-2xl"
        >
          <p className="text-center text-[var(--text-secondary)]">
            <span className="text-[var(--accent-gold)] font-bold">Transparency:</span> Employees can see exactly how their score is calculated.
            No black boxes, no surprises.
          </p>
        </motion.div>
      )}
    </div>
  );
}

// Level-Adjusted Weights Visualization - Shows different weights per seniority with comparison diagrams
function LevelWeights() {
  const [activeLevel, setActiveLevel] = useState(0);
  const [phase, setPhase] = useState(0);
  const [showComparison, setShowComparison] = useState(false);

  const levels = [
    {
      name: 'Analyst',
      years: '0-2 years',
      color: '#4ECDC4',
      weights: { github: 40, jira: 30, confluence: 10, dora: 20 },
      focus: 'Execution & Learning',
    },
    {
      name: 'Associate',
      years: '2-4 years',
      color: '#6495ED',
      weights: { github: 35, jira: 30, confluence: 15, dora: 20 },
      focus: 'Building Autonomy',
    },
    {
      name: 'VP',
      years: '4-7 years',
      color: '#FFD700',
      weights: { github: 30, jira: 25, confluence: 20, dora: 25 },
      focus: 'Leadership Emerging',
    },
    {
      name: 'Director',
      years: '7+ years',
      color: '#C9A227',
      weights: { github: 20, jira: 15, confluence: 30, dora: 35 },
      focus: 'Strategy & Impact',
    },
  ];

  const metrics = [
    { key: 'github', label: 'GitHub', icon: '💻', color: '#4ECDC4' },
    { key: 'jira', label: 'JIRA', icon: '📋', color: '#6495ED' },
    { key: 'confluence', label: 'Confluence', icon: '📝', color: '#FFD700' },
    { key: 'dora', label: 'DORA', icon: '📊', color: '#C9A227' },
  ];

  // Calculate averages across all levels
  const averages = metrics.reduce((acc, metric) => {
    const sum = levels.reduce((s, level) => s + level.weights[metric.key as keyof typeof level.weights], 0);
    acc[metric.key] = Math.round(sum / levels.length);
    return acc;
  }, {} as Record<string, number>);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 1500),
      setTimeout(() => setShowComparison(true), 2500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (phase >= 3) {
      const interval = setInterval(() => {
        setActiveLevel((prev) => (prev + 1) % levels.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [phase]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2"
      >
        Level-Adjusted Weights
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-[var(--text-secondary)] mb-6"
      >
        Different expectations for different career stages
      </motion.p>

      <div className="w-full max-w-6xl flex gap-6">
        {/* Left: Stacked comparison chart */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: phase >= 1 ? 1 : 0, x: phase >= 1 ? 0 : -30 }}
          className="flex-1 p-6 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--accent-cyan)]/20"
        >
          <p className="text-sm text-[var(--text-muted)] mb-4">Weight Distribution by Level</p>

          {/* Stacked horizontal bars for each level */}
          <div className="space-y-3">
            {levels.map((level, levelIdx) => (
              <motion.div
                key={level.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: phase >= 2 ? 1 : 0, x: phase >= 2 ? 0 : -20 }}
                transition={{ delay: levelIdx * 0.1 }}
                className={`relative ${activeLevel === levelIdx ? 'scale-105' : 'scale-100'} transition-transform`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-20 text-right">
                    <span
                      className={`text-xs font-medium ${activeLevel === levelIdx ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}
                    >
                      {level.name}
                    </span>
                  </div>

                  {/* Stacked bar */}
                  <div className="flex-1 h-8 flex rounded-lg overflow-hidden bg-[var(--bg-primary)]">
                    {metrics.map((metric, metricIdx) => {
                      const weight = level.weights[metric.key as keyof typeof level.weights];
                      return (
                        <motion.div
                          key={metric.key}
                          initial={{ width: 0 }}
                          animate={{ width: `${weight}%` }}
                          transition={{ duration: 0.8, delay: levelIdx * 0.1 + metricIdx * 0.05 }}
                          className="h-full flex items-center justify-center relative group"
                          style={{ backgroundColor: metric.color }}
                        >
                          {weight >= 15 && (
                            <span className="text-xs font-bold text-[var(--bg-primary)]">{weight}%</span>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Active indicator */}
                {activeLevel === levelIdx && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full"
                    style={{ backgroundColor: level.color }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Legend */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 2 ? 1 : 0 }}
            className="flex justify-center gap-4 mt-4 pt-4 border-t border-[var(--accent-cyan)]/10"
          >
            {metrics.map((metric) => (
              <div key={metric.key} className="flex items-center gap-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: metric.color }} />
                <span className="text-xs text-[var(--text-muted)]">{metric.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Trend arrows showing weight shift */}
          {showComparison && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-[var(--bg-primary)]/50 rounded-lg"
            >
              <p className="text-xs text-center text-[var(--text-muted)] mb-2">Weight Shift: Junior → Senior</p>
              <div className="flex justify-around">
                <div className="text-center">
                  <span className="text-red-400 text-lg">↓</span>
                  <p className="text-xs text-[var(--text-muted)]">GitHub</p>
                  <p className="text-xs text-red-400">40% → 20%</p>
                </div>
                <div className="text-center">
                  <span className="text-red-400 text-lg">↓</span>
                  <p className="text-xs text-[var(--text-muted)]">JIRA</p>
                  <p className="text-xs text-red-400">30% → 15%</p>
                </div>
                <div className="text-center">
                  <span className="text-green-400 text-lg">↑</span>
                  <p className="text-xs text-[var(--text-muted)]">Confluence</p>
                  <p className="text-xs text-green-400">10% → 30%</p>
                </div>
                <div className="text-center">
                  <span className="text-green-400 text-lg">↑</span>
                  <p className="text-xs text-[var(--text-muted)]">DORA</p>
                  <p className="text-xs text-green-400">20% → 35%</p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Right: Org average calculation */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: phase >= 2 ? 1 : 0, x: phase >= 2 ? 0 : 30 }}
          className="w-72 flex flex-col gap-4"
        >
          {/* Current level detail */}
          <div
            className="p-4 bg-[var(--bg-secondary)] rounded-xl border-2 transition-colors"
            style={{ borderColor: levels[activeLevel].color }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{ backgroundColor: `${levels[activeLevel].color}30`, color: levels[activeLevel].color }}
              >
                {levels[activeLevel].name[0]}
              </div>
              <div>
                <p className="font-semibold text-[var(--text-primary)]">{levels[activeLevel].name}</p>
                <p className="text-xs text-[var(--text-muted)]">{levels[activeLevel].years}</p>
              </div>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mb-3">Focus: {levels[activeLevel].focus}</p>

            {/* Mini weight bars */}
            <div className="space-y-2">
              {metrics.map((metric) => {
                const weight = levels[activeLevel].weights[metric.key as keyof typeof levels[0]['weights']];
                return (
                  <div key={metric.key} className="flex items-center gap-2">
                    <span className="text-sm">{metric.icon}</span>
                    <div className="flex-1 h-2 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                      <motion.div
                        key={`${activeLevel}-${metric.key}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${weight}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: metric.color }}
                      />
                    </div>
                    <span className="text-xs w-8 text-right" style={{ color: metric.color }}>{weight}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Organization average */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showComparison ? 1 : 0, y: showComparison ? 0 : 20 }}
            className="p-4 bg-gradient-to-br from-[var(--accent-cyan)]/10 to-[var(--accent-gold)]/10 rounded-xl border border-[var(--accent-cyan)]/30"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-gold)] flex items-center justify-center">
                <span className="text-sm">Σ</span>
              </div>
              <div>
                <p className="font-semibold text-[var(--text-primary)]">Org Average</p>
                <p className="text-xs text-[var(--text-muted)]">Across all levels</p>
              </div>
            </div>

            {/* Average calculation visual */}
            <div className="space-y-2">
              {metrics.map((metric) => (
                <div key={metric.key} className="flex items-center gap-2">
                  <span className="text-sm">{metric.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                      {levels.map((level, i) => (
                        <span key={level.name}>
                          {level.weights[metric.key as keyof typeof level.weights]}
                          {i < levels.length - 1 && <span className="mx-0.5">+</span>}
                        </span>
                      ))}
                      <span className="mx-1">=</span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[var(--accent-cyan)]">{averages[metric.key]}%</span>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-[var(--accent-cyan)]/20">
              <p className="text-xs text-center text-[var(--text-secondary)]">
                ÷ {levels.length} levels = weighted org score
              </p>
            </div>
          </motion.div>

          {/* Level selector buttons */}
          <div className="flex flex-wrap gap-1 justify-center">
            {levels.map((level, i) => (
              <motion.button
                key={level.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: phase >= 1 ? 1 : 0, scale: phase >= 1 ? 1 : 0.8 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setActiveLevel(i)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  activeLevel === i
                    ? 'ring-2 ring-offset-2 ring-offset-[var(--bg-primary)]'
                    : 'opacity-60 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: `${level.color}30`,
                  color: level.color,
                  borderColor: level.color
                }}
              >
                {level.name}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Promotion Pipeline Visualization - Shows candidates moving through stages
function PromotionPipeline() {
  const [phase, setPhase] = useState(0);
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);

  const candidates = [
    { name: 'Alex Chen', score: 4.5, level: 'Associate', yearsInRole: 2.5, status: 'ready', avatar: '👨‍💻' },
    { name: 'Sam Williams', score: 4.2, level: 'VP', yearsInRole: 3.0, status: 'ready', avatar: '👩‍💼' },
    { name: 'Jordan Smith', score: 3.8, level: 'Associate', yearsInRole: 1.5, status: 'developing', avatar: '👨‍🔬' },
    { name: 'Taylor Brown', score: 4.0, level: 'Analyst', yearsInRole: 2.0, status: 'review', avatar: '👩‍🎓' },
  ];

  const stages = [
    { id: 'identified', label: 'Identified', icon: '🎯' },
    { id: 'reviewed', label: 'Under Review', icon: '🔍' },
    { id: 'approved', label: 'Approved', icon: '✅' },
    { id: 'promoted', label: 'Promoted', icon: '🚀' },
  ];

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 3500),
      setTimeout(() => setPhase(4), 5000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2"
      >
        Promotion Pipeline
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-[var(--text-secondary)] mb-8"
      >
        Data-driven candidate identification and tracking
      </motion.p>

      {/* Pipeline stages */}
      <div className="w-full max-w-5xl mb-8">
        <div className="flex justify-between items-center relative">
          {/* Progress line */}
          <div className="absolute left-0 right-0 top-1/2 h-2 bg-[var(--bg-secondary)] -translate-y-1/2 rounded-full" />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: phase >= 4 ? '100%' : phase >= 3 ? '66%' : phase >= 2 ? '33%' : '0%' }}
            transition={{ duration: 0.8 }}
            className="absolute left-0 top-1/2 h-2 bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-gold)] -translate-y-1/2 rounded-full"
          />

          {stages.map((stage, i) => (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: phase >= 1 ? 1 : 0,
                scale: phase >= i + 1 ? 1 : 0.8,
              }}
              transition={{ delay: i * 0.2 }}
              className="relative z-10 flex flex-col items-center"
            >
              <motion.div
                animate={{
                  backgroundColor: phase >= i + 1 ? 'var(--accent-cyan)' : 'var(--bg-secondary)',
                  borderColor: phase >= i + 1 ? 'var(--accent-cyan)' : 'var(--accent-cyan)',
                }}
                className="w-16 h-16 rounded-full border-4 flex items-center justify-center text-2xl bg-[var(--bg-secondary)]"
              >
                {stage.icon}
              </motion.div>
              <p className="mt-2 text-sm font-medium text-[var(--text-primary)]">{stage.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Candidates grid */}
      <div className="w-full max-w-5xl grid grid-cols-4 gap-4">
        {candidates.map((candidate, i) => (
          <motion.div
            key={candidate.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 20 }}
            transition={{ delay: i * 0.15 }}
            onClick={() => setSelectedCandidate(selectedCandidate === i ? null : i)}
            className={`p-4 bg-[var(--bg-secondary)] rounded-xl border-2 cursor-pointer transition-all ${
              candidate.status === 'ready'
                ? 'border-[var(--accent-cyan)]'
                : candidate.status === 'review'
                ? 'border-[var(--accent-gold)]'
                : 'border-[var(--accent-cyan)]/20'
            } ${selectedCandidate === i ? 'scale-105 shadow-lg' : 'hover:scale-102'}`}
          >
            <div className="text-center mb-3">
              <span className="text-4xl">{candidate.avatar}</span>
            </div>
            <h4 className="font-medium text-[var(--text-primary)] text-center">{candidate.name}</h4>
            <p className="text-xs text-[var(--text-muted)] text-center mb-3">{candidate.level}</p>

            {/* Score ring */}
            <div className="relative w-20 h-20 mx-auto mb-3">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="35"
                  fill="none"
                  stroke="var(--bg-primary)"
                  strokeWidth="6"
                />
                <motion.circle
                  cx="40"
                  cy="40"
                  r="35"
                  fill="none"
                  stroke={candidate.status === 'ready' ? '#4ECDC4' : candidate.status === 'review' ? '#FFD700' : '#6495ED'}
                  strokeWidth="6"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: '0 220' }}
                  animate={{ strokeDasharray: `${(candidate.score / 5) * 220} 220` }}
                  transition={{ duration: 1, delay: 0.5 + i * 0.15 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-[var(--text-primary)]">{candidate.score}</span>
              </div>
            </div>

            {/* Status badge */}
            <div
              className={`text-center text-xs py-1 px-2 rounded-full ${
                candidate.status === 'ready'
                  ? 'bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)]'
                  : candidate.status === 'review'
                  ? 'bg-[var(--accent-gold)]/20 text-[var(--accent-gold)]'
                  : 'bg-[var(--accent-cyan)]/10 text-[var(--text-muted)]'
              }`}
            >
              {candidate.status === 'ready' && '✓ Promotion Ready'}
              {candidate.status === 'review' && '⏳ Under Review'}
              {candidate.status === 'developing' && '📈 Developing'}
            </div>

            {/* Expanded details */}
            {selectedCandidate === i && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3 pt-3 border-t border-[var(--accent-cyan)]/20 text-xs"
              >
                <p className="text-[var(--text-muted)]">
                  Years in role: <span className="text-[var(--text-primary)]">{candidate.yearsInRole}</span>
                </p>
                <p className="text-[var(--text-muted)] mt-1">
                  Peer rank: <span className="text-[var(--accent-cyan)]">Top 15%</span>
                </p>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      {phase >= 4 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex gap-6"
        >
          <div className="px-6 py-3 bg-[var(--accent-cyan)]/20 border border-[var(--accent-cyan)] rounded-xl">
            <span className="text-[var(--accent-cyan)] font-semibold">2 Ready for Promotion</span>
          </div>
          <div className="px-6 py-3 bg-[var(--accent-gold)]/20 border border-[var(--accent-gold)] rounded-xl">
            <span className="text-[var(--accent-gold)] font-semibold">1 Under Review</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Feature Showcase Visualization - Animated feature cards
function FeatureShowcase() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [phase, setPhase] = useState(0);

  const features = [
    {
      icon: '📊',
      title: 'Real-time Dashboards',
      description: 'Organization and team views with live metrics',
      visual: 'dashboard',
      color: '#4ECDC4',
    },
    {
      icon: '👤',
      title: 'Employee Profiles',
      description: 'Radar charts, trends, and performance history',
      visual: 'profile',
      color: '#6495ED',
    },
    {
      icon: '📥',
      title: 'Bulk Data Import',
      description: 'AI-powered field mapping for seamless migration',
      visual: 'import',
      color: '#FFD700',
    },
    {
      icon: '🔐',
      title: 'Role-Based Access',
      description: 'Granular permissions for sensitive data',
      visual: 'security',
      color: '#C9A227',
    },
    {
      icon: '🔌',
      title: 'API Integrations',
      description: 'Connect to your existing HR systems',
      visual: 'api',
      color: '#4ECDC4',
    },
  ];

  useEffect(() => {
    setTimeout(() => setPhase(1), 500);
    setTimeout(() => setPhase(2), 1500);
  }, []);

  useEffect(() => {
    if (phase >= 2) {
      const interval = setInterval(() => {
        setActiveFeature((prev) => (prev + 1) % features.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [phase]);

  const currentFeature = features[activeFeature];

  // Mini visualizations for each feature
  const renderVisual = (type: string) => {
    switch (type) {
      case 'dashboard':
        return (
          <div className="flex gap-2 h-full items-end justify-center pb-4">
            {[60, 80, 45, 90, 70].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="w-8 rounded-t"
                style={{ backgroundColor: i === 3 ? '#4ECDC4' : '#4ECDC420' }}
              />
            ))}
          </div>
        );
      case 'profile':
        return (
          <div className="flex items-center justify-center h-full">
            <svg viewBox="0 0 100 100" className="w-32 h-32">
              <motion.polygon
                points="50,10 90,35 90,75 50,100 10,75 10,35"
                fill="none"
                stroke="#4ECDC420"
                strokeWidth="2"
              />
              <motion.polygon
                initial={{ points: '50,50 50,50 50,50 50,50 50,50 50,50' }}
                animate={{ points: '50,25 75,40 75,70 50,85 25,70 25,40' }}
                transition={{ duration: 1 }}
                fill="#4ECDC430"
                stroke="#4ECDC4"
                strokeWidth="2"
              />
            </svg>
          </div>
        );
      case 'import':
        return (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: i * 0.2, repeat: Infinity, repeatDelay: 2 }}
                className="flex items-center gap-2"
              >
                <div className="w-16 h-2 bg-[var(--accent-cyan)]/30 rounded" />
                <span className="text-[var(--accent-cyan)]">→</span>
                <div className="w-16 h-2 bg-[var(--accent-cyan)] rounded" />
              </motion.div>
            ))}
          </div>
        );
      case 'security':
        return (
          <div className="flex items-center justify-center h-full">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-20 h-24 bg-[var(--accent-gold)]/20 rounded-t-full rounded-b-lg border-2 border-[var(--accent-gold)] flex items-center justify-center"
            >
              <span className="text-3xl">🔒</span>
            </motion.div>
          </div>
        );
      case 'api':
        return (
          <div className="flex items-center justify-center h-full gap-4">
            <div className="w-12 h-12 rounded-lg bg-[var(--accent-cyan)]/20 flex items-center justify-center text-xl">📦</div>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="text-[var(--accent-cyan)]"
            >
              ⟷
            </motion.div>
            <div className="w-12 h-12 rounded-lg bg-[var(--accent-cyan)]/20 flex items-center justify-center text-xl">🏢</div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2"
      >
        Key Features
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-[var(--text-secondary)] mb-8"
      >
        Everything you need for fair evaluations
      </motion.p>

      <div className="w-full max-w-5xl flex gap-8">
        {/* Feature list */}
        <div className="flex-1 space-y-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: phase >= 1 ? 1 : 0, x: phase >= 1 ? 0 : -20 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setActiveFeature(i)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                activeFeature === i
                  ? 'border-[var(--accent-cyan)] bg-[var(--accent-cyan)]/10'
                  : 'border-[var(--accent-cyan)]/20 hover:border-[var(--accent-cyan)]/50 bg-[var(--bg-secondary)]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{feature.icon}</span>
                <div>
                  <h4
                    className={`font-medium ${
                      activeFeature === i ? 'text-[var(--accent-cyan)]' : 'text-[var(--text-primary)]'
                    }`}
                  >
                    {feature.title}
                  </h4>
                  <p className="text-xs text-[var(--text-muted)]">{feature.description}</p>
                </div>
                {activeFeature === i && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto w-6 h-6 rounded-full bg-[var(--accent-cyan)] flex items-center justify-center"
                  >
                    <span className="text-xs text-[var(--bg-primary)]">✓</span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: phase >= 2 ? 1 : 0, scale: phase >= 2 ? 1 : 0.9 }}
          className="w-80 h-96 bg-[var(--bg-secondary)] rounded-2xl border-2 border-[var(--accent-cyan)]/30 overflow-hidden"
        >
          {/* Preview header */}
          <div className="p-4 border-b border-[var(--accent-cyan)]/20">
            <motion.h4
              key={activeFeature}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-medium text-[var(--text-primary)] flex items-center gap-2"
            >
              <span>{currentFeature.icon}</span>
              {currentFeature.title}
            </motion.h4>
          </div>

          {/* Preview content */}
          <motion.div
            key={activeFeature}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-72 p-4"
          >
            {renderVisual(currentFeature.visual)}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// Problem Visual - Split layout with bullets and broken review animation
function ProblemVisual() {
  const [visibleBullets, setVisibleBullets] = useState<number[]>([]);
  const [phase, setPhase] = useState(0);

  const bullets = [
    { icon: '😤', text: '73% of employees believe reviews are biased by manager relationships' },
    { icon: '🎭', text: 'Promotions based on perception, not actual contribution' },
    { icon: '❓', text: 'No visibility into how scores are calculated' },
    { icon: '📊', text: 'Manual data gathering from scattered systems' },
    { icon: '🚪', text: 'High performers leave when passed over unfairly' },
  ];

  useEffect(() => {
    bullets.forEach((_, i) => {
      setTimeout(() => {
        setVisibleBullets(prev => [...prev, i]);
      }, 500 + i * 400);
    });
    setTimeout(() => setPhase(1), 1000);
    setTimeout(() => setPhase(2), 2500);
    setTimeout(() => setPhase(3), 4000);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="w-full max-w-6xl flex gap-12 items-center">
        {/* Left side - Content */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-2">The Problem</h2>
            <p className="text-xl text-[var(--text-secondary)]">Performance reviews are broken</p>
          </motion.div>

          <div className="space-y-4">
            {bullets.map((bullet, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                animate={{
                  opacity: visibleBullets.includes(i) ? 1 : 0,
                  x: visibleBullets.includes(i) ? 0 : -30,
                }}
                transition={{ duration: 0.4 }}
                className="flex items-start gap-3 p-3 bg-[var(--bg-secondary)]/50 rounded-lg border-l-4 border-red-500/50"
              >
                <span className="text-2xl">{bullet.icon}</span>
                <p className="text-[var(--text-primary)] leading-relaxed">{bullet.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right side - Visual */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-80 h-80">
            {/* Central confused employee */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: phase >= 1 ? 1 : 0 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-[var(--bg-secondary)] border-4 border-[var(--accent-cyan)]/30 flex items-center justify-center z-10"
            >
              <motion.span
                animate={{ rotate: phase >= 2 ? [0, -10, 10, -10, 0] : 0 }}
                transition={{ duration: 0.5, repeat: phase >= 2 ? Infinity : 0, repeatDelay: 2 }}
                className="text-5xl"
              >
                😕
              </motion.span>
            </motion.div>

            {/* Orbiting review elements */}
            {[
              { emoji: '📝', label: 'Subjective', angle: 0, color: '#ef4444' },
              { emoji: '👁️', label: 'Biased', angle: 72, color: '#f97316' },
              { emoji: '🎲', label: 'Random', angle: 144, color: '#eab308' },
              { emoji: '📉', label: 'Unfair', angle: 216, color: '#ef4444' },
              { emoji: '🤷', label: 'Unclear', angle: 288, color: '#f97316' },
            ].map((item, i) => {
              const radius = 120;
              const x = Math.cos((item.angle * Math.PI) / 180) * radius;
              const y = Math.sin((item.angle * Math.PI) / 180) * radius;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: phase >= 2 ? 1 : 0,
                    scale: phase >= 2 ? 1 : 0,
                    x: phase >= 3 ? [x, x + 5, x - 5, x] : x,
                    y: phase >= 3 ? [y, y - 5, y + 5, y] : y,
                  }}
                  transition={{
                    opacity: { delay: i * 0.1 },
                    x: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                    y: { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
                  }}
                  className="absolute top-1/2 left-1/2"
                  style={{ marginLeft: -28, marginTop: -28 }}
                >
                  <div
                    className="w-14 h-14 rounded-xl flex flex-col items-center justify-center border-2"
                    style={{ backgroundColor: `${item.color}20`, borderColor: item.color }}
                  >
                    <span className="text-xl">{item.emoji}</span>
                    <span className="text-[8px] font-bold" style={{ color: item.color }}>
                      {item.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}

            {/* Chaos lines */}
            {phase >= 3 && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.line
                    key={i}
                    x1="50%"
                    y1="50%"
                    x2={`${50 + Math.cos((i * 72 * Math.PI) / 180) * 35}%`}
                    y2={`${50 + Math.sin((i * 72 * Math.PI) / 180) * 35}%`}
                    stroke="#ef4444"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.5 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  />
                ))}
              </svg>
            )}

            {/* Warning badge */}
            {phase >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-red-500/20 border border-red-500 rounded-full"
              >
                <span className="text-red-400 text-sm font-semibold">⚠️ Broken System</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Solution Visual - Split layout with bullets and unified system animation
function SolutionVisual() {
  const [visibleBullets, setVisibleBullets] = useState<number[]>([]);
  const [phase, setPhase] = useState(0);
  const [dataParticles, setDataParticles] = useState<string[]>([]);

  const bullets = [
    { icon: '🔗', text: 'Live data integration from JIRA, GitHub, Confluence' },
    { icon: '📐', text: 'Multi-framework evaluation: DORA + SPACE + Custom metrics' },
    { icon: '🤖', text: 'AI-powered analysis eliminates human bias' },
    { icon: '🔍', text: 'Transparent scoring - employees see the math' },
    { icon: '⚖️', text: 'Level-adjusted weights: Junior vs Senior expectations differ' },
  ];

  useEffect(() => {
    bullets.forEach((_, i) => {
      setTimeout(() => {
        setVisibleBullets(prev => [...prev, i]);
      }, 500 + i * 400);
    });
    setTimeout(() => setPhase(1), 1000);
    setTimeout(() => setPhase(2), 2500);
    setTimeout(() => setPhase(3), 4000);
  }, []);

  useEffect(() => {
    if (phase >= 2) {
      const interval = setInterval(() => {
        setDataParticles(prev => [...prev, `p-${Date.now()}`].slice(-8));
      }, 400);
      return () => clearInterval(interval);
    }
  }, [phase]);

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="w-full max-w-6xl flex gap-12 items-center">
        {/* Left side - Content */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-2">The Solution</h2>
            <p className="text-xl text-[var(--text-secondary)]">Evalio: Where work happens, scores follow</p>
          </motion.div>

          <div className="space-y-4">
            {bullets.map((bullet, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                animate={{
                  opacity: visibleBullets.includes(i) ? 1 : 0,
                  x: visibleBullets.includes(i) ? 0 : -30,
                }}
                transition={{ duration: 0.4 }}
                className="flex items-start gap-3 p-3 bg-[var(--bg-secondary)]/50 rounded-lg border-l-4 border-[var(--accent-cyan)]/50"
              >
                <span className="text-2xl">{bullet.icon}</span>
                <p className="text-[var(--text-primary)] leading-relaxed">{bullet.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right side - Visual */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-96 h-80">
            {/* Data sources */}
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-center gap-4">
              {[
                { icon: '📋', label: 'JIRA', color: '#4ECDC4' },
                { icon: '💻', label: 'GitHub', color: '#6495ED' },
                { icon: '📝', label: 'Confluence', color: '#FFD700' },
              ].map((source, i) => (
                <motion.div
                  key={source.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: phase >= 1 ? 1 : 0, x: phase >= 1 ? 0 : -20 }}
                  transition={{ delay: i * 0.2 }}
                  className="w-16 h-16 rounded-xl flex flex-col items-center justify-center border-2"
                  style={{ borderColor: source.color, backgroundColor: `${source.color}20` }}
                >
                  <span className="text-2xl">{source.icon}</span>
                  <span className="text-[10px] font-bold" style={{ color: source.color }}>
                    {source.label}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Central Evalio hub */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: phase >= 2 ? 1 : 0,
                opacity: phase >= 2 ? 1 : 0,
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <motion.div
                animate={{
                  boxShadow: phase >= 3
                    ? ['0 0 20px rgba(78, 205, 196, 0.3)', '0 0 40px rgba(78, 205, 196, 0.5)', '0 0 20px rgba(78, 205, 196, 0.3)']
                    : 'none',
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-28 h-28 rounded-2xl bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-gold)] flex items-center justify-center"
              >
                <div className="w-24 h-24 rounded-xl bg-[var(--bg-primary)] flex flex-col items-center justify-center">
                  <span className="text-lg font-bold text-[var(--accent-cyan)]">Evalio</span>
                  <span className="text-xs text-[var(--text-muted)]">AI Engine</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Output score */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: phase >= 3 ? 1 : 0, x: phase >= 3 ? 0 : 20 }}
              className="absolute right-0 top-1/2 -translate-y-1/2"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-gold)] flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[var(--bg-primary)] flex flex-col items-center justify-center">
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xl font-bold text-[var(--accent-cyan)]"
                  >
                    4.2
                  </motion.span>
                  <span className="text-[8px] text-[var(--text-muted)]">Score</span>
                </div>
              </div>
            </motion.div>

            {/* Flow arrows */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Left to center arrows */}
              {phase >= 2 && [0, 1, 2].map((i) => (
                <motion.path
                  key={`left-${i}`}
                  d={`M 70 ${100 + i * 60} Q 130 ${140} 155 140`}
                  stroke={['#4ECDC4', '#6495ED', '#FFD700'][i]}
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: i * 0.2 }}
                />
              ))}
              {/* Center to right arrow */}
              {phase >= 3 && (
                <motion.path
                  d="M 230 140 L 290 140"
                  stroke="var(--accent-cyan)"
                  strokeWidth="3"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                  markerEnd="url(#arrowhead)"
                />
              )}
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="var(--accent-cyan)" />
                </marker>
              </defs>
            </svg>

            {/* Data particles */}
            {dataParticles.map((id, i) => (
              <motion.div
                key={id}
                initial={{ left: 70, top: 100 + (i % 3) * 60, opacity: 1 }}
                animate={{ left: 155, top: 140, opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute w-2 h-2 rounded-full bg-[var(--accent-cyan)]"
              />
            ))}

            {/* Success badge */}
            {phase >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-2 bg-[var(--accent-cyan)]/20 border border-[var(--accent-cyan)] rounded-full"
              >
                <span className="text-[var(--accent-cyan)] text-sm font-semibold">✓ Objective & Transparent</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// AI Capabilities Visual - Split layout with bullets and AI brain animation
function AICapabilities() {
  const [visibleBullets, setVisibleBullets] = useState<number[]>([]);
  const [phase, setPhase] = useState(0);
  const [pulseRings, setPulseRings] = useState<number[]>([]);

  const bullets = [
    { icon: '✅', text: 'Narrative validation: AI checks manager stories against actual data', color: '#4ECDC4' },
    { icon: '🎯', text: 'Bias detection: Flags inconsistencies between feedback and metrics', color: '#ef4444' },
    { icon: '📈', text: 'Promotion readiness: Objective assessment with development recommendations', color: '#FFD700' },
    { icon: '💬', text: 'Conversational insights: Ask questions in natural language', color: '#6495ED' },
    { icon: '👥', text: 'Comparative analysis: How does Employee A compare to their peers?', color: '#C9A227' },
  ];

  useEffect(() => {
    bullets.forEach((_, i) => {
      setTimeout(() => {
        setVisibleBullets(prev => [...prev, i]);
      }, 500 + i * 400);
    });
    setTimeout(() => setPhase(1), 1000);
    setTimeout(() => setPhase(2), 2500);
    setTimeout(() => setPhase(3), 4000);
  }, []);

  useEffect(() => {
    if (phase >= 2) {
      const interval = setInterval(() => {
        setPulseRings(prev => [...prev, Date.now()].slice(-3));
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [phase]);

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="w-full max-w-6xl flex gap-12 items-center">
        {/* Left side - Content */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-2">AI-Powered Intelligence</h2>
            <p className="text-xl text-[var(--text-secondary)]">Claude analyzes what humans miss</p>
          </motion.div>

          <div className="space-y-4">
            {bullets.map((bullet, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                animate={{
                  opacity: visibleBullets.includes(i) ? 1 : 0,
                  x: visibleBullets.includes(i) ? 0 : -30,
                }}
                transition={{ duration: 0.4 }}
                className="flex items-start gap-3 p-3 bg-[var(--bg-secondary)]/50 rounded-lg border-l-4"
                style={{ borderLeftColor: bullet.color }}
              >
                <span className="text-2xl">{bullet.icon}</span>
                <p className="text-[var(--text-primary)] leading-relaxed">{bullet.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right side - AI Brain Visual */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-80 h-80">
            {/* Pulse rings */}
            {pulseRings.map((id) => (
              <motion.div
                key={id}
                initial={{ scale: 0.5, opacity: 0.8 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 2 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-[var(--accent-cyan)]"
              />
            ))}

            {/* Central AI brain */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: phase >= 1 ? 1 : 0 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <motion.div
                animate={{
                  boxShadow: phase >= 2
                    ? ['0 0 30px rgba(78, 205, 196, 0.4)', '0 0 50px rgba(201, 162, 39, 0.4)', '0 0 30px rgba(78, 205, 196, 0.4)']
                    : 'none',
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-32 h-32 rounded-full bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-gold)] flex items-center justify-center"
              >
                <div className="w-28 h-28 rounded-full bg-[var(--bg-primary)] flex items-center justify-center">
                  <motion.span
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-5xl"
                  >
                    🧠
                  </motion.span>
                </div>
              </motion.div>
            </motion.div>

            {/* Capability nodes */}
            {phase >= 2 && [
              { icon: '📊', label: 'Data', angle: -60, color: '#4ECDC4' },
              { icon: '🔍', label: 'Analyze', angle: 0, color: '#6495ED' },
              { icon: '💡', label: 'Insight', angle: 60, color: '#FFD700' },
              { icon: '⚡', label: 'Action', angle: 120, color: '#C9A227' },
              { icon: '🎯', label: 'Bias', angle: 180, color: '#ef4444' },
              { icon: '📈', label: 'Growth', angle: 240, color: '#4ECDC4' },
            ].map((node, i) => {
              const radius = 110;
              const x = Math.cos((node.angle * Math.PI) / 180) * radius;
              const y = Math.sin((node.angle * Math.PI) / 180) * radius;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="absolute top-1/2 left-1/2"
                  style={{ marginLeft: x - 20, marginTop: y - 20 }}
                >
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                    className="w-10 h-10 rounded-lg flex flex-col items-center justify-center border"
                    style={{ backgroundColor: `${node.color}20`, borderColor: node.color }}
                  >
                    <span className="text-lg">{node.icon}</span>
                  </motion.div>
                </motion.div>
              );
            })}

            {/* Connection lines */}
            {phase >= 3 && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                  const x2 = 50 + Math.cos((angle * Math.PI) / 180) * 30;
                  const y2 = 50 + Math.sin((angle * Math.PI) / 180) * 30;
                  return (
                    <motion.line
                      key={i}
                      x1="50%"
                      y1="50%"
                      x2={`${x2}%`}
                      y2={`${y2}%`}
                      stroke="var(--accent-cyan)"
                      strokeWidth="1"
                      strokeDasharray="3,3"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.5 }}
                      transition={{ delay: i * 0.1, duration: 0.3 }}
                    />
                  );
                })}
              </svg>
            )}

            {/* Claude badge */}
            {phase >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-2 bg-gradient-to-r from-[var(--accent-cyan)]/20 to-[var(--accent-gold)]/20 border border-[var(--accent-cyan)] rounded-full"
              >
                <span className="text-[var(--text-primary)] text-sm font-semibold">Powered by Claude</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Hidden Workflow Visual - Split layout showing chaotic manual process
function HiddenWorkflow() {
  const [visibleBullets, setVisibleBullets] = useState<number[]>([]);
  const [phase, setPhase] = useState(0);

  const bullets = [
    { icon: '🔍', text: 'Search through dozens of past transactions manually' },
    { icon: '📑', text: 'Open multiple messages side-by-side for reference' },
    { icon: '🗣️', text: 'Ask colleagues: "Have you handled this client before?"' },
    { icon: '📝', text: 'Build personal notes and cheat sheets' },
    { icon: '📋', text: 'Copy-paste and hope the structure fits' },
  ];

  useEffect(() => {
    bullets.forEach((_, i) => {
      setTimeout(() => setVisibleBullets(prev => [...prev, i]), 500 + i * 400);
    });
    setTimeout(() => setPhase(1), 1000);
    setTimeout(() => setPhase(2), 2500);
    setTimeout(() => setPhase(3), 4000);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="w-full max-w-6xl flex gap-12 items-center">
        {/* Left side - Content */}
        <div className="flex-1">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-2">The Hidden Workflow</h2>
            <p className="text-xl text-[var(--text-secondary)]">What operators actually do today</p>
          </motion.div>
          <div className="space-y-4">
            {bullets.map((bullet, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: visibleBullets.includes(i) ? 1 : 0, x: visibleBullets.includes(i) ? 0 : -30 }}
                transition={{ duration: 0.4 }}
                className="flex items-start gap-3 p-3 bg-[var(--bg-secondary)]/50 rounded-lg border-l-4 border-[var(--accent-gold)]/50"
              >
                <span className="text-2xl">{bullet.icon}</span>
                <p className="text-[var(--text-primary)] leading-relaxed">{bullet.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right side - Visual */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-80 h-80">
            {/* Central operator */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: phase >= 1 ? 1 : 0 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-[var(--bg-secondary)] border-4 border-[var(--accent-cyan)]/30 flex items-center justify-center z-10"
            >
              <motion.span animate={{ rotate: phase >= 2 ? [0, -5, 5, -5, 0] : 0 }} transition={{ duration: 0.3, repeat: phase >= 2 ? Infinity : 0, repeatDelay: 1 }} className="text-4xl">😰</motion.span>
            </motion.div>

            {/* Floating documents/tasks */}
            {phase >= 2 && [
              { emoji: '📄', angle: 0 }, { emoji: '📑', angle: 45 }, { emoji: '📊', angle: 90 },
              { emoji: '📧', angle: 135 }, { emoji: '📝', angle: 180 }, { emoji: '💬', angle: 225 },
              { emoji: '🗂️', angle: 270 }, { emoji: '📋', angle: 315 },
            ].map((item, i) => {
              const radius = 100 + (i % 2) * 20;
              const x = Math.cos((item.angle * Math.PI) / 180) * radius;
              const y = Math.sin((item.angle * Math.PI) / 180) * radius;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: 1, scale: 1,
                    x: phase >= 3 ? [x, x + (Math.random() - 0.5) * 20, x] : x,
                    y: phase >= 3 ? [y, y + (Math.random() - 0.5) * 20, y] : y,
                  }}
                  transition={{ opacity: { delay: i * 0.1 }, x: { duration: 2 + Math.random(), repeat: Infinity }, y: { duration: 2 + Math.random(), repeat: Infinity } }}
                  className="absolute top-1/2 left-1/2"
                  style={{ marginLeft: -16, marginTop: -16 }}
                >
                  <div className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)] border border-[var(--accent-gold)]/30 flex items-center justify-center text-lg">{item.emoji}</div>
                </motion.div>
              );
            })}

            {/* Stress indicator */}
            {phase >= 3 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-[var(--accent-gold)]/20 border border-[var(--accent-gold)] rounded-full">
                <span className="text-[var(--accent-gold)] text-sm font-semibold">⏱️ 25+ min per transaction</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Patterns Emerge Visual - Split layout showing pattern connections
function PatternsEmerge() {
  const [visibleBullets, setVisibleBullets] = useState<number[]>([]);
  const [phase, setPhase] = useState(0);

  const bullets = [
    { icon: '👥', text: 'Same buyer + supplier = similar documentary requirements', color: '#4ECDC4' },
    { icon: '🏢', text: 'Same branch = consistent special conditions and clauses', color: '#6495ED' },
    { icon: '📦', text: 'Same commodity type = predictable shipping terms', color: '#FFD700' },
    { icon: '🌍', text: 'Same corridor (country pair) = standard compliance checks', color: '#C9A227' },
  ];

  useEffect(() => {
    bullets.forEach((_, i) => {
      setTimeout(() => setVisibleBullets(prev => [...prev, i]), 500 + i * 400);
    });
    setTimeout(() => setPhase(1), 1000);
    setTimeout(() => setPhase(2), 2500);
    setTimeout(() => setPhase(3), 4000);
  }, []);

  const connections = [
    { from: { x: 20, y: 20 }, to: { x: 80, y: 30 }, color: '#4ECDC4' },
    { from: { x: 20, y: 50 }, to: { x: 80, y: 50 }, color: '#6495ED' },
    { from: { x: 20, y: 80 }, to: { x: 80, y: 70 }, color: '#FFD700' },
  ];

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="w-full max-w-6xl flex gap-12 items-center">
        {/* Left side - Content */}
        <div className="flex-1">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-2">Patterns Emerge</h2>
            <p className="text-xl text-[var(--text-secondary)]">What the data tells us</p>
          </motion.div>
          <div className="space-y-4">
            {bullets.map((bullet, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: visibleBullets.includes(i) ? 1 : 0, x: visibleBullets.includes(i) ? 0 : -30 }}
                transition={{ duration: 0.4 }}
                className="flex items-start gap-3 p-3 bg-[var(--bg-secondary)]/50 rounded-lg border-l-4"
                style={{ borderLeftColor: bullet.color }}
              >
                <span className="text-2xl">{bullet.icon}</span>
                <p className="text-[var(--text-primary)] leading-relaxed">{bullet.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right side - Visual */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-80 h-72">
            {/* Input nodes (left) */}
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-around py-4">
              {[
                { icon: '👤', label: 'Buyer', color: '#4ECDC4' },
                { icon: '🏭', label: 'Supplier', color: '#6495ED' },
                { icon: '📦', label: 'Commodity', color: '#FFD700' },
              ].map((node, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: phase >= 1 ? 1 : 0, x: phase >= 1 ? 0 : -20 }}
                  transition={{ delay: i * 0.2 }}
                  className="w-14 h-14 rounded-xl flex flex-col items-center justify-center border-2"
                  style={{ borderColor: node.color, backgroundColor: `${node.color}20` }}
                >
                  <span className="text-xl">{node.icon}</span>
                  <span className="text-[8px] font-bold" style={{ color: node.color }}>{node.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Output nodes (right) */}
            <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-around py-4">
              {[
                { icon: '📋', label: 'Docs', color: '#4ECDC4' },
                { icon: '📜', label: 'Clauses', color: '#6495ED' },
                { icon: '🚢', label: 'Terms', color: '#FFD700' },
              ].map((node, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: phase >= 2 ? 1 : 0, x: phase >= 2 ? 0 : 20 }}
                  transition={{ delay: i * 0.2 }}
                  className="w-14 h-14 rounded-xl flex flex-col items-center justify-center border-2"
                  style={{ borderColor: node.color, backgroundColor: `${node.color}20` }}
                >
                  <span className="text-xl">{node.icon}</span>
                  <span className="text-[8px] font-bold" style={{ color: node.color }}>{node.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Connection lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {phase >= 3 && connections.map((conn, i) => (
                <motion.path
                  key={i}
                  d={`M ${conn.from.x * 3.2} ${conn.from.y * 2.72} Q 160 ${conn.from.y * 2.72 + (conn.to.y - conn.from.y) * 1.36} ${conn.to.x * 3.2} ${conn.to.y * 2.72}`}
                  stroke={conn.color}
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: i * 0.2 }}
                />
              ))}
            </svg>

            {/* Central "Pattern" badge */}
            {phase >= 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-2 bg-[var(--accent-cyan)]/20 border border-[var(--accent-cyan)] rounded-full"
              >
                <span className="text-[var(--accent-cyan)] text-sm font-semibold">🔗 Pattern Match</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Message Types Visual - Split layout showing SWIFT message types
function MessageTypes() {
  const [visibleBullets, setVisibleBullets] = useState<number[]>([]);
  const [phase, setPhase] = useState(0);
  const [activeType, setActiveType] = useState(0);

  const bullets = [
    { icon: '📤', text: 'ELC (Export Letters of Credit) - MT700/MT701', code: 'MT700' },
    { icon: '📥', text: 'ILC (Import Letters of Credit) - MT700/MT710', code: 'MT710' },
    { icon: '🛡️', text: 'SPLC (Standby Letters of Credit) - MT760', code: 'MT760' },
    { icon: '✅', text: 'Guarantees - MT760/MT767', code: 'MT767' },
    { icon: '💰', text: 'Collections - MT400/MT410', code: 'MT400' },
  ];

  useEffect(() => {
    bullets.forEach((_, i) => {
      setTimeout(() => setVisibleBullets(prev => [...prev, i]), 500 + i * 400);
    });
    setTimeout(() => setPhase(1), 1000);
    setTimeout(() => setPhase(2), 2500);
  }, []);

  useEffect(() => {
    if (phase >= 2) {
      const interval = setInterval(() => setActiveType(prev => (prev + 1) % bullets.length), 2000);
      return () => clearInterval(interval);
    }
  }, [phase]);

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="w-full max-w-6xl flex gap-12 items-center">
        {/* Left side - Content */}
        <div className="flex-1">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-2">Message Types Covered</h2>
            <p className="text-xl text-[var(--text-secondary)]">Templates across all trade finance products</p>
          </motion.div>
          <div className="space-y-4">
            {bullets.map((bullet, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                animate={{
                  opacity: visibleBullets.includes(i) ? 1 : 0,
                  x: visibleBullets.includes(i) ? 0 : -30,
                  scale: activeType === i && phase >= 2 ? 1.02 : 1,
                  borderColor: activeType === i && phase >= 2 ? 'rgba(78, 205, 196, 0.8)' : 'rgba(78, 205, 196, 0.3)',
                }}
                transition={{ duration: 0.4 }}
                className="flex items-start gap-3 p-3 bg-[var(--bg-secondary)]/50 rounded-lg border-l-4 border-[var(--accent-cyan)]/30"
              >
                <span className="text-2xl">{bullet.icon}</span>
                <p className="text-[var(--text-primary)] leading-relaxed">{bullet.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right side - Visual */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-72 h-72">
            {/* Central SWIFT logo area */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: phase >= 1 ? 1 : 0 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <motion.div
                animate={{ boxShadow: phase >= 2 ? ['0 0 20px rgba(78, 205, 196, 0.3)', '0 0 40px rgba(78, 205, 196, 0.5)', '0 0 20px rgba(78, 205, 196, 0.3)'] : 'none' }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-gold)] flex items-center justify-center"
              >
                <div className="w-20 h-20 rounded-xl bg-[var(--bg-primary)] flex flex-col items-center justify-center">
                  <span className="text-sm font-bold text-[var(--accent-cyan)]">SWIFT</span>
                  <motion.span key={activeType} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-lg font-bold text-[var(--accent-gold)]">
                    {bullets[activeType].code}
                  </motion.span>
                </div>
              </motion.div>
            </motion.div>

            {/* Orbiting message type icons */}
            {phase >= 2 && bullets.map((bullet, i) => {
              const angle = (i * 72) - 90;
              const radius = 100;
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;
              const isActive = activeType === i;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: 1,
                    scale: isActive ? 1.2 : 0.9,
                    x, y,
                  }}
                  transition={{ delay: i * 0.1 }}
                  className="absolute top-1/2 left-1/2"
                  style={{ marginLeft: -20, marginTop: -20 }}
                >
                  <motion.div
                    animate={{ borderColor: isActive ? 'var(--accent-cyan)' : 'rgba(78, 205, 196, 0.3)' }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 ${isActive ? 'bg-[var(--accent-cyan)]/20' : 'bg-[var(--bg-secondary)]'}`}
                  >
                    <span className="text-lg">{bullet.icon}</span>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Branch Intelligence Visual - Split layout showing knowledge sharing
function BranchIntelligence() {
  const [visibleBullets, setVisibleBullets] = useState<number[]>([]);
  const [phase, setPhase] = useState(0);
  const [dataFlow, setDataFlow] = useState<string[]>([]);

  const bullets = [
    { icon: '🏢', text: 'Each branch develops templates for their key corridors' },
    { icon: '📍', text: 'Regional compliance requirements built into templates' },
    { icon: '🎓', text: 'New team members inherit years of institutional knowledge' },
    { icon: '🔄', text: 'Staff transitions no longer mean lost expertise' },
  ];

  useEffect(() => {
    bullets.forEach((_, i) => {
      setTimeout(() => setVisibleBullets(prev => [...prev, i]), 500 + i * 400);
    });
    setTimeout(() => setPhase(1), 1000);
    setTimeout(() => setPhase(2), 2500);
    setTimeout(() => setPhase(3), 4000);
  }, []);

  useEffect(() => {
    if (phase >= 3) {
      const interval = setInterval(() => {
        setDataFlow(prev => [...prev, `f-${Date.now()}`].slice(-6));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [phase]);

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="w-full max-w-6xl flex gap-12 items-center">
        {/* Left side - Content */}
        <div className="flex-1">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-2">Branch-Level Intelligence</h2>
            <p className="text-xl text-[var(--text-secondary)]">Knowledge that grows with your team</p>
          </motion.div>
          <div className="space-y-4">
            {bullets.map((bullet, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: visibleBullets.includes(i) ? 1 : 0, x: visibleBullets.includes(i) ? 0 : -30 }}
                transition={{ duration: 0.4 }}
                className="flex items-start gap-3 p-3 bg-[var(--bg-secondary)]/50 rounded-lg border-l-4 border-[var(--accent-cyan)]/50"
              >
                <span className="text-2xl">{bullet.icon}</span>
                <p className="text-[var(--text-primary)] leading-relaxed">{bullet.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right side - Visual */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-80 h-72">
            {/* Central knowledge hub */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: phase >= 1 ? 1 : 0 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <motion.div
                animate={{ boxShadow: phase >= 2 ? ['0 0 20px rgba(78, 205, 196, 0.3)', '0 0 40px rgba(201, 162, 39, 0.3)', '0 0 20px rgba(78, 205, 196, 0.3)'] : 'none' }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-gold)] flex items-center justify-center"
              >
                <div className="w-16 h-16 rounded-full bg-[var(--bg-primary)] flex items-center justify-center">
                  <span className="text-2xl">🧠</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Branch nodes */}
            {phase >= 2 && [
              { icon: '🏢', label: 'NYC', angle: -90, color: '#4ECDC4' },
              { icon: '🏢', label: 'LDN', angle: -30, color: '#6495ED' },
              { icon: '🏢', label: 'HKG', angle: 30, color: '#FFD700' },
              { icon: '🏢', label: 'SGP', angle: 90, color: '#C9A227' },
              { icon: '🏢', label: 'DXB', angle: 150, color: '#4ECDC4' },
              { icon: '🏢', label: 'TKY', angle: 210, color: '#6495ED' },
            ].map((branch, i) => {
              const radius = 100;
              const x = Math.cos((branch.angle * Math.PI) / 180) * radius;
              const y = Math.sin((branch.angle * Math.PI) / 180) * radius;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="absolute top-1/2 left-1/2"
                  style={{ marginLeft: x - 24, marginTop: y - 24 }}
                >
                  <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center border-2" style={{ borderColor: branch.color, backgroundColor: `${branch.color}20` }}>
                    <span className="text-lg">{branch.icon}</span>
                    <span className="text-[8px] font-bold" style={{ color: branch.color }}>{branch.label}</span>
                  </div>
                </motion.div>
              );
            })}

            {/* Data flow particles */}
            {dataFlow.map((id, i) => {
              const angle = (i * 60) - 90;
              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 1, scale: 1, x: Math.cos((angle * Math.PI) / 180) * 100, y: Math.sin((angle * Math.PI) / 180) * 100 }}
                  animate={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-[var(--accent-cyan)]"
                  style={{ marginLeft: -4, marginTop: -4 }}
                />
              );
            })}

            {/* Badge */}
            {phase >= 3 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-[var(--accent-cyan)]/20 border border-[var(--accent-cyan)] rounded-full">
                <span className="text-[var(--accent-cyan)] text-sm font-semibold">🌐 Shared Knowledge Base</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Team Benchmarking - Competitive leaderboard with industry zones
function TeamBenchmarking() {
  const [phase, setPhase] = useState(0);
  const [animatedScores, setAnimatedScores] = useState<Record<string, number>>({});
  const [hoveredTeam, setHoveredTeam] = useState<string | null>(null);

  const teams = [
    { id: 'alpha', name: 'Alpha Squad', score: 4.6, members: 8, trend: '+0.3', avatar: 'A' },
    { id: 'beta', name: 'Beta Force', score: 4.2, members: 6, trend: '+0.5', avatar: 'B' },
    { id: 'gamma', name: 'Gamma Unit', score: 3.9, members: 7, trend: '+0.2', avatar: 'G' },
    { id: 'delta', name: 'Delta Core', score: 3.5, members: 5, trend: '-0.1', avatar: 'D' },
    { id: 'epsilon', name: 'Epsilon Team', score: 3.2, members: 6, trend: '+0.1', avatar: 'E' },
  ];

  const benchmarkZones = [
    { label: 'Elite', min: 4.5, max: 5.0, color: '#4ECDC4', description: 'Top 5% globally' },
    { label: 'High', min: 4.0, max: 4.5, color: '#6495ED', description: 'Top 20%' },
    { label: 'Average', min: 3.5, max: 4.0, color: '#FFD700', description: 'Industry average' },
    { label: 'Below', min: 3.0, max: 3.5, color: '#C9A227', description: 'Needs improvement' },
  ];

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 1500),
      setTimeout(() => setPhase(4), 3000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (phase >= 2) {
      teams.forEach((team, i) => {
        const startTime = Date.now();
        const duration = 1500;
        const animate = () => {
          const elapsed = Date.now() - startTime - i * 200;
          const progress = Math.min(Math.max(elapsed / duration, 0), 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setAnimatedScores(prev => ({ ...prev, [team.id]: team.score * eased }));
          if (progress < 1) requestAnimationFrame(animate);
        };
        setTimeout(animate, i * 200);
      });
    }
  }, [phase]);

  const getZoneForScore = (score: number) => {
    return benchmarkZones.find(z => score >= z.min && score < z.max) || benchmarkZones[benchmarkZones.length - 1];
  };

  const getRank = (teamId: string) => {
    const sorted = [...teams].sort((a, b) => b.score - a.score);
    return sorted.findIndex(t => t.id === teamId) + 1;
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2"
      >
        Team Benchmarking
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-[var(--text-secondary)] mb-8"
      >
        Where does your team stand against the industry?
      </motion.p>

      <div className="w-full max-w-5xl flex gap-8">
        {/* Leaderboard */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 1 ? 1 : 0 }}
            className="space-y-3"
          >
            {teams.map((team, i) => {
              const score = animatedScores[team.id] || 0;
              const zone = getZoneForScore(team.score);
              const rank = getRank(team.id);
              const isTop3 = rank <= 3;

              return (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: phase >= 1 ? 1 : 0, x: phase >= 1 ? 0 : -30 }}
                  transition={{ delay: i * 0.1 }}
                  onMouseEnter={() => setHoveredTeam(team.id)}
                  onMouseLeave={() => setHoveredTeam(null)}
                  className={`relative p-4 rounded-xl border transition-all cursor-pointer ${
                    hoveredTeam === team.id
                      ? 'bg-[var(--bg-secondary)] border-[var(--accent-cyan)]/50 scale-[1.02]'
                      : 'bg-[var(--bg-secondary)]/50 border-[var(--accent-cyan)]/20'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Rank badge */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: phase >= 3 ? 1 : 0 }}
                      transition={{ delay: i * 0.1, type: 'spring' }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                        rank === 1
                          ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black'
                          : rank === 2
                          ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black'
                          : rank === 3
                          ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-white'
                          : 'bg-[var(--bg-primary)] text-[var(--text-muted)]'
                      }`}
                    >
                      {rank}
                    </motion.div>

                    {/* Team avatar */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold"
                      style={{ backgroundColor: `${zone.color}30`, color: zone.color }}
                    >
                      {team.avatar}
                    </div>

                    {/* Team info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[var(--text-primary)]">{team.name}</span>
                        <span className="text-xs text-[var(--text-muted)]">({team.members} members)</span>
                      </div>

                      {/* Score bar */}
                      <div className="mt-2 h-3 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            width: `${(score / 5) * 100}%`,
                            backgroundColor: zone.color,
                          }}
                        />
                      </div>
                    </div>

                    {/* Score display */}
                    <div className="text-right">
                      <motion.span
                        className="text-2xl font-bold"
                        style={{ color: zone.color }}
                      >
                        {score.toFixed(1)}
                      </motion.span>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: phase >= 4 ? 1 : 0 }}
                        className={`text-xs font-medium ${
                          team.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {team.trend} this quarter
                      </motion.div>
                    </div>
                  </div>

                  {/* Hover details */}
                  {hoveredTeam === team.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 pt-3 border-t border-[var(--accent-cyan)]/20 text-sm"
                    >
                      <span className="text-[var(--text-muted)]">Zone: </span>
                      <span style={{ color: zone.color }}>{zone.label}</span>
                      <span className="text-[var(--text-muted)]"> - {zone.description}</span>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Benchmark zones visualization */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: phase >= 2 ? 1 : 0, x: phase >= 2 ? 0 : 30 }}
          className="w-48"
        >
          <p className="text-sm text-[var(--text-muted)] mb-4 text-center">Industry Zones</p>
          <div className="relative h-80 bg-[var(--bg-secondary)]/50 rounded-xl border border-[var(--accent-cyan)]/20 overflow-hidden">
            {/* Zone bands */}
            {benchmarkZones.map((zone, i) => {
              const height = ((zone.max - zone.min) / 2) * 100;
              const bottom = ((zone.min - 3) / 2) * 100;

              return (
                <motion.div
                  key={zone.label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: phase >= 2 ? 1 : 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="absolute left-0 right-0 flex items-center justify-center"
                  style={{
                    height: `${height}%`,
                    bottom: `${bottom}%`,
                    backgroundColor: `${zone.color}20`,
                    borderTop: `2px solid ${zone.color}`,
                  }}
                >
                  <span className="text-xs font-medium px-2 py-1 rounded" style={{ color: zone.color }}>
                    {zone.label}
                  </span>
                </motion.div>
              );
            })}

            {/* Team markers */}
            {phase >= 3 && teams.map((team, i) => {
              const score = animatedScores[team.id] || 0;
              const position = ((score - 3) / 2) * 100;
              const zone = getZoneForScore(team.score);

              return (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, left: -20 }}
                  animate={{
                    opacity: 1,
                    left: 8 + (i % 2) * 20,
                    bottom: `${position}%`,
                  }}
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 100 }}
                  className="absolute w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold -translate-y-1/2 border-2"
                  style={{
                    backgroundColor: `${zone.color}40`,
                    borderColor: zone.color,
                    color: zone.color,
                  }}
                >
                  {team.avatar}
                </motion.div>
              );
            })}

            {/* Scale labels */}
            <div className="absolute right-2 top-0 bottom-0 flex flex-col justify-between py-2 text-xs text-[var(--text-muted)]">
              <span>5.0</span>
              <span>4.5</span>
              <span>4.0</span>
              <span>3.5</span>
              <span>3.0</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Summary insight */}
      {phase >= 4 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-4 bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/30 rounded-xl max-w-2xl"
        >
          <p className="text-center text-[var(--text-primary)]">
            <span className="text-[var(--accent-cyan)] font-bold">Insight:</span>{' '}
            <span className="text-[var(--accent-gold)]">Alpha Squad</span> leads in the Elite zone.{' '}
            <span className="text-[#6495ED]">Beta Force</span> shows strongest growth (+0.5) and is approaching Elite status.
          </p>
        </motion.div>
      )}
    </div>
  );
}

// Legacy Problems Visualization - Each problem gets its own animated scene
function LegacyProblems() {
  // Get capture context for navigation control
  const { forcePhase, onPhaseChange } = React.useContext(CaptureContext);

  const [animPhase, setAnimPhase] = useState(0);

  const problems = [
    {
      icon: '1',
      label: 'Monolithic Architecture',
      desc: 'Tightly coupled codebase',
      detail: 'Single point of failure • Cannot scale independently • 15+ year technical debt',
    },
    {
      icon: '2',
      label: 'Slow Processing',
      desc: 'T+2 settlement delays',
      detail: 'Batch processing only • Manual intervention required • Queue bottlenecks',
    },
    {
      icon: '3',
      label: 'Integration Complexity',
      desc: '47+ point-to-point connections',
      detail: 'No standard APIs • Cascading failures • High change coordination cost',
    },
    {
      icon: '4',
      label: 'Limited Visibility',
      desc: 'Batch-generated reports',
      detail: 'T-1 day data latency • No real-time dashboards • Manual reconciliation',
    },
    {
      icon: '5',
      label: 'Technical Debt',
      desc: 'High maintenance burden',
      detail: 'Low documentation • Key-person risk • 4-6 month change cycles',
    },
  ];

  // Use forcePhase to control active problem (for standalone/export navigation)
  // Fall back to internal state for live site with up/down navigation
  const [internalActiveProblem, setInternalActiveProblem] = useState(0);
  const activeProblem = forcePhase !== undefined ? forcePhase : internalActiveProblem;

  // Keyboard navigation for within-slide selection (only when not using forcePhase)
  useEffect(() => {
    if (forcePhase !== undefined) return; // Skip if controlled externally

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setInternalActiveProblem(prev => (prev + 1) % problems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setInternalActiveProblem(prev => (prev - 1 + problems.length) % problems.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [problems.length, forcePhase]);

  useEffect(() => {
    // Animate through phases for current problem
    setAnimPhase(0);
    const t1 = setTimeout(() => setAnimPhase(1), 200);
    const t2 = setTimeout(() => setAnimPhase(2), 600);
    const t3 = setTimeout(() => setAnimPhase(3), 1200);
    const t4 = setTimeout(() => setAnimPhase(4), 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [activeProblem]);

  // Render visual for each problem - FULL SCREEN DRAMATIC
  const renderProblemVisual = (index: number) => {
    switch (index) {
      case 0: // Monolithic Architecture - Professional metrics view
        return (
          <div className="relative w-full h-full flex items-center justify-center p-8">
            <div className="w-full max-w-5xl flex gap-12">
              {/* Left: Architecture Diagram */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: animPhase >= 1 ? 1 : 0, x: animPhase >= 1 ? 0 : -20 }}
                className="flex-1"
              >
                <h3 className="text-lg font-semibold text-[var(--text-secondary)] mb-4">Current Architecture</h3>
                <div className="bg-[var(--bg-secondary)] rounded-xl border border-gray-700 p-6">
                  {/* Monolith block */}
                  <div className="bg-gray-800 rounded-lg border-2 border-red-500/50 p-4">
                    <div className="text-center mb-4">
                      <p className="text-red-400 font-bold text-lg">Legacy Trade Monolith</p>
                      <p className="text-gray-500 text-sm">Single Deployable Unit</p>
                    </div>

                    {/* Layers stacked */}
                    <div className="space-y-2">
                      {[
                        { name: 'Presentation Layer', modules: 'UI, Reports, Dashboards' },
                        { name: 'Business Logic', modules: 'Trade Processing, Risk, Settlement' },
                        { name: 'Integration Layer', modules: 'SWIFT, Core Banking, External APIs' },
                        { name: 'Data Access', modules: 'ORM, Stored Procedures, Caching' },
                        { name: 'Database', modules: 'Single Oracle Instance' },
                      ].map((layer, i) => (
                        <motion.div
                          key={layer.name}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: animPhase >= 2 ? 1 : 0, y: animPhase >= 2 ? 0 : 10 }}
                          transition={{ delay: i * 0.1 }}
                          className="bg-gray-700/50 rounded p-3 border-l-4 border-gray-600"
                        >
                          <p className="text-sm text-white font-medium">{layer.name}</p>
                          <p className="text-xs text-gray-400">{layer.modules}</p>
                        </motion.div>
                      ))}
                    </div>

                    {/* Coupling indicator */}
                    {animPhase >= 3 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                      >
                        <p className="text-red-400 text-sm text-center">All layers tightly coupled — cannot be deployed independently</p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Right: Impact Metrics */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: animPhase >= 2 ? 1 : 0, x: animPhase >= 2 ? 0 : 20 }}
                className="w-80"
              >
                <h3 className="text-lg font-semibold text-[var(--text-secondary)] mb-4">Business Impact</h3>

                <div className="space-y-4">
                  {[
                    { label: 'Deployment Frequency', value: '1x / month', impact: 'vs. industry 10x/day', bad: true },
                    { label: 'Change Lead Time', value: '6-8 weeks', impact: 'vs. industry <1 week', bad: true },
                    { label: 'Failure Rate', value: '23%', impact: 'of deployments fail', bad: true },
                    { label: 'Recovery Time', value: '4-6 hours', impact: 'mean time to restore', bad: true },
                    { label: 'Code Dependencies', value: '2.4M lines', impact: 'in single codebase', bad: true },
                  ].map((metric, i) => (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: animPhase >= 3 ? 1 : 0, y: animPhase >= 3 ? 0 : 10 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-[var(--bg-secondary)] rounded-lg border border-gray-700 p-4"
                    >
                      <div className="flex justify-between items-start">
                        <p className="text-sm text-gray-400">{metric.label}</p>
                        <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded">Critical</span>
                      </div>
                      <p className="text-2xl font-bold text-white mt-1">{metric.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{metric.impact}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        );

      case 1: // Slow Processing - Professional metrics view
        return (
          <div className="relative w-full h-full flex items-center justify-center p-8">
            <div className="w-full max-w-5xl flex gap-12">
              {/* Left: Processing Flow Diagram */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: animPhase >= 1 ? 1 : 0, x: animPhase >= 1 ? 0 : -20 }}
                className="flex-1"
              >
                <h3 className="text-lg font-semibold text-[var(--text-secondary)] mb-4">Current Processing Flow</h3>
                <div className="bg-[var(--bg-secondary)] rounded-xl border border-gray-700 p-6">
                  {/* Timeline flow */}
                  <div className="space-y-3">
                    {[
                      { step: 'Trade Submission', time: 'T+0', duration: 'Instant', status: 'ok' },
                      { step: 'Queue Wait', time: 'T+0 to T+1', duration: '4-8 hours', status: 'warning' },
                      { step: 'Batch Processing', time: 'T+1 (overnight)', duration: '2-4 hours', status: 'warning' },
                      { step: 'Manual Validation', time: 'T+1 to T+2', duration: '4-6 hours', status: 'critical' },
                      { step: 'Settlement', time: 'T+2', duration: 'Variable', status: 'critical' },
                    ].map((item, i) => (
                      <motion.div
                        key={item.step}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: animPhase >= 2 ? 1 : 0, x: animPhase >= 2 ? 0 : -10 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-4"
                      >
                        {/* Timeline dot and line */}
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full ${
                            item.status === 'ok' ? 'bg-green-500' :
                            item.status === 'warning' ? 'bg-orange-500' : 'bg-red-500'
                          }`} />
                          {i < 4 && <div className="w-0.5 h-8 bg-gray-600" />}
                        </div>

                        {/* Step details */}
                        <div className="flex-1 bg-gray-800/50 rounded-lg p-3 border-l-4 border-gray-600">
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-white font-medium">{item.step}</p>
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              item.status === 'ok' ? 'bg-green-500/20 text-green-400' :
                              item.status === 'warning' ? 'bg-orange-500/20 text-orange-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>{item.time}</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">Duration: {item.duration}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Total time indicator */}
                  {animPhase >= 3 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                    >
                      <div className="flex justify-between items-center">
                        <p className="text-red-400 text-sm">Total Processing Time</p>
                        <p className="text-red-400 font-bold text-lg">T+2 Days</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Right: Performance Metrics */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: animPhase >= 2 ? 1 : 0, x: animPhase >= 2 ? 0 : 20 }}
                className="w-80"
              >
                <h3 className="text-lg font-semibold text-[var(--text-secondary)] mb-4">Performance Impact</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Settlement Cycle', value: 'T+2', impact: 'Industry moving to T+0', bad: true },
                    { label: 'Batch Window', value: '4 hrs/night', impact: 'Limits processing capacity', bad: true },
                    { label: 'Queue Depth', value: '12,000+', impact: 'avg. trades waiting', bad: true },
                    { label: 'Manual Touch', value: '34%', impact: 'of trades require intervention', bad: true },
                    { label: 'STP Rate', value: '66%', impact: 'vs. target 95%', bad: true },
                  ].map((metric, i) => (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: animPhase >= 3 ? 1 : 0, y: animPhase >= 3 ? 0 : 10 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-[var(--bg-secondary)] rounded-lg border border-gray-700 p-4"
                    >
                      <div className="flex justify-between items-start">
                        <p className="text-sm text-gray-400">{metric.label}</p>
                        <span className="text-xs px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded">Slow</span>
                      </div>
                      <p className="text-2xl font-bold text-white mt-1">{metric.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{metric.impact}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        );

      case 2: // Integration Chaos - Professional metrics view
        return (
          <div className="relative w-full h-full flex items-center justify-center p-8">
            <div className="w-full max-w-5xl flex gap-12">
              {/* Left: Integration Architecture */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: animPhase >= 1 ? 1 : 0, x: animPhase >= 1 ? 0 : -20 }}
                className="flex-1"
              >
                <h3 className="text-lg font-semibold text-[var(--text-secondary)] mb-4">Current Integration Landscape</h3>
                <div className="bg-[var(--bg-secondary)] rounded-xl border border-gray-700 p-6">
                  {/* Systems grid */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { name: 'Platform A Core', connections: 12 },
                      { name: 'TENET', connections: 9 },
                      { name: 'Settlement', connections: 11 },
                      { name: 'Risk Engine', connections: 8 },
                      { name: 'Reporting', connections: 7 },
                      { name: 'Compliance', connections: 6 },
                    ].map((system, i) => (
                      <motion.div
                        key={system.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: animPhase >= 2 ? 1 : 0, scale: animPhase >= 2 ? 1 : 0.9 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-gray-800/50 rounded-lg p-3 border border-gray-600"
                      >
                        <p className="text-xs text-white font-medium">{system.name}</p>
                        <p className="text-xs text-red-400">{system.connections} P2P links</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Connection issues */}
                  {animPhase >= 2 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-t border-gray-700 pt-4 space-y-2"
                    >
                      <p className="text-sm text-gray-400 mb-2">Integration Issues</p>
                      {[
                        { issue: 'Point-to-point connections', count: '47+', severity: 'critical' },
                        { issue: 'Custom data formats', count: '23', severity: 'high' },
                        { issue: 'Undocumented interfaces', count: '31', severity: 'high' },
                      ].map((item, i) => (
                        <motion.div
                          key={item.issue}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: animPhase >= 3 ? 1 : 0, x: animPhase >= 3 ? 0 : -10 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex justify-between items-center p-2 bg-gray-800/30 rounded"
                        >
                          <span className="text-xs text-gray-400">{item.issue}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            item.severity === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'
                          }`}>{item.count}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {/* Bottom warning */}
                  {animPhase >= 3 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                    >
                      <p className="text-red-400 text-sm text-center">No API gateway or standard integration layer</p>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Right: Integration Metrics */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: animPhase >= 2 ? 1 : 0, x: animPhase >= 2 ? 0 : 20 }}
                className="w-80"
              >
                <h3 className="text-lg font-semibold text-[var(--text-secondary)] mb-4">Integration Debt</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Integration Points', value: '47+', impact: 'point-to-point connections', bad: true },
                    { label: 'API Documentation', value: '12%', impact: 'interfaces documented', bad: true },
                    { label: 'Breaking Changes/Yr', value: '156', impact: 'avg. cascading failures', bad: true },
                    { label: 'Change Coordination', value: '3-4 weeks', impact: 'for multi-system updates', bad: true },
                    { label: 'Testing Coverage', value: '28%', impact: 'of integration paths', bad: true },
                  ].map((metric, i) => (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: animPhase >= 3 ? 1 : 0, y: animPhase >= 3 ? 0 : 10 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-[var(--bg-secondary)] rounded-lg border border-gray-700 p-4"
                    >
                      <div className="flex justify-between items-start">
                        <p className="text-sm text-gray-400">{metric.label}</p>
                        <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded">High Risk</span>
                      </div>
                      <p className="text-2xl font-bold text-white mt-1">{metric.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{metric.impact}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        );

      case 3: // Limited Visibility - Focus on reporting delay, duplicate data, reconciliation
        return (
          <div className="relative w-full h-full flex items-center justify-center p-8">
            <div className="w-full max-w-5xl flex gap-12">
              {/* Left: Core Visibility Issues */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: animPhase >= 1 ? 1 : 0, x: animPhase >= 1 ? 0 : -20 }}
                className="flex-1"
              >
                <h3 className="text-lg font-semibold text-[var(--text-secondary)] mb-4">Data Visibility Challenges</h3>
                <div className="bg-[var(--bg-secondary)] rounded-xl border border-gray-700 p-6 space-y-5">

                  {/* Issue 1: Reporting Delay */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: animPhase >= 2 ? 1 : 0, y: animPhase >= 2 ? 0 : 10 }}
                    className="p-4 bg-gray-800/50 rounded-lg border-l-4 border-red-500"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-white font-semibold">Reporting Delay</p>
                      <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded">T-1 Day</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">All reports generated from previous day&apos;s batch</p>
                    <div className="flex gap-4 text-xs">
                      <span className="text-gray-500">Trade Reports: <span className="text-orange-400">24hr delay</span></span>
                      <span className="text-gray-500">Position Data: <span className="text-orange-400">Stale</span></span>
                    </div>
                  </motion.div>

                  {/* Issue 2: Duplicate Datasets */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: animPhase >= 2 ? 1 : 0, y: animPhase >= 2 ? 0 : 10 }}
                    transition={{ delay: 0.1 }}
                    className="p-4 bg-gray-800/50 rounded-lg border-l-4 border-orange-500"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-white font-semibold">Duplicate Datasets</p>
                      <span className="text-xs px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded">Data Silos</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">Same data maintained in multiple systems</p>
                    <div className="flex gap-3">
                      <div className="flex-1 p-2 bg-gray-700/50 rounded text-center">
                        <p className="text-xs text-gray-400">Platform A</p>
                        <p className="text-sm text-white">Trade Data</p>
                      </div>
                      <div className="flex items-center text-orange-400 text-lg">≠</div>
                      <div className="flex-1 p-2 bg-gray-700/50 rounded text-center">
                        <p className="text-xs text-gray-400">Platform B</p>
                        <p className="text-sm text-white">Trade Data</p>
                      </div>
                    </div>
                    <p className="text-xs text-red-400 mt-2 text-center">Data inconsistencies between systems</p>
                  </motion.div>

                  {/* Issue 3: Offline Reconciliation */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: animPhase >= 3 ? 1 : 0, y: animPhase >= 3 ? 0 : 10 }}
                    transition={{ delay: 0.2 }}
                    className="p-4 bg-gray-800/50 rounded-lg border-l-4 border-yellow-500"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-white font-semibold">Offline Data Reconciliation</p>
                      <span className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded">Manual</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">Heavy manual effort to reconcile data across systems</p>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-gray-700/30 rounded">
                        <p className="text-lg font-bold text-yellow-400">4+</p>
                        <p className="text-xs text-gray-500">hrs/day</p>
                      </div>
                      <div className="p-2 bg-gray-700/30 rounded">
                        <p className="text-lg font-bold text-yellow-400">Excel</p>
                        <p className="text-xs text-gray-500">based</p>
                      </div>
                      <div className="p-2 bg-gray-700/30 rounded">
                        <p className="text-lg font-bold text-yellow-400">3+</p>
                        <p className="text-xs text-gray-500">FTEs</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Right: Impact Metrics */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: animPhase >= 2 ? 1 : 0, x: animPhase >= 2 ? 0 : 20 }}
                className="w-80"
              >
                <h3 className="text-lg font-semibold text-[var(--text-secondary)] mb-4">Business Impact</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Report Freshness', value: 'T-1 Day', impact: 'decisions on stale data', severity: 'Critical' },
                    { label: 'Data Discrepancies', value: '~15%', impact: 'Platform A vs Platform B mismatch', severity: 'High' },
                    { label: 'Reconciliation Time', value: '4+ hrs/day', impact: 'manual cross-checking', severity: 'High' },
                    { label: 'Error Discovery', value: 'T+2 Days', impact: 'issues found late', severity: 'Critical' },
                  ].map((metric, i) => (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: animPhase >= 3 ? 1 : 0, y: animPhase >= 3 ? 0 : 10 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-[var(--bg-secondary)] rounded-lg border border-gray-700 p-4"
                    >
                      <div className="flex justify-between items-start">
                        <p className="text-sm text-gray-400">{metric.label}</p>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          metric.severity === 'Critical' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'
                        }`}>{metric.severity}</span>
                      </div>
                      <p className="text-2xl font-bold text-white mt-1">{metric.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{metric.impact}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        );

      case 4: // Maintenance Nightmare - Professional metrics view
        return (
          <div className="relative w-full h-full flex items-center justify-center p-8">
            <div className="w-full max-w-5xl flex gap-12">
              {/* Left: Technical Debt Overview */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: animPhase >= 1 ? 1 : 0, x: animPhase >= 1 ? 0 : -20 }}
                className="flex-1"
              >
                <h3 className="text-lg font-semibold text-[var(--text-secondary)] mb-4">Technical Debt Assessment</h3>
                <div className="bg-[var(--bg-secondary)] rounded-xl border border-gray-700 p-6">
                  {/* Codebase stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {[
                      { label: 'Codebase Age', value: '15+ years', status: 'critical' },
                      { label: 'Lines of Code', value: '2.4M', status: 'high' },
                      { label: 'Active Modules', value: '47', status: 'high' },
                      { label: 'Tech Stack', value: 'Legacy Java/COBOL', status: 'critical' },
                    ].map((stat, i) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: animPhase >= 2 ? 1 : 0, scale: animPhase >= 2 ? 1 : 0.9 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-gray-800/50 rounded-lg p-3 border border-gray-600"
                      >
                        <p className="text-xs text-gray-400">{stat.label}</p>
                        <p className="text-lg font-bold text-white">{stat.value}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Risk factors */}
                  <div className="border-t border-gray-700 pt-4">
                    <p className="text-sm text-gray-400 mb-3">Key Risk Factors</p>
                    {[
                      { factor: 'Documentation Coverage', value: '8%', status: 'critical' },
                      { factor: 'Test Coverage', value: '12%', status: 'critical' },
                      { factor: 'Knowledge Concentration', value: '3 people', status: 'critical' },
                      { factor: 'Outdated Dependencies', value: '89%', status: 'high' },
                    ].map((item, i) => (
                      <motion.div
                        key={item.factor}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: animPhase >= 2 ? 1 : 0, x: animPhase >= 2 ? 0 : -10 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex justify-between items-center p-2 bg-gray-800/30 rounded mb-2"
                      >
                        <span className="text-xs text-gray-400">{item.factor}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          item.status === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'
                        }`}>{item.value}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Warning */}
                  {animPhase >= 3 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                    >
                      <p className="text-red-400 text-sm text-center">High attrition risk — institutional knowledge concentrated in few individuals</p>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Right: Maintenance Metrics */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: animPhase >= 2 ? 1 : 0, x: animPhase >= 2 ? 0 : 20 }}
                className="w-80"
              >
                <h3 className="text-lg font-semibold text-[var(--text-secondary)] mb-4">Maintenance Cost</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Change Lead Time', value: '4-6 months', impact: 'for significant changes', bad: true },
                    { label: 'Bug Fix Time', value: '3-4 weeks', impact: 'average resolution', bad: true },
                    { label: 'Regression Rate', value: '34%', impact: 'of changes cause issues', bad: true },
                    { label: 'Support Escalations', value: '45/month', impact: 'requiring dev attention', bad: true },
                    { label: 'Annual Maintenance', value: '$4.2M', impact: 'just to keep running', bad: true },
                  ].map((metric, i) => (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: animPhase >= 3 ? 1 : 0, y: animPhase >= 3 ? 0 : 10 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-[var(--bg-secondary)] rounded-lg border border-gray-700 p-4"
                    >
                      <div className="flex justify-between items-start">
                        <p className="text-sm text-gray-400">{metric.label}</p>
                        <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded">High</span>
                      </div>
                      <p className="text-2xl font-bold text-white mt-1">{metric.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{metric.impact}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4"
      >
        <h2 className="text-5xl font-bold text-[var(--text-primary)] mb-2">The Legacy Challenge</h2>
        <p className="text-xl text-[var(--text-secondary)]">Current Trade Systems</p>
      </motion.div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Problem selector - Left side */}
        <div className="w-64 flex flex-col gap-2">
          {problems.map((problem, i) => {
            const isActive = activeProblem === i;
            return (
              <motion.button
                key={i}
                onClick={() => { onPhaseChange ? onPhaseChange(i) : setInternalActiveProblem(i); }}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`text-left p-3 rounded-xl border-2 transition-all ${
                  isActive
                    ? 'bg-red-500/20 border-red-500'
                    : 'bg-[var(--bg-secondary)]/50 border-transparent hover:border-red-500/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                    isActive ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-400'
                  }`}>
                    {problem.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm ${isActive ? 'text-red-400' : 'text-[var(--text-primary)]'}`}>
                      {problem.label}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] truncate">{problem.desc}</p>
                  </div>
                </div>
              </motion.button>
            );
          })}

          {/* Summary stat */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-auto p-3 bg-red-500/10 border border-red-500/30 rounded-xl"
          >
            <p className="text-xs text-[var(--text-muted)] mb-1">Assessment</p>
            <p className="text-red-400 font-bold text-sm">Requires Modernization</p>
          </motion.div>
        </div>

        {/* Visualization area - Right side - FULL HEIGHT */}
        <div className="flex-1 bg-[var(--bg-secondary)]/30 rounded-2xl border border-red-500/20 overflow-hidden relative">
          {/* Problem title inside viz */}
          <div className="absolute top-4 left-4 z-10">
            <motion.div
              key={activeProblem}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-xl font-bold text-red-400">{problems[activeProblem].label}</p>
              <p className="text-sm text-[var(--text-muted)]">{problems[activeProblem].detail}</p>
            </motion.div>
          </div>

          {/* Navigation dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {problems.map((_, i) => (
              <button
                key={i}
                onClick={() => { onPhaseChange ? onPhaseChange(i) : setInternalActiveProblem(i); }}
                className={`w-3 h-3 rounded-full transition-all ${
                  activeProblem === i ? 'bg-red-500 w-8' : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>

          {/* Visualization content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProblem}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              {renderProblemVisual(activeProblem)}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Technical Challenges Visualization - Infrastructure & deployment limitations
function TechnicalChallenges() {
  // Get capture context for navigation control
  const { forcePhase, onPhaseChange } = React.useContext(CaptureContext);

  const [animPhase, setAnimPhase] = useState(0);

  const challenges = [
    {
      icon: '1',
      title: 'Data Silos',
      subtitle: 'Fragmented data across systems',
      impact: 'No single source of truth',
      detail: 'Platform A, Platform B, and other systems maintain separate datasets',
    },
    {
      icon: '2',
      title: 'Integration Constraints',
      subtitle: 'Point-to-point connections',
      impact: '47+ direct integrations',
      detail: 'No standardized API layer or event-driven architecture',
    },
    {
      icon: '3',
      title: 'Limited Data Sharing',
      subtitle: 'Assets locked in systems',
      impact: 'Manual data extraction',
      detail: 'Cannot expose data to partners or new channels easily',
    },
    {
      icon: '4',
      title: 'Batch-Only Processing',
      subtitle: 'No real-time data flow',
      impact: 'T-1 day data latency',
      detail: 'All data synchronization happens overnight',
    },
    {
      icon: '5',
      title: 'Schema Rigidity',
      subtitle: 'Hard-coded data models',
      impact: '6+ months for changes',
      detail: 'Adding new fields requires full release cycle',
    },
  ];

  // Use forcePhase to control active challenge (for standalone/export navigation)
  const [internalActiveChallenge, setInternalActiveChallenge] = useState(0);
  const activeChallenge = forcePhase !== undefined ? forcePhase : internalActiveChallenge;

  // Keyboard navigation for within-slide selection (only when not using forcePhase)
  useEffect(() => {
    if (forcePhase !== undefined) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setInternalActiveChallenge(prev => (prev + 1) % challenges.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setInternalActiveChallenge(prev => (prev - 1 + challenges.length) % challenges.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [challenges.length, forcePhase]);

  useEffect(() => {
    setAnimPhase(0);
    const t1 = setTimeout(() => setAnimPhase(1), 200);
    const t2 = setTimeout(() => setAnimPhase(2), 600);
    const t3 = setTimeout(() => setAnimPhase(3), 1000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [activeChallenge]);

  // Render professional metrics-driven visualization for each challenge
  const renderChallengeVisual = (index: number) => {
    const challengeData = [
      {
        leftTitle: 'Data Distribution',
        leftContent: [
          { label: 'Platform A System', value: 'Trade execution data', status: 'warning' },
          { label: 'Platform B System', value: 'Accounts payable data', status: 'warning' },
          { label: 'Reporting DB', value: 'Aggregated snapshots', status: 'warning' },
          { label: 'External Feeds', value: 'Market/reference data', status: 'warning' },
        ],
        rightTitle: 'Data Silo Impact',
        rightMetrics: [
          { label: 'Data Sources', value: '4+ systems', impact: 'no unified view', severity: 'Critical' },
          { label: 'Sync Frequency', value: 'Daily batch', impact: 'T-1 latency', severity: 'High' },
          { label: 'Reconciliation', value: '4+ hrs/day', impact: 'manual effort', severity: 'High' },
          { label: 'Data Conflicts', value: '~15%', impact: 'mismatch rate', severity: 'Critical' },
        ],
      },
      {
        leftTitle: 'Current Integration Map',
        leftContent: [
          { label: 'Core Banking', value: 'Point-to-point', status: 'critical' },
          { label: 'SWIFT Network', value: 'Direct connection', status: 'warning' },
          { label: 'Partner Systems', value: 'Custom adapters', status: 'critical' },
          { label: 'Reporting Tools', value: 'File exports', status: 'critical' },
        ],
        rightTitle: 'Integration Burden',
        rightMetrics: [
          { label: 'Total Connections', value: '47+', impact: 'point-to-point links', severity: 'Critical' },
          { label: 'New Integration', value: '3-6 months', impact: 'per partner', severity: 'Slow' },
          { label: 'Maintenance Cost', value: 'High', impact: 'per connection', severity: 'High' },
          { label: 'Failure Cascade', value: 'Likely', impact: 'tight coupling', severity: 'Critical' },
        ],
      },
      {
        leftTitle: 'Data Access Barriers',
        leftContent: [
          { label: 'Partner Access', value: 'Not available', status: 'critical' },
          { label: 'API Exposure', value: 'None', status: 'critical' },
          { label: 'Self-Service', value: 'Not possible', status: 'critical' },
          { label: 'Data Products', value: 'Manual only', status: 'warning' },
        ],
        rightTitle: 'Sharing Limitations',
        rightMetrics: [
          { label: 'External APIs', value: '0', impact: 'no data products', severity: 'Blocked' },
          { label: 'Partner Onboarding', value: 'Months', impact: 'custom integration', severity: 'Slow' },
          { label: 'Asset Reuse', value: 'None', impact: 'locked in systems', severity: 'Critical' },
          { label: 'Revenue Impact', value: 'Lost', impact: 'missed opportunities', severity: 'Critical' },
        ],
      },
      {
        leftTitle: 'Data Flow Architecture',
        leftContent: [
          { label: 'Inbound Trades', value: 'Batch queue', status: 'warning' },
          { label: 'Processing', value: 'Overnight jobs', status: 'critical' },
          { label: 'Reporting', value: 'T-1 snapshots', status: 'critical' },
          { label: 'Notifications', value: 'Polling only', status: 'warning' },
        ],
        rightTitle: 'Latency Impact',
        rightMetrics: [
          { label: 'Trade Visibility', value: 'T-1 Day', impact: 'batch processed', severity: 'Critical' },
          { label: 'Position Updates', value: 'Daily', impact: 'no real-time', severity: 'High' },
          { label: 'Alert Delay', value: '12-24 hrs', impact: 'late notification', severity: 'Critical' },
          { label: 'Decision Speed', value: 'Impaired', impact: 'stale data', severity: 'High' },
        ],
      },
      {
        leftTitle: 'Schema Management',
        leftContent: [
          { label: 'Data Model', value: 'Fixed tables', status: 'critical' },
          { label: 'Field Changes', value: 'Full release', status: 'critical' },
          { label: 'New Entities', value: 'Major project', status: 'critical' },
          { label: 'Versioning', value: 'None', status: 'warning' },
        ],
        rightTitle: 'Change Constraints',
        rightMetrics: [
          { label: 'Schema Change', value: '6+ months', impact: 'full release cycle', severity: 'Slow' },
          { label: 'New Field', value: '3+ months', impact: 'database migration', severity: 'Slow' },
          { label: 'Backward Compat', value: 'Breaking', impact: 'no versioning', severity: 'Critical' },
          { label: 'Partner Impact', value: 'High', impact: 'coordinated changes', severity: 'High' },
        ],
      },
    ];

    const data = challengeData[index];
    if (!data) return null;

    return (
      <div className="relative w-full h-full flex items-center justify-center p-8">
        <div className="w-full max-w-5xl flex gap-12">
          {/* Left: Current State */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: animPhase >= 1 ? 1 : 0, x: animPhase >= 1 ? 0 : -20 }}
            className="flex-1"
          >
            <h3 className="text-lg font-semibold text-[var(--text-secondary)] mb-4">{data.leftTitle}</h3>
            <div className="bg-[var(--bg-secondary)] rounded-xl border border-gray-700 p-6">
              <div className="space-y-3">
                {data.leftContent.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: animPhase >= 2 ? 1 : 0, x: animPhase >= 2 ? 0 : -10 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border-l-4 border-gray-600"
                  >
                    <span className="text-sm text-white">{item.label}</span>
                    <span className={`text-sm px-2 py-0.5 rounded ${
                      item.status === 'ok' ? 'bg-green-500/20 text-green-400' :
                      item.status === 'warning' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>{item.value}</span>
                  </motion.div>
                ))}
              </div>

              {animPhase >= 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg"
                >
                  <p className="text-orange-400 text-sm text-center">{challenges[index].detail}</p>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Right: Impact Metrics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: animPhase >= 2 ? 1 : 0, x: animPhase >= 2 ? 0 : 20 }}
            className="w-80"
          >
            <h3 className="text-lg font-semibold text-[var(--text-secondary)] mb-4">{data.rightTitle}</h3>
            <div className="space-y-4">
              {data.rightMetrics.map((metric, i) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: animPhase >= 3 ? 1 : 0, y: animPhase >= 3 ? 0 : 10 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-[var(--bg-secondary)] rounded-lg border border-gray-700 p-4"
                >
                  <div className="flex justify-between items-start">
                    <p className="text-sm text-gray-400">{metric.label}</p>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      metric.severity === 'Critical' || metric.severity === 'Blocked' ? 'bg-red-500/20 text-red-400' :
                      metric.severity === 'High' || metric.severity === 'Slow' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>{metric.severity}</span>
                  </div>
                  <p className="text-2xl font-bold text-white mt-1">{metric.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{metric.impact}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4"
      >
        <h2 className="text-5xl font-bold text-[var(--text-primary)] mb-2">Data & Integration Challenges</h2>
        <p className="text-xl text-[var(--text-secondary)]">Current barriers to data sharing and integration</p>
      </motion.div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Challenge selector - Left side */}
        <div className="w-64 flex flex-col gap-2">
          {challenges.map((challenge, i) => {
            const isActive = activeChallenge === i;
            return (
              <motion.button
                key={i}
                onClick={() => { onPhaseChange ? onPhaseChange(i) : setInternalActiveChallenge(i); }}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`text-left p-3 rounded-xl border-2 transition-all ${
                  isActive
                    ? 'bg-orange-500/20 border-orange-500'
                    : 'bg-[var(--bg-secondary)]/50 border-transparent hover:border-orange-500/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                    isActive ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-400'
                  }`}>
                    {challenge.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm ${isActive ? 'text-orange-400' : 'text-[var(--text-primary)]'}`}>
                      {challenge.title}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] truncate">{challenge.subtitle}</p>
                  </div>
                </div>
              </motion.button>
            );
          })}

          {/* Summary stat */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-auto p-3 bg-orange-500/10 border border-orange-500/30 rounded-xl"
          >
            <p className="text-xs text-[var(--text-muted)] mb-1">Assessment</p>
            <p className="text-orange-400 font-bold text-sm">Modernization Required</p>
          </motion.div>
        </div>

        {/* Visualization area - Right side */}
        <div className="flex-1 bg-[var(--bg-secondary)]/30 rounded-2xl border border-orange-500/20 overflow-hidden relative">
          {/* Problem title inside viz */}
          <div className="absolute top-4 left-4 z-10">
            <motion.div
              key={activeChallenge}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-xl font-bold text-orange-400">{challenges[activeChallenge].title}</p>
              <p className="text-sm text-[var(--text-muted)]">{challenges[activeChallenge].impact}</p>
            </motion.div>
          </div>

          {/* Navigation dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {challenges.map((_, i) => (
              <button
                key={i}
                onClick={() => { onPhaseChange ? onPhaseChange(i) : setInternalActiveChallenge(i); }}
                className={`w-3 h-3 rounded-full transition-all ${
                  activeChallenge === i ? 'bg-orange-500 w-8' : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>

          {/* Visualization content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeChallenge}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              {renderChallengeVisual(activeChallenge)}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Product Opportunities Visualization - How technical changes enable business value
function ProductOpportunities() {
  // Get capture context for navigation control
  const { forcePhase, onPhaseChange } = React.useContext(CaptureContext);

  const [phase, setPhase] = useState(0);

  const opportunities = [
    {
      icon: '1',
      title: 'Asset Availability',
      subtitle: 'Cross-platform data access',
      enabler: 'Unified data layer enables multi-channel distribution',
      detail: 'Trade assets and data products available across all platforms',
    },
    {
      icon: '2',
      title: 'Network Expansion',
      subtitle: 'Break down silos',
      enabler: 'Connected ecosystem of buyers, suppliers, banks, and assets',
      detail: 'From isolated relationships to unified network effect',
    },
    {
      icon: '3',
      title: 'Unified Onboarding',
      subtitle: 'Single integration experience',
      enabler: 'Standardized APIs and self-service portals',
      detail: 'Partners connect once, access all services',
    },
    {
      icon: '4',
      title: 'Future Integration',
      subtitle: 'Ready for tomorrow',
      enabler: 'Event-driven architecture supports any protocol',
      detail: 'Seamless adoption of new standards and technologies',
    },
  ];

  // Use forcePhase to control active opportunity (for standalone/export navigation)
  const [internalActiveOpportunity, setInternalActiveOpportunity] = useState(0);
  const activeOpportunity = forcePhase !== undefined ? forcePhase : internalActiveOpportunity;

  // Keyboard navigation for within-slide selection (only when not using forcePhase)
  useEffect(() => {
    if (forcePhase !== undefined) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setInternalActiveOpportunity(prev => (prev + 1) % opportunities.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setInternalActiveOpportunity(prev => (prev - 1 + opportunities.length) % opportunities.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [opportunities.length, forcePhase]);

  useEffect(() => {
    setPhase(0);
    const t1 = setTimeout(() => setPhase(1), 200);
    const t2 = setTimeout(() => setPhase(2), 600);
    const t3 = setTimeout(() => setPhase(3), 1000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [activeOpportunity]);

  // Transformation journey visualization - distinct from TechnicalChallenges
  const renderOpportunityVisual = (index: number) => {
    const transformationData = [
      {
        kpi: 'Asset Reach',
        current: { value: 'Siloed', detail: 'Assets locked in systems' },
        target: { value: 'Universal', detail: 'Available across all channels' },
        improvements: [
          { metric: 'Platform Access', from: '1 system', to: 'All platforms', percent: 100 },
          { metric: 'Data Products', from: '0', to: '10+ services', percent: 100 },
          { metric: 'Partner Access', from: 'None', to: 'Self-service', percent: 100 },
        ],
        businessValue: { label: 'Asset Utilization', value: '3x', note: 'increase in data value' },
      },
      {
        kpi: 'Network',
        isCustom: true, // Special flag for custom network visualization
        current: { value: 'Siloed', detail: 'Isolated relationships' },
        target: { value: 'Connected', detail: 'Unified ecosystem' },
        improvements: [],
        businessValue: { label: 'Network Effect', value: 'Exponential', note: 'value growth' },
      },
      {
        kpi: 'Onboarding Time',
        current: { value: '3-6 Mo', detail: 'Custom integration per partner' },
        target: { value: '<1 Week', detail: 'Self-service portal' },
        improvements: [
          { metric: 'Integration Effort', from: 'Months', to: 'Days', percent: 95 },
          { metric: 'Documentation', from: 'Custom', to: 'Standardized', percent: 100 },
          { metric: 'Testing', from: 'Manual', to: 'Sandbox', percent: 100 },
        ],
        businessValue: { label: 'Partner Acquisition', value: '5x', note: 'faster time to revenue' },
      },
      {
        kpi: 'Integration Ready',
        current: { value: 'Legacy', detail: 'Point-to-point only' },
        target: { value: 'Modern', detail: 'Any protocol, any format' },
        improvements: [
          { metric: 'API Standards', from: 'Proprietary', to: 'Open APIs', percent: 100 },
          { metric: 'Event Streaming', from: 'None', to: 'Real-time', percent: 100 },
          { metric: 'New Standards', from: '12+ months', to: 'Weeks', percent: 95 },
        ],
        businessValue: { label: 'Future-Proof', value: 'Yes', note: 'ready for ISO 20022, DLT, etc.' },
      },
      {
        kpi: 'Operations Model',
        current: { value: 'Linear', detail: 'Volume = Headcount' },
        target: { value: 'Scalable', detail: 'Automated processing' },
        improvements: [
          { metric: 'Staff per 1K trades', from: '5 FTEs', to: '0.5 FTE', percent: 90 },
          { metric: 'Manual Processing', from: '60%', to: '<5%', percent: 92 },
          { metric: 'Volume Capacity', from: 'Capped', to: 'Unlimited', percent: 100 },
        ],
        businessValue: { label: 'Cost per Trade', value: '-80%', note: 'at 10x current volume' },
      },
    ];

    const data = transformationData[index];
    if (!data) return null;

    // Special visualization for Network Expansion (index 1) - Radar with info panels
    if (index === 1) {
      // Network entities positioned in concentric rings
      const directRelationships = [
        { id: 'b1', x: 35, y: 25, type: 'buyer', label: 'B' },
        { id: 'b2', x: 65, y: 23, type: 'buyer', label: 'B' },
        { id: 's1', x: 22, y: 50, type: 'supplier', label: 'S' },
        { id: 's2', x: 78, y: 50, type: 'supplier', label: 'S' },
        { id: 'k1', x: 38, y: 75, type: 'bank', label: 'K' },
        { id: 'k2', x: 62, y: 77, type: 'bank', label: 'K' },
      ];

      const secondDegree = [
        { id: 'h1', x: 18, y: 15, type: 'hidden-buyer' },
        { id: 'h2', x: 50, y: 8, type: 'hidden-buyer' },
        { id: 'h3', x: 82, y: 13, type: 'hidden-buyer' },
        { id: 'h4', x: 8, y: 38, type: 'hidden-supplier' },
        { id: 'h5', x: 92, y: 35, type: 'hidden-supplier' },
        { id: 'h6', x: 8, y: 62, type: 'hidden-bank' },
        { id: 'h7', x: 92, y: 65, type: 'hidden-bank' },
        { id: 'h8', x: 22, y: 88, type: 'hidden-supplier' },
        { id: 'h9', x: 78, y: 90, type: 'hidden-buyer' },
      ];

      const opportunities = [
        { id: 't1', x: 5, y: 20 }, { id: 't2', x: 35, y: 2 },
        { id: 't3', x: 65, y: 2 }, { id: 't4', x: 95, y: 22 },
        { id: 't5', x: 2, y: 50 }, { id: 't6', x: 98, y: 50 },
        { id: 't7', x: 5, y: 82 }, { id: 't8', x: 50, y: 98 }, { id: 't9', x: 95, y: 80 },
      ];

      const getNodeColor = (type: string) => {
        switch (type) {
          case 'buyer': return '#00D4FF';
          case 'supplier': return '#10B981';
          case 'bank': return '#8B5CF6';
          case 'hidden-buyer': return 'rgba(0, 212, 255, 0.5)';
          case 'hidden-supplier': return 'rgba(16, 185, 129, 0.5)';
          case 'hidden-bank': return 'rgba(139, 92, 246, 0.5)';
          default: return '#666';
        }
      };

      return (
        <div className="relative w-full h-full flex items-center justify-center p-6 pt-16">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-16 left-0 right-0 text-center z-10"
          >
            <h2 className="text-2xl font-bold text-white mb-1">Breaking Through the Visibility Ceiling</h2>
            <p className="text-sm text-gray-400">From isolated relationships to full ecosystem intelligence</p>
          </motion.div>

          {/* Main 3-column layout */}
          <div className="w-full max-w-7xl flex gap-4 mt-8">
            {/* LEFT PANEL - What's Hidden Today */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: phase >= 1 ? 1 : 0, x: phase >= 1 ? 0 : -30 }}
              className="w-64 flex-shrink-0"
            >
              <div className="bg-gray-800/40 rounded-xl border border-gray-700/50 p-4 h-full">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <p className="text-sm font-semibold text-gray-300">Hidden Today</p>
                </div>

                <div className="space-y-3">
                  {[
                    { label: 'Their bank relationships', desc: 'Which banks finance your counterparties?' },
                    { label: 'Supplier\'s other buyers', desc: 'Who else are they selling to?' },
                    { label: 'Cross-sell opportunities', desc: 'What other products do they need?' },
                    { label: 'Financing gaps', desc: 'Where is capital underserved?' },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: phase >= 1 ? 1 : 0, x: phase >= 1 ? 0 : -10 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="p-2 bg-gray-900/50 rounded border border-dashed border-gray-600"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">?</span>
                        <p className="text-xs text-gray-400 font-medium">{item.label}</p>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 pl-5">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: phase >= 2 ? 1 : 0 }}
                  className="mt-4 p-2 bg-red-500/10 border border-red-500/20 rounded text-center"
                >
                  <p className="text-xs text-red-400">Opportunity Cost</p>
                  <p className="text-lg font-bold text-red-400">Unknown $$$</p>
                </motion.div>
              </div>
            </motion.div>

            {/* CENTER - Radar Visualization */}
            <div className="flex-1 relative" style={{ minHeight: '400px' }}>
              <svg className="absolute inset-0 w-full h-full">
                {/* Pulse rings */}
                {[1, 2, 3].map((ring) => (
                  <motion.circle
                    key={ring}
                    cx="50%"
                    cy="50%"
                    r={`${ring * 15}%`}
                    fill="none"
                    stroke={phase >= ring ? 'rgba(0, 212, 255, 0.2)' : 'rgba(100, 100, 100, 0.1)'}
                    strokeWidth="1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: phase >= ring ? [0.4, 0.15] : 0.05 }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', delay: ring * 0.3 }}
                  />
                ))}

                {/* 1st degree connections */}
                {phase >= 1 && directRelationships.map((node) => (
                  <motion.line
                    key={`line-${node.id}`}
                    x1="50%" y1="50%"
                    x2={`${node.x}%`} y2={`${node.y}%`}
                    stroke="rgba(0, 212, 255, 0.3)"
                    strokeWidth="1"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6 }}
                  />
                ))}

                {/* 2nd degree connections */}
                {phase >= 2 && secondDegree.map((node, i) => {
                  const parent = directRelationships[i % directRelationships.length];
                  return (
                    <motion.line
                      key={`line2-${node.id}`}
                      x1={`${parent.x}%`} y1={`${parent.y}%`}
                      x2={`${node.x}%`} y2={`${node.y}%`}
                      stroke="rgba(0, 212, 255, 0.15)"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.4, delay: i * 0.03 }}
                    />
                  );
                })}

                {/* 3rd degree connections */}
                {phase >= 3 && opportunities.map((node, i) => {
                  const parent = secondDegree[i % secondDegree.length];
                  return (
                    <motion.line
                      key={`line3-${node.id}`}
                      x1={`${parent.x}%`} y1={`${parent.y}%`}
                      x2={`${node.x}%`} y2={`${node.y}%`}
                      stroke="rgba(201, 162, 39, 0.2)"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.02 }}
                    />
                  );
                })}
              </svg>

              {/* Center YOU node */}
              <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <div className="w-14 h-14 rounded-full bg-[var(--accent-gold)] flex items-center justify-center shadow-lg shadow-[var(--accent-gold)]/30">
                  <span className="text-[var(--bg-primary)] font-bold text-xs">YOU</span>
                </div>
              </motion.div>

              {/* 1st degree nodes */}
              {directRelationships.map((node, i) => (
                <motion.div
                  key={node.id}
                  className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  initial={{ scale: 0 }}
                  animate={{ scale: phase >= 1 ? 1 : 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                >
                  <div
                    className="w-full h-full rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: getNodeColor(node.type), color: '#0A1628' }}
                  >
                    {node.label}
                  </div>
                </motion.div>
              ))}

              {/* 2nd degree nodes */}
              {secondDegree.map((node, i) => (
                <motion.div
                  key={node.id}
                  className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  initial={{ scale: 0 }}
                  animate={{ scale: phase >= 2 ? 1 : 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <div
                    className="w-full h-full rounded-full border-2"
                    style={{ borderColor: getNodeColor(node.type), backgroundColor: 'rgba(10,22,40,0.8)' }}
                  />
                </motion.div>
              ))}

              {/* 3rd degree - opportunity nodes */}
              {opportunities.map((node, i) => (
                <motion.div
                  key={node.id}
                  className="absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  initial={{ scale: 0 }}
                  animate={{ scale: phase >= 3 ? 1 : 0 }}
                  transition={{ delay: i * 0.02 }}
                >
                  <motion.div
                    className="w-full h-full rounded-full bg-[var(--accent-gold)]"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                  />
                </motion.div>
              ))}

              {/* Legend at top of radar */}
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 -top-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : -10 }}
              >
                <div className="flex items-center justify-center gap-6 px-4 py-2 bg-[var(--bg-secondary)]/80 backdrop-blur-sm rounded-full border border-gray-700/50">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#00D4FF] shadow-sm shadow-[#00D4FF]/50" />
                    <span className="text-sm text-gray-300 font-medium">Buyers</span>
                  </div>
                  <div className="w-px h-4 bg-gray-600" />
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#10B981] shadow-sm shadow-[#10B981]/50" />
                    <span className="text-sm text-gray-300 font-medium">Suppliers</span>
                  </div>
                  <div className="w-px h-4 bg-gray-600" />
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#8B5CF6] shadow-sm shadow-[#8B5CF6]/50" />
                    <span className="text-sm text-gray-300 font-medium">Banks</span>
                  </div>
                  <div className="w-px h-4 bg-gray-600" />
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[var(--accent-gold)] shadow-sm shadow-[var(--accent-gold)]/50" />
                    <span className="text-sm text-gray-300 font-medium">Opportunities</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* RIGHT PANEL - Unlocked with Platform */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: phase >= 2 ? 1 : 0, x: phase >= 2 ? 0 : 30 }}
              className="w-64 flex-shrink-0"
            >
              <div className="bg-[var(--accent-cyan)]/5 rounded-xl border border-[var(--accent-cyan)]/30 p-4 h-full">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-[var(--accent-cyan)]" />
                  <p className="text-sm font-semibold text-[var(--accent-cyan)]">Unlocked with Platform</p>
                </div>

                {/* Network Growth */}
                <div className="space-y-2 mb-4">
                  {[
                    { type: 'Buyers', from: '12', to: '200+', growth: '16x' },
                    { type: 'Suppliers', from: '8', to: '150+', growth: '18x' },
                    { type: 'Banks', from: '3', to: '45+', growth: '15x' },
                  ].map((item, i) => (
                    <motion.div
                      key={item.type}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: phase >= 2 ? 1 : 0, x: phase >= 2 ? 0 : 10 }}
                      transition={{ delay: 0.1 + i * 0.1 }}
                      className="flex items-center justify-between p-2 bg-[var(--bg-secondary)]/50 rounded"
                    >
                      <span className="text-xs text-gray-300">{item.type}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">{item.from}</span>
                        <span className="text-gray-600">→</span>
                        <span className="text-xs text-[var(--accent-cyan)] font-semibold">{item.to}</span>
                        <span className="text-xs px-1 py-0.5 bg-green-500/20 text-green-400 rounded text-[10px]">{item.growth}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Capabilities */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: phase >= 3 ? 1 : 0 }}
                  className="border-t border-[var(--accent-cyan)]/20 pt-3"
                >
                  <p className="text-xs text-[var(--accent-cyan)] mb-2">New Capabilities</p>
                  <div className="space-y-2">
                    {[
                      { label: '2nd Degree Visibility', desc: 'See who they work with' },
                      { label: 'Opportunity Matching', desc: 'Auto-surface deals' },
                      { label: 'Relationship Mapping', desc: 'Full supply chain view' },
                      { label: 'Risk Intelligence', desc: 'Network concentration' },
                    ].map((item, i) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: phase >= 3 ? 1 : 0, scale: phase >= 3 ? 1 : 0.95 }}
                        transition={{ delay: 0.2 + i * 0.08 }}
                        className="p-2 bg-[var(--bg-secondary)]/30 rounded"
                      >
                        <p className="text-xs text-white font-medium">{item.label}</p>
                        <p className="text-[10px] text-gray-500">{item.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Value */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: phase >= 3 ? 1 : 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-3 p-2 bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/30 rounded text-center"
                >
                  <p className="text-xs text-[var(--accent-gold)]">Pipeline Opportunity</p>
                  <p className="text-lg font-bold text-[var(--accent-gold)]">$22.5M+</p>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Bottom insight */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: phase >= 3 ? 1 : 0, y: phase >= 3 ? 0 : 10 }}
            className="absolute bottom-16 left-0 right-0 text-center px-8"
          >
            <p className="text-[var(--accent-gold)] font-semibold">
              Every connection has connections you can&apos;t see today
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Platform visibility reveals 4x more relationships and surfaces deals before they go to market
            </p>
          </motion.div>
        </div>
      );
    }

    // Special visualization for Unified Onboarding (index 2) - Spinning convergence animation
    if (index === 2) {
      const oldWaySteps = [
        { id: 'legal', label: 'Legal Review', time: '2-4 weeks', icon: '📋' },
        { id: 'tech', label: 'Tech Assessment', time: '3-6 weeks', icon: '🔧' },
        { id: 'security', label: 'Security Audit', time: '4-8 weeks', icon: '🔒' },
        { id: 'integration', label: 'Custom Integration', time: '8-16 weeks', icon: '⚙️' },
        { id: 'testing', label: 'UAT & Testing', time: '4-6 weeks', icon: '🧪' },
        { id: 'golive', label: 'Go Live', time: '2-4 weeks', icon: '🚀' },
      ];

      const unifiedServices = [
        { id: 'trade', label: 'Trade Finance', color: '#00D4FF' },
        { id: 'payments', label: 'Payments', color: '#10B981' },
        { id: 'fx', label: 'FX Services', color: '#8B5CF6' },
        { id: 'lending', label: 'Lending', color: '#F59E0B' },
        { id: 'insurance', label: 'Insurance', color: '#EC4899' },
        { id: 'analytics', label: 'Analytics', color: '#6366F1' },
      ];

      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-6 pt-16">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-16 left-0 right-0 text-center z-10"
          >
            <h2 className="text-2xl font-bold text-white mb-1">One Integration, All Services</h2>
            <p className="text-sm text-gray-400">From months of custom work to instant access</p>
          </motion.div>

          <div className="w-full max-w-6xl flex gap-8 mt-8">
            {/* Left - The Old Way */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: phase >= 1 ? 1 : 0, x: phase >= 1 ? 0 : -30 }}
              className="flex-1"
            >
              <div className="text-center mb-4">
                <p className="text-xs text-red-400 uppercase tracking-wider">The Old Way</p>
                <p className="text-lg font-semibold text-gray-400">Per-Service Onboarding</p>
              </div>

              <div className="relative">
                {/* Vertical timeline */}
                <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gray-700" />

                <div className="space-y-3">
                  {oldWaySteps.map((step, i) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: phase >= 1 ? 1 : 0, x: phase >= 1 ? 0 : -20 }}
                      transition={{ delay: 0.1 + i * 0.08 }}
                      className="flex items-center gap-3 pl-2"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center text-sm z-10">
                        {step.icon}
                      </div>
                      <div className="flex-1 flex items-center justify-between p-2 bg-gray-800/50 rounded border border-gray-700">
                        <span className="text-sm text-gray-400">{step.label}</span>
                        <span className="text-xs text-red-400">{step.time}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: phase >= 1 ? 1 : 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-center"
                >
                  <p className="text-red-400 font-semibold">23-44 weeks total</p>
                  <p className="text-xs text-gray-500">Repeat for each service</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Center - Spinning Hub */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: phase >= 2 ? 1 : 0, scale: phase >= 2 ? 1 : 0.8 }}
              className="flex flex-col items-center justify-center w-64"
            >
              <div className="relative w-48 h-48">
                {/* Outer spinning ring with services */}
                <motion.div
                  className="absolute inset-0"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                  {unifiedServices.map((service, i) => {
                    const angle = (i * 360) / unifiedServices.length;
                    const radian = (angle * Math.PI) / 180;
                    const x = 50 + 42 * Math.cos(radian);
                    const y = 50 + 42 * Math.sin(radian);
                    return (
                      <motion.div
                        key={service.id}
                        className="absolute w-12 h-12 -ml-6 -mt-6 rounded-full flex items-center justify-center text-xs font-medium"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          backgroundColor: `${service.color}20`,
                          border: `2px solid ${service.color}`,
                          color: service.color,
                        }}
                        initial={{ scale: 0 }}
                        animate={{ scale: phase >= 2 ? 1 : 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                      >
                        <motion.span
                          animate={{ rotate: -360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                          className="text-center text-[9px] leading-tight"
                        >
                          {service.label.split(' ')[0]}
                        </motion.span>
                      </motion.div>
                    );
                  })}
                </motion.div>

                {/* Center hub */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: phase >= 2 ? 1 : 0 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--accent-cyan)]/30 to-[var(--accent-gold)]/30 border-2 border-[var(--accent-cyan)] flex flex-col items-center justify-center shadow-lg shadow-[var(--accent-cyan)]/20"
                  >
                    <span className="text-xl">🔗</span>
                    <span className="text-[8px] text-[var(--accent-cyan)] font-semibold">ONE API</span>
                  </motion.div>
                </div>

                {/* Pulse rings */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: phase >= 2 ? 1 : 0 }}
                >
                  {[1, 2].map((ring) => (
                    <motion.div
                      key={ring}
                      className="absolute w-20 h-20 rounded-full border border-[var(--accent-cyan)]"
                      animate={{ scale: [1, 2.5], opacity: [0.4, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: ring * 0.8 }}
                    />
                  ))}
                </motion.div>
              </div>

              {/* Arrow indicator */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : -10 }}
                className="mt-4 text-center"
              >
                <p className="text-[var(--accent-cyan)] font-semibold">Connect Once</p>
                <p className="text-xs text-gray-500">Access Everything</p>
              </motion.div>
            </motion.div>

            {/* Right - The New Way */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: phase >= 3 ? 1 : 0, x: phase >= 3 ? 0 : 30 }}
              className="flex-1"
            >
              <div className="text-center mb-4">
                <p className="text-xs text-[var(--accent-cyan)] uppercase tracking-wider">The New Way</p>
                <p className="text-lg font-semibold text-white">Unified Onboarding</p>
              </div>

              <div className="space-y-3">
                {[
                  { step: '1', label: 'Single Application', time: '1 day', desc: 'One form, all services' },
                  { step: '2', label: 'Automated Compliance', time: '1-2 days', desc: 'Pre-configured rules' },
                  { step: '3', label: 'API Credentials', time: 'Instant', desc: 'Self-service portal' },
                  { step: '4', label: 'Go Live', time: 'Same day', desc: 'All services enabled' },
                ].map((item, i) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: phase >= 3 ? 1 : 0, x: phase >= 3 ? 0 : 20 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-[var(--accent-cyan)]/20 border border-[var(--accent-cyan)] flex items-center justify-center text-sm text-[var(--accent-cyan)] font-bold">
                      {item.step}
                    </div>
                    <div className="flex-1 p-2 bg-[var(--accent-cyan)]/5 rounded border border-[var(--accent-cyan)]/30">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">{item.label}</span>
                        <span className="text-xs text-green-400">{item.time}</span>
                      </div>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: phase >= 3 ? 1 : 0 }}
                transition={{ delay: 0.4 }}
                className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-center"
              >
                <p className="text-green-400 font-semibold">2-3 days total</p>
                <p className="text-xs text-gray-500">All services included</p>
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom comparison metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: phase >= 3 ? 1 : 0, y: phase >= 3 ? 0 : 20 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-6 left-0 right-0 px-8"
          >
            <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6">
              {[
                { metric: 'Time to Market', old: '6-12 months', new: '< 1 week', improvement: '50x faster' },
                { metric: 'Integration Cost', old: '$500K+', new: '$0', improvement: 'Self-service' },
                { metric: 'Services Access', old: '1 at a time', new: 'All at once', improvement: 'Instant' },
              ].map((item) => (
                <div key={item.metric} className="text-center">
                  <p className="text-xs text-gray-500 mb-1">{item.metric}</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm text-gray-500 line-through">{item.old}</span>
                    <span className="text-gray-600">→</span>
                    <span className="text-sm text-[var(--accent-cyan)] font-semibold">{item.new}</span>
                  </div>
                  <p className="text-xs text-green-400 mt-1">{item.improvement}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      );
    }

    // Special visualization for Future Integration (index 3) - Expanded Reach
    if (index === 3) {
      const integrationChannels = [
        { id: 'api', label: 'REST APIs', desc: 'Real-time integration', icon: '🔌', color: '#00D4FF' },
        { id: 'upload', label: 'File Upload', desc: 'Batch processing', icon: '📤', color: '#10B981' },
        { id: 'swift', label: 'SWIFT/MQ', desc: 'Messaging protocols', icon: '📨', color: '#8B5CF6' },
        { id: 'portal', label: 'Self-Service Portal', desc: 'Manual entry', icon: '🖥️', color: '#F59E0B' },
      ];

      const externalPartners = [
        { id: 'buyers', label: 'Buyers', count: '500+', icon: '🏢', color: '#00D4FF' },
        { id: 'suppliers', label: 'Suppliers', count: '1,200+', icon: '🏭', color: '#10B981' },
        { id: 'banks', label: 'Banks', count: '50+', icon: '🏦', color: '#8B5CF6' },
        { id: 'corporates', label: 'Corporates', count: '300+', icon: '🏛️', color: '#F59E0B' },
      ];

      const futureReady = [
        { id: 'iso', label: 'ISO 20022', icon: '📐' },
        { id: 'ai', label: 'AI Services', icon: '🤖' },
        { id: 'realtime', label: 'Real-time Events', icon: '⚡' },
      ];

      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-6 pt-16">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-16 left-0 right-0 text-center z-10"
          >
            <h2 className="text-2xl font-bold text-white mb-1">Expanded Reach Through Multiple Channels</h2>
            <p className="text-sm text-gray-400">Any partner, any integration method — maximum flexibility</p>
          </motion.div>

          <div className="w-full max-w-6xl mt-8">
            {/* Main visualization - Hub and Spoke with modules */}
            <div className="relative flex items-center justify-center" style={{ minHeight: '380px' }}>

              {/* Left side - Integration Channels */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: phase >= 1 ? 1 : 0, x: phase >= 1 ? 0 : -40 }}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-52"
              >
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 text-center">Integration Channels</p>
                <div className="space-y-2">
                  {integrationChannels.map((channel, i) => (
                    <motion.div
                      key={channel.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: phase >= 1 ? 1 : 0, x: phase >= 1 ? 0 : -20 }}
                      transition={{ delay: 0.1 + i * 0.08 }}
                      className="flex items-center gap-2 p-2 rounded-lg"
                      style={{ backgroundColor: `${channel.color}15`, border: `1px solid ${channel.color}40` }}
                    >
                      <span className="text-lg">{channel.icon}</span>
                      <div>
                        <span className="text-sm font-medium" style={{ color: channel.color }}>{channel.label}</span>
                        <p className="text-[10px] text-gray-500">{channel.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Center Hub - Integration Platform */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: phase >= 1 ? 1 : 0 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="relative z-10"
              >
                {/* Outer rotating ring */}
                <motion.div
                  className="absolute inset-0 w-40 h-40 -m-4 rounded-full border-2 border-dashed border-[var(--accent-cyan)]/30"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                />

                {/* Main hub */}
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[var(--accent-cyan)]/20 to-[var(--accent-gold)]/20 border-2 border-[var(--accent-cyan)] flex flex-col items-center justify-center shadow-lg shadow-[var(--accent-cyan)]/20">
                  <span className="text-2xl mb-1">🔗</span>
                  <span className="text-xs text-[var(--accent-cyan)] font-semibold text-center px-2">Platform</span>
                </div>

                {/* Pulse effect */}
                <motion.div
                  className="absolute inset-0 w-32 h-32 rounded-full border border-[var(--accent-cyan)]"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>

              {/* Right side - External Partners (Buyers, Suppliers, Banks) */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: phase >= 2 ? 1 : 0, x: phase >= 2 ? 0 : 40 }}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-52"
              >
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 text-center">Expanded Network Reach</p>
                <div className="space-y-2">
                  {externalPartners.map((partner, i) => (
                    <motion.div
                      key={partner.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: phase >= 2 ? 1 : 0, x: phase >= 2 ? 0 : 20 }}
                      transition={{ delay: 0.1 + i * 0.08 }}
                      className="flex items-center justify-between p-2 rounded-lg"
                      style={{ backgroundColor: `${partner.color}15`, border: `1px solid ${partner.color}40` }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{partner.icon}</span>
                        <span className="text-sm font-medium" style={{ color: partner.color }}>{partner.label}</span>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/10" style={{ color: partner.color }}>{partner.count}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Connection lines - Left to Center */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }} viewBox="0 0 100 100" preserveAspectRatio="none">
                {phase >= 1 && integrationChannels.map((channel, i) => {
                  const startY = 28 + i * 14;
                  return (
                    <motion.line
                      key={`left-${i}`}
                      x1="20"
                      y1={startY}
                      x2="42"
                      y2="50"
                      stroke={channel.color}
                      strokeOpacity="0.4"
                      strokeWidth="0.5"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                    />
                  );
                })}
                {phase >= 2 && externalPartners.map((partner, i) => {
                  const endY = 28 + i * 14;
                  return (
                    <motion.line
                      key={`right-${i}`}
                      x1="58"
                      y1="50"
                      x2="80"
                      y2={endY}
                      stroke={partner.color}
                      strokeOpacity="0.4"
                      strokeWidth="0.5"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                    />
                  );
                })}
              </svg>

              {/* Bottom - Future Ready */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: phase >= 3 ? 1 : 0, y: phase >= 3 ? 0 : 30 }}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg"
              >
                <p className="text-xs text-[var(--accent-gold)] uppercase tracking-wider mb-2 text-center">Future Ready</p>
                <div className="flex justify-center gap-3">
                  {futureReady.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: phase >= 3 ? 1 : 0, y: phase >= 3 ? 0 : 10 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="flex flex-col items-center p-2 bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/30 rounded-lg"
                    >
                      <span className="text-xl mb-1">{item.icon}</span>
                      <span className="text-xs text-[var(--accent-gold)]">{item.label}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Business Value Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: phase >= 3 ? 1 : 0, y: phase >= 3 ? 0 : 20 }}
              transition={{ delay: 0.4 }}
              className="mt-4 grid grid-cols-4 gap-4"
            >
              {[
                { metric: 'Partner Types', before: 'Limited', after: 'Any entity', icon: '🤝' },
                { metric: 'Integration Options', before: '1 method', after: '4+ channels', icon: '🔌' },
                { metric: 'Time to Connect', before: 'Months', after: 'Days', icon: '⏱️' },
                { metric: 'Network Scale', before: 'Static', after: 'Unlimited', icon: '📈' },
              ].map((item, i) => (
                <motion.div
                  key={item.metric}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: phase >= 3 ? 1 : 0, scale: phase >= 3 ? 1 : 0.95 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="bg-[var(--bg-secondary)]/50 rounded-lg border border-gray-700 p-3 text-center"
                >
                  <span className="text-lg">{item.icon}</span>
                  <p className="text-xs text-gray-400 mt-1">{item.metric}</p>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 line-through">{item.before}</span>
                    <span className="text-gray-600">→</span>
                    <span className="text-xs text-[var(--accent-cyan)] font-semibold">{item.after}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Bottom insight */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 3 ? 1 : 0 }}
            className="absolute bottom-16 left-0 right-0 text-center"
          >
            <p className="text-[var(--accent-gold)] font-semibold">Multiple channels, one platform — reach any partner, any way they prefer</p>
            <p className="text-xs text-gray-500 mt-1">Buyers, suppliers, and banks connect through their preferred method</p>
          </motion.div>
        </div>
      );
    }

    // Special visualization for Scalable Operations (index 4) - Volume vs Headcount
    if (index === 4) {
      const manualTasks = [
        { task: 'Data Entry', hours: '40%', automation: '95%' },
        { task: 'Reconciliation', hours: '25%', automation: '90%' },
        { task: 'Exception Handling', hours: '20%', automation: '70%' },
        { task: 'Reporting', hours: '15%', automation: '85%' },
      ];

      const volumeData = [
        { year: 'Y1', volume: 20, oldStaff: 20, newStaff: 20 },
        { year: 'Y2', volume: 40, oldStaff: 38, newStaff: 22 },
        { year: 'Y3', volume: 70, oldStaff: 65, newStaff: 25 },
        { year: 'Y4', volume: 100, oldStaff: 95, newStaff: 28 },
        { year: 'Y5', volume: 150, oldStaff: 140, newStaff: 32 },
      ];

      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-6 pt-16">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-16 left-0 right-0 text-center z-10"
          >
            <h2 className="text-2xl font-bold text-white mb-1">Break the Linear Scaling Trap</h2>
            <p className="text-sm text-gray-400">Grow volume exponentially, not your headcount</p>
          </motion.div>

          <div className="w-full max-w-6xl mt-8 flex gap-8">
            {/* Left - The Problem: Linear Scaling */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: phase >= 1 ? 1 : 0, x: phase >= 1 ? 0 : -30 }}
              className="flex-1"
            >
              <div className="text-center mb-4">
                <p className="text-xs text-red-400 uppercase tracking-wider">Today&apos;s Reality</p>
                <p className="text-lg font-semibold text-gray-400">Volume = Headcount</p>
              </div>

              {/* Animated bar chart showing linear growth */}
              <div className="bg-gray-800/40 rounded-xl border border-gray-700/50 p-4">
                <div className="flex items-end justify-between h-48 gap-2 mb-4">
                  {volumeData.map((d, i) => (
                    <div key={d.year} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex gap-1 items-end justify-center h-40">
                        {/* Volume bar */}
                        <motion.div
                          className="w-5 bg-gray-600 rounded-t"
                          initial={{ height: 0 }}
                          animate={{ height: phase >= 1 ? `${d.volume * 0.95}%` : 0 }}
                          transition={{ duration: 0.5, delay: i * 0.1 }}
                        />
                        {/* Staff bar (old way) */}
                        <motion.div
                          className="w-5 bg-red-500/70 rounded-t"
                          initial={{ height: 0 }}
                          animate={{ height: phase >= 1 ? `${d.oldStaff * 0.95}%` : 0 }}
                          transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{d.year}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-4 text-xs">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-600 rounded" /> Volume</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500/70 rounded" /> Staff Needed</span>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: phase >= 1 ? 1 : 0 }}
                  transition={{ delay: 0.8 }}
                  className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-center"
                >
                  <p className="text-red-400 font-semibold">7x volume = 7x staff</p>
                  <p className="text-xs text-gray-500">Linear cost growth is unsustainable</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Center - Transformation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: phase >= 2 ? 1 : 0, scale: phase >= 2 ? 1 : 0.8 }}
              className="flex flex-col items-center justify-center w-48"
            >
              {/* Manual tasks being automated */}
              <div className="relative">
                <motion.div
                  className="w-24 h-24 rounded-full border-4 border-[var(--accent-cyan)] flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                >
                  <div className="absolute inset-2 rounded-full bg-[var(--accent-cyan)]/10" />
                </motion.div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-2xl">⚡</span>
                    <p className="text-[10px] text-[var(--accent-cyan)] font-semibold">Automation</p>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: phase >= 2 ? 1 : 0 }}
                className="my-4"
              >
                <svg width="40" height="60" viewBox="0 0 40 60">
                  <motion.path
                    d="M20 0 L20 45 M10 35 L20 50 L30 35"
                    stroke="var(--accent-cyan)"
                    strokeWidth="2"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8 }}
                  />
                </svg>
              </motion.div>

              {/* Tasks automated */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: phase >= 2 ? 1 : 0 }}
                className="space-y-1 text-center"
              >
                {manualTasks.map((task, i) => (
                  <motion.div
                    key={task.task}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: phase >= 2 ? 1 : 0, x: phase >= 2 ? 0 : -10 }}
                    transition={{ delay: i * 0.1 }}
                    className="text-[10px] text-gray-400"
                  >
                    {task.task}: <span className="text-green-400">{task.automation}</span> automated
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right - The Solution: Flat Scaling */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: phase >= 3 ? 1 : 0, x: phase >= 3 ? 0 : 30 }}
              className="flex-1"
            >
              <div className="text-center mb-4">
                <p className="text-xs text-[var(--accent-cyan)] uppercase tracking-wider">With Platform</p>
                <p className="text-lg font-semibold text-white">Volume ≠ Headcount</p>
              </div>

              {/* Animated bar chart showing decoupled growth */}
              <div className="bg-[var(--accent-cyan)]/5 rounded-xl border border-[var(--accent-cyan)]/30 p-4">
                <div className="flex items-end justify-between h-48 gap-2 mb-4">
                  {volumeData.map((d, i) => (
                    <div key={d.year} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex gap-1 items-end justify-center h-40">
                        {/* Volume bar */}
                        <motion.div
                          className="w-5 bg-[var(--accent-cyan)] rounded-t"
                          initial={{ height: 0 }}
                          animate={{ height: phase >= 3 ? `${d.volume * 0.95}%` : 0 }}
                          transition={{ duration: 0.5, delay: i * 0.1 }}
                        />
                        {/* Staff bar (new way - flat) */}
                        <motion.div
                          className="w-5 bg-green-500 rounded-t"
                          initial={{ height: 0 }}
                          animate={{ height: phase >= 3 ? `${d.newStaff * 0.95}%` : 0 }}
                          transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                        />
                      </div>
                      <span className="text-xs text-gray-400">{d.year}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-4 text-xs">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-[var(--accent-cyan)] rounded" /> Volume</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded" /> Staff Needed</span>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: phase >= 3 ? 1 : 0 }}
                  transition={{ delay: 0.8 }}
                  className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-center"
                >
                  <p className="text-green-400 font-semibold">7x volume = 1.6x staff</p>
                  <p className="text-xs text-gray-400">Automation absorbs the growth</p>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Bottom metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: phase >= 3 ? 1 : 0, y: phase >= 3 ? 0 : 20 }}
            transition={{ delay: 0.5 }}
            className="mt-6 grid grid-cols-4 gap-4 w-full max-w-4xl"
          >
            {[
              { metric: 'Cost per Transaction', old: '$12', new: '$2', saving: '83% reduction' },
              { metric: 'Processing Capacity', old: '1,000/day', new: '50,000/day', saving: '50x throughput' },
              { metric: 'Staff per $1B Volume', old: '45 FTE', new: '8 FTE', saving: '82% fewer' },
              { metric: 'Time to Scale', old: '6-12 months', new: 'Instant', saving: 'On-demand' },
            ].map((item, i) => (
              <motion.div
                key={item.metric}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: phase >= 3 ? 1 : 0, scale: phase >= 3 ? 1 : 0.95 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="bg-[var(--bg-secondary)]/50 rounded-lg border border-gray-700 p-3 text-center"
              >
                <p className="text-xs text-gray-400">{item.metric}</p>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="text-xs text-gray-500 line-through">{item.old}</span>
                  <span className="text-gray-600">→</span>
                  <span className="text-sm text-[var(--accent-cyan)] font-semibold">{item.new}</span>
                </div>
                <p className="text-xs text-green-400 mt-1">{item.saving}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom insight */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 3 ? 1 : 0 }}
            className="absolute bottom-16 left-0 right-0 text-center"
          >
            <p className="text-[var(--accent-gold)] font-semibold">Scale your business, not your payroll</p>
            <p className="text-xs text-gray-500 mt-1">Automation handles the volume — your team handles the exceptions</p>
          </motion.div>
        </div>
      );
    }

    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center p-8 pt-16">
        {/* Transformation Journey - Horizontal flow */}
        <div className="w-full max-w-5xl">
          {/* Main transformation arrow */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {/* Current State Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: phase >= 1 ? 1 : 0, x: phase >= 1 ? 0 : -30 }}
              className="w-48 bg-gray-800/80 rounded-xl border border-gray-600 p-5 text-center"
            >
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Current</p>
              <p className="text-3xl font-bold text-gray-300">{data.current.value}</p>
              <p className="text-xs text-gray-500 mt-1">{data.current.detail}</p>
            </motion.div>

            {/* Transformation Arrow */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: phase >= 2 ? 1 : 0, scaleX: phase >= 2 ? 1 : 0 }}
              className="flex-1 max-w-xs flex items-center"
            >
              <div className="flex-1 h-1 bg-gradient-to-r from-gray-600 via-[var(--accent-cyan)] to-[var(--accent-cyan)] rounded" />
              <div className="w-0 h-0 border-l-[12px] border-l-[var(--accent-cyan)] border-y-[8px] border-y-transparent" />
            </motion.div>

            {/* Target State Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: phase >= 2 ? 1 : 0, x: phase >= 2 ? 0 : 30 }}
              className="w-48 bg-[var(--accent-cyan)]/20 rounded-xl border border-[var(--accent-cyan)] p-5 text-center"
            >
              <p className="text-xs text-[var(--accent-cyan)] uppercase tracking-wider mb-1">Target</p>
              <p className="text-3xl font-bold text-[var(--accent-cyan)]">{data.target.value}</p>
              <p className="text-xs text-[var(--accent-cyan)]/70 mt-1">{data.target.detail}</p>
            </motion.div>
          </div>

          {/* Improvement Metrics - Horizontal bar style */}
          {data.improvements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: phase >= 3 ? 1 : 0, y: phase >= 3 ? 0 : 20 }}
            className="bg-[var(--bg-secondary)]/50 rounded-xl border border-gray-700 p-6"
          >
            <div className="grid grid-cols-3 gap-6">
              {data.improvements.map((item, i) => (
                <motion.div
                  key={item.metric}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: phase >= 3 ? 1 : 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="relative"
                >
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-sm text-gray-400">{item.metric}</span>
                    <span className="text-xs text-green-400">+{Math.min(item.percent, 999)}%</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <span className="text-gray-500">{item.from}</span>
                    <span className="text-gray-600">→</span>
                    <span className="text-[var(--accent-cyan)] font-semibold">{item.to}</span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: phase >= 3 ? `${Math.min(item.percent, 100)}%` : 0 }}
                      transition={{ duration: 0.8, delay: i * 0.15 }}
                      className="h-full bg-gradient-to-r from-[var(--accent-cyan)]/60 to-[var(--accent-cyan)] rounded-full"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          )}

          {/* Business Value Callout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: phase >= 3 ? 1 : 0, y: phase >= 3 ? 0 : 20 }}
            transition={{ delay: 0.3 }}
            className="mt-6 flex justify-center"
          >
            <div className="inline-flex items-center gap-4 bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/30 rounded-xl px-6 py-3">
              <div className="text-right">
                <p className="text-xs text-[var(--accent-gold)]/70 uppercase tracking-wider">{data.businessValue.label}</p>
              </div>
              <div className="text-3xl font-bold text-[var(--accent-gold)]">{data.businessValue.value}</div>
              <div className="text-left">
                <p className="text-xs text-[var(--accent-gold)]/70">{data.businessValue.note}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4"
      >
        <h2 className="text-5xl font-bold text-[var(--text-primary)] mb-2">Business Opportunities</h2>
        <p className="text-xl text-[var(--text-secondary)]">Technical modernization enables business innovation</p>
      </motion.div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Opportunity selector - Left side */}
        <div className="w-64 flex flex-col gap-2">
          {opportunities.map((opp, i) => {
            const isActive = activeOpportunity === i;
            return (
              <motion.button
                key={i}
                onClick={() => { onPhaseChange ? onPhaseChange(i) : setInternalActiveOpportunity(i); }}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`text-left p-3 rounded-xl border-2 transition-all ${
                  isActive
                    ? 'bg-[var(--accent-cyan)]/20 border-[var(--accent-cyan)]'
                    : 'bg-[var(--bg-secondary)]/50 border-transparent hover:border-[var(--accent-cyan)]/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                    isActive ? 'bg-[var(--accent-cyan)] text-white' : 'bg-gray-700 text-gray-400'
                  }`}>
                    {opp.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm ${isActive ? 'text-[var(--accent-cyan)]' : 'text-[var(--text-primary)]'}`}>
                      {opp.title}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] truncate">{opp.subtitle}</p>
                  </div>
                </div>
              </motion.button>
            );
          })}

          {/* Enabler note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-auto p-3 bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/30 rounded-xl"
          >
            <p className="text-xs text-[var(--text-muted)] mb-1">Strategic Value</p>
            <p className="text-[var(--accent-cyan)] font-bold text-sm">Growth Enablement</p>
          </motion.div>
        </div>

        {/* Visualization area - Right side */}
        <div className="flex-1 bg-[var(--bg-secondary)]/30 rounded-2xl border border-[var(--accent-cyan)]/20 overflow-hidden relative">
          {/* Opportunity title inside viz */}
          <div className="absolute top-4 left-4 z-10">
            <motion.div
              key={activeOpportunity}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-xl font-bold text-[var(--accent-cyan)]">{opportunities[activeOpportunity].title}</p>
              <p className="text-sm text-[var(--text-muted)]">{opportunities[activeOpportunity].detail}</p>
            </motion.div>
          </div>

          {/* Navigation dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {opportunities.map((_, i) => (
              <button
                key={i}
                onClick={() => { onPhaseChange ? onPhaseChange(i) : setInternalActiveOpportunity(i); }}
                className={`w-3 h-3 rounded-full transition-all ${
                  activeOpportunity === i ? 'bg-[var(--accent-cyan)] w-8' : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>

          {/* Visualization content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeOpportunity}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              {renderOpportunityVisual(activeOpportunity)}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Transformation Goals Visualization - Rising Pillars with Energy Flow
function TransformationGoals() {
  const [phase, setPhase] = useState(0);
  const [activeGoal, setActiveGoal] = useState(-1);

  const goals = [
    { icon: '⚡', title: 'Operational Efficiency', metric: '40%', unit: 'cost reduction', color: '#00D4FF', height: 85 },
    { icon: '🚀', title: 'Time to Market', metric: '3x', unit: 'faster deployment', color: '#C9A227', height: 75 },
    { icon: '🔄', title: 'End-to-End STP', metric: '95%', unit: 'straight-through', color: '#4ECDC4', height: 95 },
    { icon: '📈', title: 'Scalability', metric: '10x', unit: 'volume capacity', color: '#9B59B6', height: 80 },
    { icon: '🤝', title: 'Client Trust', metric: '99.9%', unit: 'uptime target', color: '#E74C3C', height: 90 },
    { icon: '🧠', title: 'Modern Processing', metric: 'AI', unit: 'powered decisions', color: '#3498DB', height: 70 },
  ];

  useEffect(() => {
    setTimeout(() => setPhase(1), 500);
    setTimeout(() => setPhase(2), 1200);
    setTimeout(() => setPhase(3), 2000);
    setTimeout(() => setPhase(4), 3000);
  }, []);

  useEffect(() => {
    if (phase >= 3) {
      const timer = setTimeout(() => {
        setActiveGoal(prev => (prev + 1) % goals.length);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [phase, activeGoal]);

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="w-full max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-2">ELC Goals & Value Proposition</h2>
          <p className="text-xl text-[var(--text-secondary)]">Transforming Trade Processing for the Future</p>
        </motion.div>

        <div className="flex items-center justify-center gap-8">
          {/* Left Side - Rising Pillars */}
          <div className="flex items-end gap-4 h-[280px]">
            {goals.slice(0, 3).map((goal, i) => {
              const isActive = activeGoal === i;
              return (
                <motion.div
                  key={i}
                  className="relative flex flex-col items-center"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: phase >= 2 ? 1 : 0,
                    scale: isActive ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Always visible metric on top */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 10 }}
                    transition={{ delay: i * 0.15 + 0.3 }}
                    className="mb-2 text-center"
                  >
                    <motion.p
                      className="text-2xl font-bold"
                      animate={{
                        color: isActive ? goal.color : 'rgba(255,255,255,0.7)',
                        textShadow: isActive ? `0 0 20px ${goal.color}` : 'none',
                      }}
                    >
                      {goal.metric}
                    </motion.p>
                    <p className="text-[10px] text-[var(--text-muted)]">{goal.unit}</p>
                  </motion.div>

                  {/* Pillar */}
                  <motion.div
                    className="w-14 rounded-t-lg relative overflow-hidden"
                    initial={{ height: 0 }}
                    animate={{
                      height: phase >= 2 ? goal.height * 2 : 0,
                      boxShadow: isActive ? `0 0 30px ${goal.color}60` : 'none',
                    }}
                    transition={{ delay: i * 0.15, duration: 0.8, ease: 'easeOut' }}
                    style={{
                      backgroundColor: `${goal.color}20`,
                      borderTop: `2px solid ${isActive ? goal.color : goal.color + '50'}`,
                      borderLeft: `2px solid ${isActive ? goal.color : goal.color + '50'}`,
                      borderRight: `2px solid ${isActive ? goal.color : goal.color + '50'}`,
                      borderBottom: 'none',
                    }}
                  >
                    {/* Animated fill effect */}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0"
                      animate={{ height: isActive ? '100%' : '70%' }}
                      transition={{ duration: 0.5 }}
                      style={{ backgroundColor: `${goal.color}${isActive ? '60' : '30'}` }}
                    />
                  </motion.div>

                  {/* Icon and label */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: phase >= 2 ? 1 : 0 }}
                    transition={{ delay: i * 0.15 + 0.5 }}
                    className="mt-2 text-center"
                  >
                    <motion.div
                      className="w-9 h-9 rounded-full flex items-center justify-center mb-1 mx-auto"
                      animate={{
                        backgroundColor: isActive ? `${goal.color}40` : `${goal.color}20`,
                        boxShadow: isActive ? `0 0 15px ${goal.color}` : 'none',
                      }}
                      style={{ border: `2px solid ${goal.color}` }}
                    >
                      <span className="text-base">{goal.icon}</span>
                    </motion.div>
                    <p className="text-[9px] text-[var(--text-secondary)] w-14 leading-tight">{goal.title}</p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Center - Transformation Core */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: phase >= 1 ? 1 : 0, scale: phase >= 1 ? 1 : 0.8 }}
            className="relative flex flex-col items-center"
          >
            {/* Platform Hub */}
            <motion.div
              className="relative w-48 h-48 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            >
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border-2 border-[var(--accent-cyan)]/30" />

              {/* Inner rotating ring with dots */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                  <motion.circle
                    key={i}
                    cx={100 + 85 * Math.cos((angle - 90) * Math.PI / 180)}
                    cy={100 + 85 * Math.sin((angle - 90) * Math.PI / 180)}
                    r="4"
                    fill={goals[i]?.color || '#00D4FF'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: phase >= 2 ? 1 : 0 }}
                    transition={{ delay: i * 0.1 }}
                  />
                ))}
              </svg>
            </motion.div>

            {/* Static center content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: phase >= 1 ? 1 : 0, scale: phase >= 1 ? 1 : 0 }}
                className="w-36 h-36 rounded-full bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] border border-[var(--accent-gold)]/50 flex flex-col items-center justify-center shadow-lg"
                style={{ boxShadow: '0 0 40px rgba(201, 162, 39, 0.2)' }}
              >
                <span className="text-3xl mb-1">🎯</span>
                <p className="text-sm font-bold text-[var(--accent-gold)]">ELC Platform</p>
                <p className="text-[10px] text-[var(--text-muted)]">Transformation Hub</p>
              </motion.div>
            </div>

            {/* Transformation Progress - Below hub */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: phase >= 3 ? 1 : 0, y: phase >= 3 ? 0 : 20 }}
              className="mt-6 flex items-center gap-3"
            >
              <div className="text-center">
                <p className="text-2xl font-bold text-red-400">39%</p>
                <p className="text-[10px] text-[var(--text-muted)]">Today</p>
              </div>

              {/* Progress bar */}
              <div className="relative w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: phase >= 3 ? '100%' : '0%' }}
                  transition={{ duration: 2, delay: 0.5 }}
                />
                {/* Animated glow */}
                <motion.div
                  className="absolute inset-y-0 w-4 bg-white/50 rounded-full blur-sm"
                  animate={{ x: [0, 96, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                />
              </div>

              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">79%</p>
                <p className="text-[10px] text-[var(--text-muted)]">Target</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Rising Pillars */}
          <div className="flex items-end gap-4 h-[280px]">
            {goals.slice(3).map((goal, i) => {
              const isActive = activeGoal === i + 3;
              return (
                <motion.div
                  key={i + 3}
                  className="relative flex flex-col items-center"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: phase >= 2 ? 1 : 0,
                    scale: isActive ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Always visible metric on top */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 10 }}
                    transition={{ delay: (i + 3) * 0.15 + 0.3 }}
                    className="mb-2 text-center"
                  >
                    <motion.p
                      className="text-2xl font-bold"
                      animate={{
                        color: isActive ? goal.color : 'rgba(255,255,255,0.7)',
                        textShadow: isActive ? `0 0 20px ${goal.color}` : 'none',
                      }}
                    >
                      {goal.metric}
                    </motion.p>
                    <p className="text-[10px] text-[var(--text-muted)]">{goal.unit}</p>
                  </motion.div>

                  {/* Pillar */}
                  <motion.div
                    className="w-14 rounded-t-lg relative overflow-hidden"
                    initial={{ height: 0 }}
                    animate={{
                      height: phase >= 2 ? goal.height * 2 : 0,
                      boxShadow: isActive ? `0 0 30px ${goal.color}60` : 'none',
                    }}
                    transition={{ delay: (i + 3) * 0.15, duration: 0.8, ease: 'easeOut' }}
                    style={{
                      backgroundColor: `${goal.color}20`,
                      borderTop: `2px solid ${isActive ? goal.color : goal.color + '50'}`,
                      borderLeft: `2px solid ${isActive ? goal.color : goal.color + '50'}`,
                      borderRight: `2px solid ${isActive ? goal.color : goal.color + '50'}`,
                      borderBottom: 'none',
                    }}
                  >
                    {/* Animated fill effect */}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0"
                      animate={{ height: isActive ? '100%' : '70%' }}
                      transition={{ duration: 0.5 }}
                      style={{ backgroundColor: `${goal.color}${isActive ? '60' : '30'}` }}
                    />
                  </motion.div>

                  {/* Icon and label */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: phase >= 2 ? 1 : 0 }}
                    transition={{ delay: (i + 3) * 0.15 + 0.5 }}
                    className="mt-2 text-center"
                  >
                    <motion.div
                      className="w-9 h-9 rounded-full flex items-center justify-center mb-1 mx-auto"
                      animate={{
                        backgroundColor: isActive ? `${goal.color}40` : `${goal.color}20`,
                        boxShadow: isActive ? `0 0 15px ${goal.color}` : 'none',
                      }}
                      style={{ border: `2px solid ${goal.color}` }}
                    >
                      <span className="text-base">{goal.icon}</span>
                    </motion.div>
                    <p className="text-[9px] text-[var(--text-secondary)] w-14 leading-tight">{goal.title}</p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom Value Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: phase >= 4 ? 1 : 0, y: phase >= 4 ? 0 : 20 }}
          className="mt-8 flex justify-center"
        >
          <div className="flex items-center gap-6 px-8 py-4 bg-gradient-to-r from-[var(--accent-cyan)]/10 via-[var(--accent-gold)]/10 to-[var(--accent-cyan)]/10 border border-[var(--accent-gold)]/30 rounded-2xl">
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--accent-gold)]">40%</p>
              <p className="text-xs text-[var(--text-muted)]">Cost Reduction</p>
            </div>
            <div className="w-px h-10 bg-[var(--accent-gold)]/30" />
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--accent-cyan)]">3x</p>
              <p className="text-xs text-[var(--text-muted)]">Faster Processing</p>
            </div>
            <div className="w-px h-10 bg-[var(--accent-gold)]/30" />
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">95%</p>
              <p className="text-xs text-[var(--text-muted)]">STP Target</p>
            </div>
            <div className="w-px h-10 bg-[var(--accent-gold)]/30" />
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-400">10x</p>
              <p className="text-xs text-[var(--text-muted)]">Scale Capacity</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ELC Reimagination Visualization - Business Vision meets Operations
function ELCReimagination() {
  const [phase, setPhase] = useState(0);
  const [flowParticles, setFlowParticles] = useState<number[]>([]);

  const businessVision = [
    { icon: '🌐', label: 'Real-Time Trade' },
    { icon: '🕐', label: '24-Hour Global Service' },
    { icon: '🔌', label: 'API-First Architecture' },
  ];

  const operationalReqs = [
    { icon: '🤖', label: 'AI Decision Engine' },
    { icon: '📜', label: 'Smart Contracts' },
    { icon: '🔄', label: 'STP Workflows' },
  ];

  const benefits = [
    { icon: '⚡', label: 'Speed', value: '10x faster' },
    { icon: '🎯', label: 'Accuracy', value: '>95%' },
    { icon: '💰', label: 'Cost', value: '40% reduction' },
    { icon: '📊', label: 'Visibility', value: 'Real-time' },
  ];

  useEffect(() => {
    setTimeout(() => setPhase(1), 500);
    setTimeout(() => setPhase(2), 1500);
    setTimeout(() => setPhase(3), 2500);
    setTimeout(() => setPhase(4), 3500);

    // Start particle flow
    const interval = setInterval(() => {
      setFlowParticles(prev => [...prev, Date.now()].slice(-10));
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-2">ELC Reimagination</h2>
          <p className="text-xl text-[var(--text-secondary)]">Where Business Vision Meets Operational Excellence</p>
        </motion.div>

        {/* Three Column Layout */}
        <div className="flex items-center justify-between gap-4">
          {/* Business Vision Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: phase >= 1 ? 1 : 0, x: phase >= 1 ? 0 : -50 }}
            className="flex-1"
          >
            <div className="bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/50 rounded-2xl p-6">
              <h3 className="text-center text-lg font-bold text-[var(--accent-cyan)] mb-4 flex items-center justify-center gap-2">
                <span>🎯</span> Business Vision
              </h3>
              <div className="space-y-3">
                {businessVision.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: phase >= 2 ? 1 : 0, x: phase >= 2 ? 0 : -20 }}
                    transition={{ delay: i * 0.15 }}
                    className="flex items-center gap-3 p-3 bg-[var(--bg-primary)]/50 rounded-lg"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-[var(--text-primary)] font-medium">{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Arrow Flow */}
          <div className="relative w-20 h-48 flex items-center justify-center">
            <svg className="absolute w-full h-full">
              <defs>
                <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--accent-cyan)" />
                  <stop offset="100%" stopColor="var(--accent-gold)" />
                </linearGradient>
              </defs>
              {/* Flow lines */}
              <motion.path
                d="M 0 60 Q 40 60 40 96 Q 40 132 80 132"
                stroke="url(#flowGradient)"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: phase >= 2 ? 1 : 0 }}
                transition={{ duration: 1 }}
              />
              <motion.path
                d="M 0 132 L 80 132"
                stroke="url(#flowGradient)"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: phase >= 2 ? 1 : 0 }}
                transition={{ duration: 1, delay: 0.2 }}
              />
              <motion.path
                d="M 0 204 Q 40 204 40 168 Q 40 132 80 132"
                stroke="url(#flowGradient)"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: phase >= 2 ? 1 : 0 }}
                transition={{ duration: 1, delay: 0.4 }}
              />
            </svg>

            {/* Flow particles */}
            {phase >= 3 && flowParticles.map((id, i) => (
              <motion.div
                key={id}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 90, opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.5 }}
                className="absolute w-2 h-2 rounded-full bg-[var(--accent-cyan)]"
                style={{ top: `${40 + (i % 3) * 32}%` }}
              />
            ))}

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: phase >= 2 ? 1 : 0 }}
              className="absolute bg-[var(--bg-secondary)] px-2 py-1 rounded-full border border-[var(--accent-gold)]"
            >
              <span className="text-[var(--accent-gold)] text-lg">+</span>
            </motion.div>
          </div>

          {/* Operational Requirements Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: phase >= 1 ? 1 : 0, x: phase >= 1 ? 0 : -50 }}
            transition={{ delay: 0.2 }}
            className="flex-1"
          >
            <div className="bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/50 rounded-2xl p-6">
              <h3 className="text-center text-lg font-bold text-[var(--accent-gold)] mb-4 flex items-center justify-center gap-2">
                <span>⚙️</span> Operations
              </h3>
              <div className="space-y-3">
                {operationalReqs.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: phase >= 2 ? 1 : 0, x: phase >= 2 ? 0 : 20 }}
                    transition={{ delay: i * 0.15 }}
                    className="flex items-center gap-3 p-3 bg-[var(--bg-primary)]/50 rounded-lg"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-[var(--text-primary)] font-medium">{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Arrow to Benefits */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 3 ? 1 : 0 }}
            className="text-4xl text-[var(--accent-cyan)]"
          >
            →
          </motion.div>

          {/* Key Benefits Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: phase >= 4 ? 1 : 0, x: phase >= 4 ? 0 : 50 }}
            className="flex-1"
          >
            <div className="bg-gradient-to-br from-[var(--accent-cyan)]/20 to-[var(--accent-gold)]/20 border-2 border-[var(--accent-cyan)] rounded-2xl p-6">
              <h3 className="text-center text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center justify-center gap-2">
                <span>✨</span> Key Benefits
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {benefits.map((benefit, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.15 }}
                    className="flex flex-col items-center p-3 bg-[var(--bg-primary)]/60 rounded-xl"
                  >
                    <span className="text-2xl mb-1">{benefit.icon}</span>
                    <span className="text-xs text-[var(--text-muted)]">{benefit.label}</span>
                    <span className="text-sm font-bold text-[var(--accent-cyan)]">{benefit.value}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Transformation Metrics Visualization - Animated KPI Dashboard
function TransformationMetrics() {
  const [phase, setPhase] = useState(0);
  const [counters, setCounters] = useState<Record<string, number>>({});

  const metrics = [
    { key: 'accuracy', icon: '🎯', label: 'Processing Accuracy', target: 95, suffix: '%', color: '#4ECDC4' },
    { key: 'reduction', icon: '⏱️', label: 'Time Reduction', target: 40, suffix: '%', color: '#C9A227' },
    { key: 'connectivity', icon: '🔌', label: 'API Connectivity', target: 100, suffix: '%', color: '#00D4FF' },
    { key: 'stp', icon: '🔄', label: 'STP Rate', target: 95, suffix: '%', color: '#9B59B6' },
    { key: 'uptime', icon: '⚡', label: 'System Uptime', target: 99.9, suffix: '%', color: '#2ECC71' },
    { key: 'cost', icon: '💰', label: 'Cost Efficiency', target: 40, suffix: '%', color: '#E74C3C' },
  ];

  useEffect(() => {
    setTimeout(() => setPhase(1), 500);
    setTimeout(() => setPhase(2), 1200);
    setTimeout(() => setPhase(3), 2000);

    // Animate counters
    metrics.forEach((metric, i) => {
      const startTime = 2000 + i * 200;
      const duration = 1500;
      const steps = 30;
      const increment = metric.target / steps;

      for (let step = 0; step <= steps; step++) {
        setTimeout(() => {
          setCounters(prev => ({
            ...prev,
            [metric.key]: Math.min(step * increment, metric.target),
          }));
        }, startTime + (step * duration) / steps);
      }
    });
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-2">Transformation Metrics</h2>
          <p className="text-xl text-[var(--text-secondary)]">Measurable Impact, Real Results</p>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-6">
          {metrics.map((metric, i) => {
            const value = counters[metric.key] || 0;
            const percentage = (value / metric.target) * 100;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 30 }}
                transition={{ delay: i * 0.1 }}
                className="relative bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--accent-cyan)]/20 overflow-hidden"
              >
                {/* Background glow */}
                <motion.div
                  animate={{
                    opacity: [0.1, 0.2, 0.1],
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at center, ${metric.color}30 0%, transparent 70%)`
                  }}
                />

                <div className="relative z-10">
                  {/* Icon and Label */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{metric.icon}</span>
                    <span className="text-sm font-medium text-[var(--text-secondary)]">{metric.label}</span>
                  </div>

                  {/* Value */}
                  <div className="text-center mb-4">
                    <motion.span
                      className="text-5xl font-bold"
                      style={{ color: metric.color }}
                    >
                      {metric.key === 'uptime' ? value.toFixed(1) : Math.round(value)}
                    </motion.span>
                    <span className="text-2xl text-[var(--text-muted)]">{metric.suffix}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: metric.color }}
                    />
                  </div>

                  {/* Target indicator */}
                  <p className="text-xs text-[var(--text-muted)] text-center mt-2">
                    Target: {metric.key === 'uptime' ? metric.target.toFixed(1) : metric.target}{metric.suffix}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: phase >= 3 ? 1 : 0, y: phase >= 3 ? 0 : 30 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-[var(--accent-cyan)]/20 to-[var(--accent-gold)]/20 border border-[var(--accent-cyan)]/50 rounded-2xl">
            <span className="text-3xl">🚀</span>
            <div className="text-left">
              <p className="text-lg font-bold text-[var(--text-primary)]">From 39% to 79%+ Efficiency</p>
              <p className="text-sm text-[var(--text-muted)]">Doubling operational capability with modern architecture</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Module Duplication Problem & Consolidation Visualization
function ModuleConsolidation() {
  // Get capture context for export/navigation
  const { forcePhase, isCapturing } = React.useContext(CaptureContext);

  const [highlightedModule, setHighlightedModule] = useState(-1);

  // Always use forcePhase when provided (for both capturing and navigation)
  // This allows the store to control the phase via left/right/space keys
  const phase = forcePhase !== undefined ? forcePhase : 0;

  // Backend platforms with duplicated modules
  const backendPlatforms = [
    { id: 'tps', name: 'Platform A', fullName: 'Trade System', icon: '🏦', color: '#00D4FF', unique: ['Trade Execution', 'LC Processing'] },
    { id: 'apar', name: 'Platform B', fullName: 'Accounts Platform', icon: '💳', color: '#C9A227', unique: ['Invoice Matching', 'Payment Processing'] },
  ];

  // Duplicated modules across backend systems
  const duplicatedModules = [
    { name: 'Billing', icon: '🧾', color: '#00D4FF' },
    { name: 'Participation', icon: '🤝', color: '#C9A227' },
    { name: 'CIF', icon: '👥', color: '#10B981' },
    { name: 'Pricing', icon: '💰', color: '#8B5CF6' },
  ];

  // Animation phases (controlled by navigation):
  // 0: Initial - Platform A & Platform B appear
  // 1: Highlight duplication in Platform A & Platform B
  // 2: Frontend appears on top with connections
  // 3: Shared modules appear, modules consolidate
  // 4: Platforms shrink, metrics appear

  // Cycle through highlighted modules during phase 1 (skip when capturing)
  useEffect(() => {
    if (isCapturing) {
      // When capturing phase 1, show all highlighted
      if (phase === 1) {
        setHighlightedModule(0);
      }
      return;
    }

    if (phase === 1) {
      const timer = setInterval(() => {
        setHighlightedModule(prev => (prev + 1) % duplicatedModules.length);
      }, 500);
      return () => clearInterval(timer);
    } else {
      setHighlightedModule(-1);
    }
  }, [phase, duplicatedModules.length, isCapturing]);

  const showFrontend = phase >= 2;
  const showShared = phase >= 3;
  const isConsolidated = phase >= 4;
  const isExtracting = phase === 3; // Modules are moving

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
          {phase < 2 ? 'The Duplication Problem' : phase < 4 ? 'Introducing Unified Frontend & Shared Modules' : 'Consolidation Complete'}
        </h2>
        <p className="text-[var(--text-secondary)]">
          {phase < 2
            ? 'Same modules duplicated across Platform A & Platform B systems'
            : phase < 4
            ? 'Frontend connects to both platforms → Shared modules eliminate redundancy'
            : 'Single codebase • Reduced maintenance • Direct integration'}
        </p>
      </motion.div>

      {/* Main content - visualization + business metrics */}
      <div className="flex-1 flex items-start justify-center gap-6 w-full max-w-7xl px-4">

        {/* Left/Center: Main visualization */}
        <div className="flex-1 flex flex-col items-center justify-center relative">

          {/* Unified Frontend - Appears in Phase 2 */}
        <AnimatePresence>
          {showFrontend && (
            <motion.div
              initial={{ opacity: 0, y: -60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="mb-2"
            >
              <div className="w-[480px] bg-gradient-to-br from-emerald-900/50 to-emerald-800/30 rounded-xl p-4 border-2 border-emerald-500/60 shadow-lg shadow-emerald-500/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🔄</span>
                    <div>
                      <h3 className="text-lg font-bold text-emerald-400">Unified Frontend</h3>
                      <p className="text-xs text-emerald-300/70">Unified Entry Point</p>
                    </div>
                  </div>
                  <span className="text-xs px-3 py-1 bg-emerald-500/20 rounded-full text-emerald-300 border border-emerald-500/30">
                    Unified Entry Point
                  </span>
                </div>

                <div className="flex justify-center gap-3">
                  {['Channel Routing', 'Format Conversion', 'API Gateway'].map(feat => (
                    <div key={feat} className="px-3 py-1.5 rounded-lg text-xs bg-emerald-500/15 border border-emerald-500/30 text-emerald-200">
                      {feat}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Connection lines from Unified Frontend to platforms */}
        {showFrontend && (
          <div className="relative w-[480px] h-12 mb-2">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 48" fill="none">
              {/* Line to Platform A (left) */}
              <motion.path
                d="M 160 0 L 160 24 Q 160 36 148 36 L 100 36 L 100 48"
                stroke="url(#tcfe-tps-gradient)"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              />
              {/* Line to Platform B (right) */}
              <motion.path
                d="M 320 0 L 320 24 Q 320 36 332 36 L 380 36 L 380 48"
                stroke="url(#tcfe-apar-gradient)"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              />
              {/* Line to Shared (center) - appears in phase 3 */}
              {showShared && (
                <motion.path
                  d="M 240 0 L 240 48"
                  stroke="url(#tcfe-shared-gradient)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="4 4"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
              )}
              {/* Gradients */}
              <defs>
                <linearGradient id="tcfe-tps-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#00D4FF" />
                </linearGradient>
                <linearGradient id="tcfe-apar-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#C9A227" />
                </linearGradient>
                <linearGradient id="tcfe-shared-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#22C55E" />
                </linearGradient>
              </defs>
            </svg>
            {/* Labels */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute left-[60px] bottom-0 text-[10px] text-[var(--accent-cyan)] font-medium"
            >
              Platform A
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="absolute right-[60px] bottom-0 text-[10px] text-[var(--accent-gold)] font-medium"
            >
              Platform B
            </motion.div>
            {showShared && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute left-1/2 -translate-x-1/2 bottom-0 text-[10px] text-green-400 font-medium"
              >
                Shared ✓
              </motion.div>
            )}
          </div>
        )}

        {/* Platform A & Platform B Platforms */}
        <motion.div
          layout
          className="flex items-start justify-center gap-16 mb-4 relative"
        >
          {backendPlatforms.map((platform, pIndex) => (
            <motion.div
              key={platform.id}
              layout
              initial={{ opacity: 0, y: 40 }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
                delay: pIndex * 0.2,
                ease: 'easeOut',
                layout: { duration: 0.6, ease: 'easeInOut' }
              }}
              className="flex flex-col items-center"
            >
              {/* Platform Box - modules removed after extraction */}
              <motion.div
                layout
                transition={{ layout: { duration: 0.6, ease: 'easeInOut' } }}
                className="w-56 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] rounded-xl p-4 border-2"
                style={{
                  borderColor: phase === 1 ? `${platform.color}` : showShared ? 'rgba(34, 197, 94, 0.5)' : `${platform.color}50`,
                  boxShadow: phase === 1 ? `0 0 20px ${platform.color}40` : showShared ? '0 0 15px rgba(34, 197, 94, 0.3)' : 'none',
                  transition: 'border-color 0.5s ease, box-shadow 0.5s ease',
                }}
              >
                {/* Platform Header */}
                <div className="text-center mb-3 pb-2 border-b" style={{ borderColor: `${platform.color}30` }}>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl">{platform.icon}</span>
                    <h3 className="text-lg font-bold" style={{ color: platform.color }}>{platform.name}</h3>
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">{platform.fullName}</p>
                </div>

                {/* Duplicated Modules - animate out during extraction */}
                <AnimatePresence mode="wait">
                  {!showShared ? (
                    <motion.div
                      key="modules"
                      initial={{ opacity: 1, height: 'auto' }}
                      exit={{
                        opacity: 0,
                        height: 0,
                        transition: { duration: 0.6, ease: 'easeInOut' }
                      }}
                      className="space-y-1.5 mb-3 overflow-hidden"
                    >
                      <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide">
                        Duplicated Modules:
                      </p>
                      {duplicatedModules.map((module, i) => {
                        const isHighlighted = highlightedModule === i && phase === 1;
                        return (
                          <motion.div
                            key={`${platform.id}-${module.name}`}
                            animate={{
                              scale: isHighlighted ? 1.05 : 1,
                              x: isExtracting ? (pIndex === 0 ? 50 : -50) : 0,
                              opacity: isExtracting ? 0 : 1,
                            }}
                            transition={{ duration: 0.5, delay: isExtracting ? i * 0.1 : 0 }}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-200"
                            style={{
                              backgroundColor: isHighlighted ? `${module.color}40` : `${module.color}15`,
                              border: `1px solid ${isHighlighted ? module.color : 'transparent'}`,
                              boxShadow: isHighlighted ? `0 0 12px ${module.color}50` : 'none',
                            }}
                          >
                            <span>{module.icon}</span>
                            <span className="text-[var(--text-primary)]">{module.name}</span>
                            {isHighlighted && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-red-500/30 text-red-300 font-bold"
                              >
                                DUPLICATE!
                              </motion.span>
                            )}
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="using-shared"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{
                        opacity: 1,
                        height: 'auto',
                        transition: { duration: 0.5, delay: 0.3 }
                      }}
                      className="mb-3 p-2 rounded-lg bg-green-500/10 border border-green-500/30 overflow-hidden"
                    >
                      <p className="text-[10px] text-green-400 font-medium text-center">
                        ✓ Using Shared Modules
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Unique Features - always visible */}
                <motion.div
                  layout
                  className={showShared ? '' : 'pt-2 border-t border-white/10'}
                >
                  <p className="text-[10px] text-[var(--text-muted)] mb-1">Core Functions:</p>
                  {platform.unique.map(feat => (
                    <div key={feat} className="text-xs text-[var(--text-secondary)] px-2 py-1 bg-white/5 rounded mb-1">
                      {feat}
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Metrics under each platform - appears after consolidation */}
              <AnimatePresence>
                {isConsolidated && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 + pIndex * 0.15, ease: 'easeOut' }}
                    className="mt-3 flex flex-col items-center gap-2"
                  >
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.4 + pIndex * 0.15 }}
                      className="px-4 py-2 bg-green-500/15 rounded-xl border border-green-500/40 text-center"
                    >
                      <p className="text-2xl font-bold text-green-400">-50%</p>
                      <p className="text-[10px] text-green-300">Codebase Size</p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.7 + pIndex * 0.15 }}
                      className="flex gap-2"
                    >
                      <div className="px-2 py-1 bg-[var(--bg-secondary)] rounded-lg border border-white/10 text-center">
                        <p className="text-sm font-bold text-[var(--accent-cyan)]">{pIndex === 0 ? '60%' : '55%'}</p>
                        <p className="text-[8px] text-[var(--text-muted)]">Less Testing</p>
                      </div>
                      <div className="px-2 py-1 bg-[var(--bg-secondary)] rounded-lg border border-white/10 text-center">
                        <p className="text-sm font-bold text-[var(--accent-gold)]">{pIndex === 0 ? '45%' : '50%'}</p>
                        <p className="text-[8px] text-[var(--text-muted)]">Maintenance</p>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}

          {/* Flying modules animation - modules moving from platforms to shared */}
          {isExtracting && (
            <>
              {duplicatedModules.map((module, i) => (
                <React.Fragment key={`flying-${module.name}`}>
                  {/* From Platform A (left) */}
                  <motion.div
                    initial={{ opacity: 1, x: -140, y: 60 + i * 32 }}
                    animate={{ opacity: 0, x: 0, y: 180 }}
                    transition={{ duration: 0.8, delay: i * 0.15, ease: 'easeInOut' }}
                    className="absolute left-1/2 top-0 pointer-events-none z-20"
                  >
                    <div
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs"
                      style={{
                        backgroundColor: `${module.color}40`,
                        border: `1px solid ${module.color}`,
                        boxShadow: `0 0 15px ${module.color}60`,
                      }}
                    >
                      <span>{module.icon}</span>
                      <span className="text-white font-medium">{module.name}</span>
                    </div>
                  </motion.div>
                  {/* From Platform B (right) */}
                  <motion.div
                    initial={{ opacity: 1, x: 140, y: 60 + i * 32 }}
                    animate={{ opacity: 0, x: 0, y: 180 }}
                    transition={{ duration: 0.8, delay: i * 0.15 + 0.1, ease: 'easeInOut' }}
                    className="absolute left-1/2 top-0 pointer-events-none z-20"
                  >
                    <div
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs"
                      style={{
                        backgroundColor: `${module.color}40`,
                        border: `1px solid ${module.color}`,
                        boxShadow: `0 0 15px ${module.color}60`,
                      }}
                    >
                      <span>{module.icon}</span>
                      <span className="text-white font-medium">{module.name}</span>
                    </div>
                  </motion.div>
                </React.Fragment>
              ))}
            </>
          )}
        </motion.div>

        {/* Shared Modules - Appears in Phase 3 */}
        <AnimatePresence>
          {showShared && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="mb-4"
            >
              <div className="w-[520px] p-4 rounded-xl bg-gradient-to-br from-[var(--accent-gold)]/25 to-[var(--accent-cyan)]/25 border-2 border-[var(--accent-gold)]/60 shadow-lg">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-center mb-3"
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl">🔧</span>
                    <h3 className="text-base font-bold text-[var(--accent-gold)]">SHARED MODULAR COMPONENTS</h3>
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">Single Source of Truth • Used by Platform A, Platform B & Frontend</p>
                </motion.div>

                <div className="grid grid-cols-4 gap-3">
                  {duplicatedModules.map((module, i) => (
                    <motion.div
                      key={`shared-${module.name}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.2, duration: 0.5, ease: 'easeOut' }}
                      className="flex flex-col items-center gap-1 p-3 rounded-xl text-center"
                      style={{
                        backgroundColor: `${module.color}25`,
                        border: `2px solid ${module.color}`,
                      }}
                    >
                      <span className="text-xl">{module.icon}</span>
                      <span className="text-sm font-medium" style={{ color: module.color }}>
                        {module.name}
                      </span>
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.2 + i * 0.15, duration: 0.3 }}
                        className="text-green-400 text-lg"
                      >
                        ✓
                      </motion.span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Summary badge - Appears in Phase 4 */}
        <AnimatePresence>
          {isConsolidated && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8, ease: 'easeOut' }}
              className="mt-2"
            >
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-green-500/10 border border-green-500/30">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.2, duration: 0.3 }}
                  className="text-xl"
                >
                  ✅
                </motion.span>
                <span className="text-sm font-medium text-green-400">
                  Consolidation Complete • Single Codebase • Direct Frontend Integration
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>

        {/* Right: Business Impact Panel - appears after consolidation */}
        <AnimatePresence>
          {isConsolidated && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="w-72 flex-shrink-0"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="p-5 rounded-xl bg-gradient-to-br from-green-900/30 to-emerald-900/20 border border-green-500/30"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🚀</span>
                  <h3 className="text-lg font-bold text-green-400">Business Benefits</h3>
                </div>

                <div className="space-y-3">
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20"
                  >
                    <span className="text-lg">👨‍💻</span>
                    <div>
                      <p className="text-sm font-medium text-green-300">Free Dev Resources</p>
                      <p className="text-xs text-[var(--text-muted)]">Focus on new features</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
                  >
                    <span className="text-lg">⚡</span>
                    <div>
                      <p className="text-sm font-medium text-emerald-300">3x Faster Releases</p>
                      <p className="text-xs text-[var(--text-muted)]">Single codebase updates</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-teal-500/10 border border-teal-500/20"
                  >
                    <span className="text-lg">💰</span>
                    <div>
                      <p className="text-sm font-medium text-teal-300">50% Less Infra Cost</p>
                      <p className="text-xs text-[var(--text-muted)]">Shared infrastructure</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.3 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20"
                  >
                    <span className="text-lg">🎯</span>
                    <div>
                      <p className="text-sm font-medium text-cyan-300">Better Quality</p>
                      <p className="text-xs text-[var(--text-muted)]">One test suite, one standard</p>
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="mt-4 pt-3 border-t border-green-500/20 text-center"
                >
                  <p className="text-xs text-green-300/80">Unlock innovation capacity</p>
                  <p className="text-lg font-bold text-green-400">Build What Matters</p>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Trade Architecture Visualization - Modern modular system
function TradeArchitecture() {
  const [phase, setPhase] = useState(0);
  const [activeModule, setActiveModule] = useState(-1);

  // Trade Connectivity - Entities
  const connectivityEntities = [
    { icon: '👤', label: 'Client', color: '#00D4FF' },
    { icon: '🏭', label: 'Buyer/Supplier', color: '#C9A227' },
    { icon: '🤝', label: 'Counter Party', color: '#10B981' },
    { icon: '📱', label: 'Digitization', color: '#8B5CF6' },
  ];

  // Integration Channels
  const integrationChannels = [
    { label: 'SWIFT', color: '#00D4FF' },
    { label: 'Web', color: '#C9A227' },
    { label: 'API', color: '#10B981' },
    { label: 'Branch', color: '#F59E0B' },
    { label: 'H2H', color: '#8B5CF6' },
  ];

  // Core Platform Sub-Domains
  const coreSubDomains = [
    {
      name: 'Trade Execution',
      color: '#00D4FF',
      items: ['Workflow & Controls', 'Doc Presentation', 'Contingent Instruments', 'Invoice & Offer Mgmt']
    },
    {
      name: 'Trade Risk',
      color: '#E74C3C',
      items: ['Trade Compliance', 'Trade AML', 'Execution Risk']
    },
  ];

  // Data & Reporting
  const dataLayers = [
    { icon: '👤', label: 'Client', color: '#00D4FF' },
    { icon: '📋', label: 'Regulatory', color: '#F59E0B' },
    { icon: '⚡', label: 'Operational', color: '#10B981' },
    { icon: '📊', label: 'MIS', color: '#8B5CF6' },
  ];

  // Modular Reusable Components - Key highlight
  const modularComponents = [
    { icon: '👥', label: 'CIF', desc: 'Customer Information', color: '#00D4FF' },
    { icon: '🤝', label: 'Participation', desc: 'Syndication & Distribution', color: '#C9A227' },
    { icon: '💰', label: 'Pricing', desc: 'Dynamic Rate Engine', color: '#10B981' },
    { icon: '🧾', label: 'Billing', desc: 'Revenue Management', color: '#8B5CF6' },
  ];

  // Shared Services
  const sharedServices = [
    { label: 'Document Management', color: '#00D4FF' },
    { label: 'CIF', color: '#C9A227' },
    { label: 'Payments', color: '#10B981' },
    { label: 'Accounting (Ledger)', color: '#8B5CF6' },
  ];

  // Applications utilizing shared services
  const applications = [
    { label: 'Platform B/SCF', desc: 'Payables & Receivables' },
    { label: 'Platform A', desc: 'Trade Processing' },
    { label: 'Unified Frontend', desc: 'Data Conversion' },
    { label: 'SOP', desc: 'Supplier Onboarding' },
    { label: 'DD', desc: 'Dynamic Discounting' },
  ];

  useEffect(() => {
    setTimeout(() => setPhase(1), 500);
    setTimeout(() => setPhase(2), 1200);
    setTimeout(() => setPhase(3), 2000);
    setTimeout(() => setPhase(4), 2800);
  }, []);

  useEffect(() => {
    if (phase >= 4) {
      const timer = setTimeout(() => {
        setActiveModule(prev => (prev + 1) % modularComponents.length);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [phase, activeModule]);

  return (
    <div className="w-full h-full flex flex-col p-6">
      <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col">
        {/* Header - raised higher */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Revised Trade & Working Capital Domain</h2>
          <p className="text-lg text-[var(--text-secondary)]">Modular Architecture • Reusable Components • Future Vision</p>
        </motion.div>

        {/* Main Architecture Layout */}
        <div className="flex items-stretch gap-5 mb-8 flex-1">
          {/* Left - OMNI Enabler + Trade Connectivity Domain */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: phase >= 1 ? 1 : 0, x: phase >= 1 ? 0 : -50 }}
            className="flex gap-3"
          >
            {/* OMNI Enabler Layer - Vertical channels */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 2 ? 1 : 0 }}
              className="w-20 bg-gradient-to-b from-[var(--accent-gold)]/20 to-[var(--accent-gold)]/5 rounded-xl p-3 border border-[var(--accent-gold)]/40 flex flex-col items-center"
            >
              <span className="text-[10px] font-bold text-[var(--accent-gold)] tracking-wider mb-3" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>OMNI</span>

              <div className="flex-1 flex flex-col justify-center gap-2">
                {integrationChannels.map((channel, i) => (
                  <motion.div
                    key={channel.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: phase >= 3 ? 1 : 0, x: phase >= 3 ? 0 : -10 }}
                    transition={{ delay: i * 0.05 }}
                    className="px-2 py-1 rounded text-[9px] font-medium text-center"
                    style={{ backgroundColor: `${channel.color}30`, color: channel.color }}
                  >
                    {channel.label}
                  </motion.div>
                ))}
              </div>

              {/* Arrow indicating flow */}
              <motion.div
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-[var(--accent-gold)] text-lg mt-3"
              >
                →
              </motion.div>
            </motion.div>

            {/* Trade Connectivity Domain */}
            <div className="w-48 bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--accent-cyan)]/30">
              <div className="text-center mb-3">
                <span className="text-xs font-bold text-[var(--accent-cyan)] tracking-wider">TRADE CONNECTIVITY</span>
                <p className="text-[9px] text-[var(--text-muted)]">Domain</p>
              </div>

              <div className="space-y-2">
                {connectivityEntities.map((entity, i) => (
                  <motion.div
                    key={entity.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: phase >= 2 ? 1 : 0, x: phase >= 2 ? 0 : -20 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-2 p-2 rounded-lg"
                    style={{ backgroundColor: `${entity.color}15`, borderLeft: `3px solid ${entity.color}` }}
                  >
                    <span className="text-base">{entity.icon}</span>
                    <span className="text-[10px] font-medium text-[var(--text-primary)]">{entity.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Center - Core Platform */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: phase >= 2 ? 1 : 0, scale: phase >= 2 ? 1 : 0.9 }}
            className="flex-1 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] rounded-xl p-4 border border-[var(--accent-gold)]/40 relative overflow-hidden"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <svg className="w-full h-full">
                <defs>
                  <pattern id="coreGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <circle cx="15" cy="15" r="1" fill="var(--accent-gold)" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#coreGrid)" />
              </svg>
            </div>

            <div className="relative z-10 h-full flex flex-col">
              {/* Central hub indicator at top */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: phase >= 2 ? 1 : 0 }}
                className="flex justify-center mb-3"
              >
                <motion.div
                  animate={{
                    boxShadow: ['0 0 15px rgba(201,162,39,0.3)', '0 0 25px rgba(201,162,39,0.5)', '0 0 15px rgba(201,162,39,0.3)']
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="px-5 py-2 rounded-full bg-[var(--accent-gold)]/20 border border-[var(--accent-gold)]/50"
                >
                  <span className="text-xs font-bold text-[var(--accent-gold)]">CORE PLATFORM</span>
                </motion.div>
              </motion.div>

              {/* Sub-domains row */}
              <div className="flex gap-3 mb-3">
                {coreSubDomains.map((domain, i) => (
                  <motion.div
                    key={domain.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: phase >= 3 ? 1 : 0, y: phase >= 3 ? 0 : 20 }}
                    transition={{ delay: i * 0.15 }}
                    className="flex-1 p-3 rounded-lg bg-[var(--bg-primary)]/60 border"
                    style={{ borderColor: `${domain.color}40` }}
                  >
                    {/* Domain header */}
                    <div className="flex items-center gap-2 mb-2 pb-2" style={{ borderBottom: `1px solid ${domain.color}30` }}>
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: domain.color }} />
                      <span className="text-[10px] font-bold" style={{ color: domain.color }}>{domain.name}</span>
                    </div>

                    {/* Domain items */}
                    <div className="space-y-1">
                      {domain.items.map((item, j) => (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: phase >= 3 ? 1 : 0, x: phase >= 3 ? 0 : -10 }}
                          transition={{ delay: i * 0.15 + j * 0.05 }}
                          className="px-2 py-1 rounded text-[9px] text-[var(--text-secondary)] bg-white/5"
                        >
                          {item}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Shared Services - inside Core */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: phase >= 3 ? 1 : 0, y: phase >= 3 ? 0 : 15 }}
                transition={{ delay: 0.3 }}
                className="p-3 rounded-lg bg-[var(--bg-primary)]/40 border border-[var(--accent-gold)]/20"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-sm">⚙️</span>
                  <span className="text-[9px] font-bold text-[var(--accent-gold)] tracking-wider">SHARED SERVICES</span>
                </div>
                <div className="flex gap-2 justify-center flex-wrap">
                  {sharedServices.map((service, i) => (
                    <motion.div
                      key={service.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: phase >= 3 ? 1 : 0, scale: phase >= 3 ? 1 : 0.9 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      className="px-3 py-1.5 rounded text-[9px] font-medium"
                      style={{ backgroundColor: `${service.color}15`, color: service.color, border: `1px solid ${service.color}30` }}
                    >
                      {service.label}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right - Data & Reporting Domain + Output Enabler */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: phase >= 1 ? 1 : 0, x: phase >= 1 ? 0 : 50 }}
            className="flex gap-3"
          >
            {/* Data & Reporting Domain */}
            <div className="w-48 bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--accent-cyan)]/30">
              <div className="text-center mb-3">
                <span className="text-xs font-bold text-[var(--accent-cyan)] tracking-wider">DATA & REPORTING</span>
                <p className="text-[9px] text-[var(--text-muted)]">Domain</p>
              </div>

              <div className="space-y-2">
                {dataLayers.map((layer, i) => (
                  <motion.div
                    key={layer.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: phase >= 2 ? 1 : 0, x: phase >= 2 ? 0 : 20 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-2 p-2 rounded-lg"
                    style={{ backgroundColor: `${layer.color}15`, borderRight: `3px solid ${layer.color}` }}
                  >
                    <span className="text-base">{layer.icon}</span>
                    <span className="text-[10px] font-medium text-[var(--text-primary)]">{layer.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Output Enabler Layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 2 ? 1 : 0 }}
              className="w-20 bg-gradient-to-b from-[var(--accent-cyan)]/20 to-[var(--accent-cyan)]/5 rounded-xl p-3 border border-[var(--accent-cyan)]/40 flex flex-col items-center"
            >
              {/* Arrow indicating flow */}
              <motion.div
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-[var(--accent-cyan)] text-lg mb-3"
              >
                →
              </motion.div>

              <div className="flex-1 flex flex-col justify-center gap-2">
                {['Dashboard', 'Reports', 'API', 'Alerts', 'BI'].map((output, i) => (
                  <motion.div
                    key={output}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: phase >= 3 ? 1 : 0, x: phase >= 3 ? 0 : 10 }}
                    transition={{ delay: i * 0.05 }}
                    className="px-2 py-1 rounded text-[9px] font-medium text-center bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)]"
                  >
                    {output}
                  </motion.div>
                ))}
              </div>

              <span className="text-[10px] font-bold text-[var(--accent-cyan)] tracking-wider mt-3" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>OUTPUT</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Section - Modular Components & Applications (horizontal) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: phase >= 4 ? 1 : 0, y: phase >= 4 ? 0 : 30 }}
          className="flex gap-6 justify-center"
        >
          {/* Modular Components */}
          <div className="flex-1">
            <div className="text-center mb-3">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/30">
                <span className="text-sm">🔧</span>
                <span className="text-[10px] font-bold text-[var(--accent-cyan)] tracking-wider">MODULAR COMPONENTS</span>
              </span>
            </div>

            <div className="bg-[var(--bg-secondary)] rounded-lg p-3 border border-[var(--accent-cyan)]/30">
              <div className="flex gap-3 justify-center">
                {modularComponents.map((module, i) => {
                  const isActive = activeModule === i;
                  return (
                    <motion.div
                      key={module.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{
                        opacity: 1,
                        scale: isActive ? 1.05 : 1,
                      }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <motion.div
                        animate={{
                          boxShadow: isActive ? `0 0 15px ${module.color}50` : 'none',
                        }}
                        className="w-28 p-2.5 rounded-lg bg-[var(--bg-primary)]/60 text-center transition-all"
                        style={{
                          borderTop: `2px solid ${module.color}`,
                          borderLeft: `1px solid ${isActive ? module.color : 'transparent'}`,
                          borderRight: `1px solid ${isActive ? module.color : 'transparent'}`,
                          borderBottom: `1px solid ${isActive ? module.color : 'transparent'}`,
                        }}
                      >
                        <span className="text-lg">{module.icon}</span>
                        <p className="text-[10px] font-bold mt-0.5" style={{ color: isActive ? module.color : 'var(--text-primary)' }}>
                          {module.label}
                        </p>
                        <p className="text-[8px] text-[var(--text-muted)]">{module.desc}</p>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Applications */}
          <div className="flex-1">
            <div className="text-center mb-3">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30">
                <span className="text-sm">📦</span>
                <span className="text-[10px] font-bold text-purple-400 tracking-wider">APPLICATIONS</span>
              </span>
            </div>

            <div className="bg-[var(--bg-secondary)] rounded-lg p-3 border border-purple-500/30">
              <div className="flex gap-3 justify-center">
                {applications.map((app, i) => (
                  <motion.div
                    key={app.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: phase >= 4 ? 1 : 0, scale: phase >= 4 ? 1 : 0.8 }}
                    transition={{ delay: i * 0.05 }}
                    className="px-3 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-center min-w-[90px]"
                  >
                    <p className="text-[10px] font-bold text-purple-400">{app.label}</p>
                    <p className="text-[8px] text-[var(--text-muted)]">{app.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function InteractiveSlide({ content, slideId, forcePhase, isCapturing = false, onPhaseChange }: InteractiveSlideProps) {
  const visualizationType = content.visualization;
  // Use slideId to force re-render when navigating between slides
  const uniqueKey = `${visualizationType}-${slideId || 'default'}`;

  const renderVisualization = () => {
    switch (visualizationType) {
      case 'message-inbox':
        return <MessageInbox key={uniqueKey} />;
      case 'template-comparison':
        return <TemplateComparison key={uniqueKey} />;
      case 'legacy-problems':
        return <LegacyProblems key={uniqueKey} />;
      case 'transformation-goals':
        return <TransformationGoals key={uniqueKey} />;
      case 'elc-reimagination':
        return <ELCReimagination key={uniqueKey} />;
      case 'transformation-metrics':
        return <TransformationMetrics key={uniqueKey} />;
      case 'trade-architecture':
        return <TradeArchitecture key={uniqueKey} />;
      case 'module-consolidation':
        return <ModuleConsolidation key={uniqueKey} />;
      case 'technical-challenges':
        return <TechnicalChallenges key={uniqueKey} />;
      case 'product-opportunities':
        return <ProductOpportunities key={uniqueKey} />;
      case 'memory-train':
        return <MemoryTrain key={uniqueKey} />;
      case 'score-calculation':
        return <ScoreCalculation key={uniqueKey} />;
      case 'level-weights':
        return <LevelWeights key={uniqueKey} />;
      case 'promotion-pipeline':
        return <PromotionPipeline key={uniqueKey} />;
      case 'feature-showcase':
        return <FeatureShowcase key={uniqueKey} />;
      case 'problem-visual':
        return <ProblemVisual key={uniqueKey} />;
      case 'solution-visual':
        return <SolutionVisual key={uniqueKey} />;
      case 'ai-capabilities':
        return <AICapabilities key={uniqueKey} />;
      case 'hidden-workflow':
        return <HiddenWorkflow key={uniqueKey} />;
      case 'patterns-emerge':
        return <PatternsEmerge key={uniqueKey} />;
      case 'message-types':
        return <MessageTypes key={uniqueKey} />;
      case 'branch-intelligence':
        return <BranchIntelligence key={uniqueKey} />;
      case 'team-benchmarking':
        return <TeamBenchmarking key={uniqueKey} />;
      default:
        return (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-[var(--text-muted)]">Unknown visualization type: {visualizationType}</p>
          </div>
        );
    }
  };

  return (
    <CaptureContext.Provider value={{ forcePhase, isCapturing, onPhaseChange }}>
      {renderVisualization()}
    </CaptureContext.Provider>
  );
}
