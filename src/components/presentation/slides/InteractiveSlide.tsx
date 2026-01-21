'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { SlideContent } from '@/types/demo';
import { ELCArchitecture } from './ELCArchitectureVisualization';
import { ELCIntegrationPatterns } from './ELCIntegrationPatterns';
import { ELCRoadmap } from './ELCRoadmap';
import { ELCDeliverablesHeatmap } from './ELCDeliverablesHeatmap';

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
    { id: 'shipTerms', label: 'Shipping Terms', value: 'FOB Destination, Partial Shipment Allowed' },
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

// Engineering Score Journey - Shows metrics, types, levels, and fairness considerations
function EngineeringScoreJourney() {
  const { forcePhase } = React.useContext(CaptureContext);

  // Use forcePhase from store (navigation handled by PresentationContainer)
  const phase = forcePhase !== undefined ? forcePhase : 0;

  // Selected level for highlighting in Phase 3
  const [selectedLevel, setSelectedLevel] = useState<number>(0);
  const levels = ['Junior', 'Mid', 'Senior', 'Lead'];

  // The 5 metric groups with their granular metrics
  const metricGroups = [
    {
      name: 'Delivery',
      icon: '🚀',
      color: '#4ECDC4',
      metrics: [
        { name: 'Story Points', type: 'Q' },
        { name: 'Churn', type: 'Q' },
        { name: 'Say/Do Ratio', type: 'Q' },
        { name: 'Change Failure Rate', type: 'Q' },
        { name: 'Time to Prod', type: 'Q' },
        { name: 'Wall-building', type: 'O' },
      ],
    },
    {
      name: 'Reliability',
      icon: '🛡️',
      color: '#6495ED',
      metrics: [
        { name: 'Defect Closure Rate', type: 'Q' },
        { name: 'Commitment Index', type: 'Q' },
        { name: 'Timely Escalation', type: 'O' },
        { name: 'Incidents Resolved', type: 'Q' },
      ],
    },
    {
      name: 'Quality',
      icon: '✨',
      color: '#C9A227',
      metrics: [
        { name: 'Defect Rate', type: 'Q' },
        { name: 'Defect Leakage', type: 'Q' },
        { name: 'Code Grade', type: 'O' },
        { name: 'Test Coverage', type: 'Q' },
      ],
    },
    {
      name: 'Collaboration',
      icon: '🤝',
      color: '#A855F7',
      metrics: [
        { name: 'PR Reviews', type: 'Q' },
        { name: 'Unplanned Work', type: 'Q' },
        { name: 'Cross-team Help', type: 'O' },
        { name: 'Knowledge Sharing', type: 'O' },
      ],
    },
    {
      name: 'Efficiency',
      icon: '⚡',
      color: '#F59E0B',
      metrics: [
        { name: 'AI Usage Score', type: 'Q' },
        { name: 'Automation Index', type: 'Q' },
        { name: 'Commit Frequency', type: 'Q' },
        { name: 'Tool Adoption', type: 'O' },
      ],
    },
  ];

  // Cycle through selected levels in Phase 3
  useEffect(() => {
    if (phase === 3) {
      const interval = setInterval(() => {
        setSelectedLevel(prev => (prev + 1) % levels.length);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [phase, levels.length]);

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Opening Question - Phase 0 */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === 0 ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        style={{ pointerEvents: phase === 0 ? 'auto' : 'none' }}
      >
        <div className="text-center">
          <motion.p
            className="text-4xl md:text-5xl text-[var(--text-primary)] font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            How do we score
          </motion.p>
          <motion.p
            className="text-5xl md:text-6xl text-[var(--accent-cyan)] font-bold mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            engineering performance?
          </motion.p>
        </div>
      </motion.div>

      {/* Phase 1 & 2: Metrics with equation */}
      <motion.div
        className="absolute inset-0 flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 && phase < 3 ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{ pointerEvents: phase >= 1 && phase < 3 ? 'auto' : 'none' }}
      >
        {/* Title */}
        <div className="text-center pt-12 pb-4">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]">
            {phase === 1 && "Too Many Metrics..."}
            {phase === 2 && "Different Types of Data"}
          </h2>
        </div>

        {/* Type indicators for Phase 2 */}
        {phase === 2 && (
          <motion.div
            className="flex justify-center gap-10 py-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#4ECDC4]/10 border border-[#4ECDC4]/40">
              <span className="text-2xl">📊</span>
              <span className="text-base font-bold text-[#4ECDC4]">Quantitative</span>
              <span className="text-sm text-[var(--text-muted)]">· data</span>
            </div>
            <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/40">
              <span className="text-2xl">💬</span>
              <span className="text-base font-bold text-[#F59E0B]">Objective</span>
              <span className="text-sm text-[var(--text-muted)]">· feedback</span>
            </div>
          </motion.div>
        )}

        {/* Metric groups */}
        <div className="flex-1 flex items-center justify-center px-8">
          <div className="flex gap-8 items-start justify-center">
            {metricGroups.map((group, groupIdx) => (
              <motion.div
                key={group.name}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.1 + groupIdx * 0.08, type: 'spring', stiffness: 200 }}
              >
                <motion.div
                  className="w-20 h-20 rounded-full flex flex-col items-center justify-center mb-3"
                  style={{
                    backgroundColor: `${group.color}20`,
                    borderWidth: 3,
                    borderColor: group.color,
                  }}
                  animate={{ scale: phase === 1 ? [1, 1.05, 1] : 1 }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: groupIdx * 0.1 }}
                >
                  <span className="text-2xl">{group.icon}</span>
                  <span className="text-[10px] font-bold" style={{ color: group.color }}>
                    {group.name}
                  </span>
                </motion.div>
                <div className="flex flex-col gap-1">
                  {group.metrics.map((metric, metricIdx) => (
                    <motion.div
                      key={metric.name}
                      className="px-3 py-1 rounded-full text-xs font-medium text-center whitespace-nowrap"
                      style={{
                        backgroundColor: phase >= 2
                          ? (metric.type === 'Q' ? 'rgba(78, 205, 196, 0.15)' : 'rgba(245, 158, 11, 0.15)')
                          : `${group.color}15`,
                        borderWidth: 1,
                        borderColor: phase >= 2
                          ? (metric.type === 'Q' ? '#4ECDC480' : '#F59E0B80')
                          : `${group.color}50`,
                        color: phase >= 2
                          ? (metric.type === 'Q' ? '#4ECDC4' : '#F59E0B')
                          : group.color,
                      }}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + groupIdx * 0.06 + metricIdx * 0.03 }}
                    >
                      {metric.name}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Equation at bottom */}
        <motion.div
          className="flex items-center justify-center gap-2 pb-20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {metricGroups.map((group, i) => (
            <React.Fragment key={group.name}>
              <motion.span
                className="px-3 py-1 rounded text-sm font-bold"
                style={{ backgroundColor: `${group.color}20`, color: group.color }}
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.1 }}
              >
                {group.name}
              </motion.span>
              {i < metricGroups.length - 1 && (
                <span className="text-base text-[var(--text-muted)]">+</span>
              )}
            </React.Fragment>
          ))}
          <span className="text-base text-[var(--text-muted)] mx-2">→</span>
          <span className="px-3 py-1 rounded text-sm font-bold bg-gradient-to-r from-[#4ECDC4]/20 to-[#C9A227]/20 text-[var(--text-primary)]">
            Weighted Score
          </span>
        </motion.div>
      </motion.div>

      {/* Phase 3: Level comparison bar charts with legend */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--bg-primary)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 3 ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{ pointerEvents: phase === 3 ? 'auto' : 'none' }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-3">
          Different Levels, Different Averages
        </h2>
        <p className="text-lg text-[var(--text-muted)] mb-6">
          Average metrics vary significantly by level
        </p>

        {/* Level Legend - clickable to highlight */}
        <div className="flex gap-6 mb-8">
          {[
            { level: 'Junior', short: 'Jr', color: '#22c55e' },
            { level: 'Mid', short: 'Mid', color: '#3b82f6' },
            { level: 'Senior', short: 'Sr', color: '#a855f7' },
            { level: 'Lead', short: 'Lead', color: '#f59e0b' },
          ].map((item, i) => (
            <motion.button
              key={item.level}
              className="flex items-center gap-2 px-4 py-2 rounded-full transition-all"
              style={{
                backgroundColor: selectedLevel === i ? `${item.color}30` : 'transparent',
                borderWidth: 2,
                borderColor: selectedLevel === i ? item.color : 'transparent',
              }}
              onClick={(e) => { e.stopPropagation(); setSelectedLevel(i); }}
              animate={{ scale: selectedLevel === i ? 1.05 : 1 }}
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm font-medium" style={{ color: selectedLevel === i ? item.color : 'var(--text-muted)' }}>
                {item.level}
              </span>
            </motion.button>
          ))}
        </div>

        <div className="flex gap-16">
          {[
            { metric: 'Code Commits/week', values: [12, 18, 8, 4] },
            { metric: 'PR Reviews/week', values: [3, 8, 15, 20] },
            { metric: 'Story Points/sprint', values: [8, 13, 10, 5] },
          ].map((item, idx) => (
            <motion.div
              key={item.metric}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.15 }}
            >
              <p className="text-base font-medium text-[var(--text-secondary)] mb-4">{item.metric}</p>
              <div className="flex gap-3 items-end h-44">
                {[
                  { color: '#22c55e' },
                  { color: '#3b82f6' },
                  { color: '#a855f7' },
                  { color: '#f59e0b' },
                ].map((bar, i) => {
                  const value = item.values[i];
                  const isSelected = selectedLevel === i;
                  return (
                    <div key={i} className="flex flex-col items-center w-12">
                      <motion.span
                        className="text-sm font-bold mb-1"
                        style={{ color: bar.color }}
                        animate={{ scale: isSelected ? 1.2 : 1, opacity: isSelected ? 1 : 0.6 }}
                      >
                        {value}
                      </motion.span>
                      <motion.div
                        className="w-full rounded-t transition-all"
                        style={{ backgroundColor: bar.color }}
                        initial={{ height: 0 }}
                        animate={{
                          height: (value / 20) * 140,
                          opacity: isSelected ? 1 : 0.4,
                          scale: isSelected ? 1.05 : 1,
                        }}
                        transition={{ delay: 0.3 + idx * 0.1 + i * 0.08, duration: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                  );
                })}
              </div>
              {/* Highlight insight for selected level */}
              <motion.div
                className="mt-3 text-xs px-2 py-1 rounded"
                style={{ backgroundColor: `${['#22c55e', '#3b82f6', '#a855f7', '#f59e0b'][selectedLevel]}15` }}
                animate={{ opacity: 1 }}
              >
                <span style={{ color: ['#22c55e', '#3b82f6', '#a855f7', '#f59e0b'][selectedLevel] }}>
                  {levels[selectedLevel]}: {item.values[selectedLevel]}
                </span>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-8 px-8 py-4 rounded-lg bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/30"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-base text-[var(--accent-gold)]">
            💡 {selectedLevel === 0 && "Juniors focus on code output — high commits, fewer reviews"}
            {selectedLevel === 1 && "Mid-level engineers balance coding with collaboration"}
            {selectedLevel === 2 && "Seniors review more PRs but commit less — mentoring focus"}
            {selectedLevel === 3 && "Leads focus on unblocking others — lowest individual output, highest impact"}
          </p>
        </motion.div>
      </motion.div>

      {/* Phase 4: Fair comparison */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--bg-primary)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 4 ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{ pointerEvents: phase === 4 ? 'auto' : 'none' }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-10">
          Fair = Same Level Comparison
        </h2>

        <div className="flex gap-20 items-center">
          <div className="text-center">
            <motion.div
              className="text-8xl mb-8"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ⚖️
            </motion.div>

            <motion.div
              className="flex items-center gap-5 mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-20 h-20 rounded-full bg-purple-500/20 border-3 border-purple-500 flex items-center justify-center">
                <span className="text-purple-400 font-bold text-base">Senior</span>
              </div>
              <span className="text-green-400 font-bold text-2xl">vs</span>
              <div className="w-20 h-20 rounded-full bg-purple-500/20 border-3 border-purple-500 flex items-center justify-center">
                <span className="text-purple-400 font-bold text-base">Senior</span>
              </div>
              <motion.span
                className="text-5xl text-green-400"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring' }}
              >
                ✓
              </motion.span>
            </motion.div>

            <motion.div
              className="flex items-center gap-5 opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.5 }}
            >
              <div className="w-14 h-14 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
                <span className="text-green-400 font-bold text-sm">Junior</span>
              </div>
              <span className="text-red-400 text-lg line-through">vs</span>
              <div className="w-14 h-14 rounded-full bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center">
                <span className="text-purple-400 font-bold text-sm">Senior</span>
              </div>
              <span className="text-3xl text-red-400">✗</span>
            </motion.div>
          </div>

          <motion.div
            className="bg-[var(--bg-secondary)] rounded-2xl p-8 border border-[var(--bg-tertiary)]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-base text-[var(--text-muted)] mb-6">Percentile within Senior peers</p>
            <div className="space-y-4 w-80">
              {[
                { name: 'Alice', percentile: 92, highlight: true },
                { name: 'Bob', percentile: 78, highlight: false },
                { name: 'Carol', percentile: 65, highlight: false },
                { name: 'Dave', percentile: 45, highlight: false },
              ].map((person, i) => (
                <motion.div
                  key={person.name}
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                >
                  <span className="text-base text-[var(--text-muted)] w-14">{person.name}</span>
                  <div className="flex-1 h-5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: person.highlight ? '#22c55e' : '#a855f7' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${person.percentile}%` }}
                      transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }}
                    />
                  </div>
                  <span className="text-base font-bold w-12" style={{ color: person.highlight ? '#22c55e' : '#a855f7' }}>
                    {person.percentile}%
                  </span>
                </motion.div>
              ))}
            </div>
            <motion.p
              className="text-base text-green-400 mt-6 text-center font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              ✨ Top 10% among Senior engineers
            </motion.p>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom phase indicators - always visible */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 text-[10px]">
        {[
          { n: 1, label: 'Metrics', color: '#4ECDC4' },
          { n: 2, label: 'Types', color: '#F59E0B' },
          { n: 3, label: 'Levels', color: '#a855f7' },
          { n: 4, label: 'Fair', color: '#22c55e' },
        ].map((item) => (
          <motion.div
            key={item.n}
            className="flex items-center gap-1.5 px-2 py-1 rounded-full"
            style={{ backgroundColor: phase === item.n ? `${item.color}15` : 'transparent' }}
            animate={{ opacity: phase >= item.n ? 1 : 0.4 }}
          >
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: phase >= item.n ? item.color : 'var(--bg-tertiary)' }}
              animate={{ scale: phase === item.n ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 0.6 }}
            />
            <span style={{ color: phase >= item.n ? item.color : 'var(--text-muted)' }}>
              {item.label}
            </span>
          </motion.div>
        ))}
        <span className="text-[9px] text-[var(--text-muted)] ml-2 self-center">(Space/→ to advance)</span>
      </div>
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
  const [animationComplete, setAnimationComplete] = useState(false);

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
    if (animationComplete) return;

    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 3500),
      setTimeout(() => {
        setPhase(4);
        setAnimationComplete(true);
      }, 5000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [animationComplete]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2"
      >
        Promo Readiness Pipeline
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
      title: 'Metrics Management Dashboard',
      description: 'Organization and team views with live performance metrics',
      visual: 'dashboard',
      color: '#4ECDC4',
    },
    {
      icon: '⚙️',
      title: 'Flexible Metrics Creation',
      description: 'Create and customize metrics on the fly to match your needs',
      visual: 'metrics-builder',
      color: '#6495ED',
    },
    {
      icon: '🔄',
      title: 'Automated Rescoring',
      description: 'Scores update automatically as new data flows in',
      visual: 'rescore',
      color: '#FFD700',
    },
    {
      icon: '👤',
      title: 'Employee Profiles',
      description: 'Radar charts, trends, and performance history',
      visual: 'profile',
      color: '#C9A227',
    },
    {
      icon: '🔌',
      title: 'API Integrations',
      description: 'Connect to your existing HR systems',
      visual: 'api',
      color: '#4ECDC4',
    },
    {
      icon: '🧠',
      title: 'Performance Evaluation Sessions',
      description: 'LLM-powered insights to guide manager discussions',
      visual: 'llm-session',
      color: '#A855F7',
    },
    {
      icon: '💬',
      title: 'LLM-Powered 360° Feedback Scoring',
      description: 'AI analyzes employee feedback for objective scoring',
      visual: 'feedback-360',
      color: '#22c55e',
    },
  ];

  useEffect(() => {
    setTimeout(() => setPhase(1), 500);
    setTimeout(() => setPhase(2), 1500);
  }, []);

  const currentFeature = features[activeFeature];

  // Mini visualizations for each feature - unique animations, no repeating
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
      case 'metrics-builder':
        return (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            {['Delivery', 'Quality', 'Collaboration'].map((metric, i) => (
              <motion.div
                key={metric}
                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.2 }}
                className="flex items-center gap-2 px-3 py-2 bg-[#6495ED]/20 border border-[#6495ED]/50 rounded-lg"
              >
                <span className="text-[#6495ED] text-sm">+ {metric}</span>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 60 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.2 }}
                  className="h-2 bg-[#6495ED] rounded"
                />
              </motion.div>
            ))}
          </div>
        );
      case 'rescore':
        return (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-5xl"
            >
              🔄
            </motion.div>
            <div className="flex gap-2">
              {[3.2, 3.8, 4.2].map((score, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + i * 0.3 }}
                  className="px-3 py-1 rounded bg-[#FFD700]/20 border border-[#FFD700]/50"
                >
                  <span className="text-[#FFD700] font-bold">{score}</span>
                </motion.div>
              ))}
            </div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="text-xs text-[var(--text-muted)]"
            >
              Auto-updated daily
            </motion.span>
          </div>
        );
      case 'profile':
        return (
          <div className="flex items-center justify-center h-full">
            <svg viewBox="0 0 100 100" className="w-32 h-32">
              <motion.polygon
                points="50,10 90,35 90,75 50,100 10,75 10,35"
                fill="none"
                stroke="#C9A22740"
                strokeWidth="2"
              />
              <motion.polygon
                initial={{ points: '50,50 50,50 50,50 50,50 50,50 50,50' }}
                animate={{ points: '50,25 75,40 75,70 50,85 25,70 25,40' }}
                transition={{ duration: 1 }}
                fill="#C9A22730"
                stroke="#C9A227"
                strokeWidth="2"
              />
            </svg>
          </div>
        );
      case 'api':
        return (
          <div className="flex items-center justify-center h-full gap-3">
            {['JIRA', 'GitHub', 'HR'].map((system, i) => (
              <motion.div
                key={system}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.2 }}
                className="flex flex-col items-center"
              >
                <div className="w-12 h-12 rounded-lg bg-[#4ECDC4]/20 border border-[#4ECDC4]/50 flex items-center justify-center text-xs font-bold text-[#4ECDC4]">
                  {system}
                </div>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 20 }}
                  transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                  className="w-0.5 bg-[#4ECDC4]/50"
                />
              </motion.div>
            ))}
          </div>
        );
      case 'llm-session':
        return (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2"
            >
              <span className="text-3xl">👤</span>
              <span className="text-[#A855F7]">↔</span>
              <span className="text-3xl">🧠</span>
            </motion.div>
            {['Key strengths identified', 'Areas for growth', 'Recommended actions'].map((insight, i) => (
              <motion.div
                key={insight}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + i * 0.2 }}
                className="text-xs px-2 py-1 bg-[#A855F7]/20 border border-[#A855F7]/30 rounded text-[#A855F7]"
              >
                ✓ {insight}
              </motion.div>
            ))}
          </div>
        );
      case 'feedback-360':
        return (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="flex gap-2">
              {['👥', '👤', '👔'].map((icon, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.15 }}
                  className="w-10 h-10 rounded-full bg-[#22c55e]/20 border border-[#22c55e]/50 flex items-center justify-center"
                >
                  {icon}
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-2xl"
            >
              ⬇️
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="px-4 py-2 bg-[#22c55e]/20 border border-[#22c55e] rounded-lg"
            >
              <span className="text-[#22c55e] font-bold">Score: 4.3</span>
            </motion.div>
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
        Flexible metrics management for fair evaluations
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
    { icon: '😤', text: '74% of employees believe 360-degree reviews are unfair, biased, or inaccurate' },
    { icon: '🎭', text: 'Promotions based on perception, not actual contribution' },
    { icon: '📋', text: 'Managers lack data and recommendations to navigate performance discussions' },
    { icon: '❓', text: 'No visibility into how scores are calculated' },
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
    { icon: '🔗', text: 'Objective data from JIRA, GitHub, and Confluence' },
    { icon: '🔄', text: '360-degree feedback enriched with real work metrics' },
    { icon: '📊', text: 'Managers get data-driven talking points and recommendations' },
    { icon: '⚖️', text: 'Fair comparison within same level peers' },
    { icon: '🔍', text: 'Transparent methodology based on real contributions' },
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
            <p className="text-xl text-[var(--text-secondary)]">Evalio: Objective data fused with 360-degree reviews</p>
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
            <p className="text-xl text-[var(--text-secondary)]">LLM analyzes what humans miss</p>
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

            {/* LLM badge */}
            {phase >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-2 bg-gradient-to-r from-[var(--accent-cyan)]/20 to-[var(--accent-gold)]/20 border border-[var(--accent-cyan)] rounded-full"
              >
                <span className="text-[var(--text-primary)] text-sm font-semibold">Powered by LLM</span>
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

// Journey Overview - Shows where we are in the transformation journey
// Architecture Comparison - TENET vs REIMAGINE
function ArchitectureComparison() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 600),
      setTimeout(() => setPhase(3), 1000),
      setTimeout(() => setPhase(4), 1400),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center px-4 py-2 overflow-hidden">
      {/* Main SVG Architecture Diagram */}
      <div className="flex-1 w-full flex items-center justify-center">
        <svg viewBox="0 0 900 520" className="w-full h-full" style={{ maxWidth: '1100px', maxHeight: '600px' }}>
          <defs>
            {/* 3D Box gradient - purple bottom */}
            <linearGradient id="purpleGrad3D" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#9061F9" />
              <stop offset="50%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#5B21B6" />
            </linearGradient>
            {/* Darker purple for 3D edge */}
            <linearGradient id="purpleEdge" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#5B21B6" />
              <stop offset="100%" stopColor="#4C1D95" />
            </linearGradient>
            {/* Arrow marker */}
            <marker id="archArrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#7C3AED" />
            </marker>
            <marker id="archArrowGray" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#666" />
            </marker>
          </defs>

          {/* ========== LEFT SIDE: TENET APPROACH ========== */}
          <motion.g
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: phase >= 1 ? 1 : 0, x: phase >= 1 ? 0 : -30 }}
          >
            {/* Header: → TENET APPROACH ← */}
            <text x="200" y="30" textAnchor="middle" fill="#7C3AED" fontSize="11" fontWeight="600">→</text>
            <text x="200" y="30" textAnchor="middle" fill="#444" fontSize="14" fontWeight="700" dx="0">
              <tspan dx="20">TENET APPROACH</tspan>
            </text>
            <text x="330" y="30" textAnchor="middle" fill="#7C3AED" fontSize="11" fontWeight="600">←</text>

            {/* Flow arrow on left side */}
            <path d="M70 70 L70 400" stroke="#7C3AED" strokeWidth="2" fill="none" />
            <polygon points="70,405 65,395 75,395" fill="#7C3AED" />

            {/* UI/HTML Box with React */}
            <g transform="translate(100, 50)">
              {/* White box */}
              <rect x="0" y="0" width="200" height="70" rx="3" fill="#fff" stroke="#ddd" strokeWidth="1" />
              {/* Purple 3D bottom */}
              <path d="M0,70 L0,80 Q0,85 5,85 L195,85 Q200,85 200,80 L200,70 Z" fill="url(#purpleGrad3D)" />
              {/* Content */}
              <text x="100" y="22" textAnchor="middle" fill="#7C3AED" fontSize="13" fontWeight="600">UI / HTML</text>
              {/* React logo */}
              <g transform="translate(60, 32)">
                <circle cx="20" cy="15" r="3" fill="#61DAFB" />
                <ellipse cx="20" cy="15" rx="15" ry="6" fill="none" stroke="#61DAFB" strokeWidth="1" />
                <ellipse cx="20" cy="15" rx="15" ry="6" fill="none" stroke="#61DAFB" strokeWidth="1" transform="rotate(60 20 15)" />
                <ellipse cx="20" cy="15" rx="15" ry="6" fill="none" stroke="#61DAFB" strokeWidth="1" transform="rotate(120 20 15)" />
              </g>
              <text x="140" y="50" textAnchor="start" fill="#61DAFB" fontSize="14" fontWeight="600">React</text>
            </g>

            {/* Arrow down */}
            <path d="M200 140 L200 155" stroke="#7C3AED" strokeWidth="2" markerEnd="url(#archArrow)" />

            {/* New Adapter Layer */}
            <g transform="translate(90, 165)">
              {/* Purple box */}
              <rect x="0" y="0" width="220" height="35" rx="3" fill="url(#purpleGrad3D)" />
              {/* Darker 3D bottom edge */}
              <path d="M0,35 L10,45 L230,45 L220,35 Z" fill="url(#purpleEdge)" />
              <text x="110" y="23" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="600">New Adapter Layer</text>
            </g>

            {/* Arrow down */}
            <path d="M200 215 L200 230" stroke="#7C3AED" strokeWidth="2" markerEnd="url(#archArrow)" />

            {/* New API Layer Box */}
            <g transform="translate(90, 240)">
              {/* White box */}
              <rect x="0" y="0" width="220" height="90" rx="3" fill="#fff" stroke="#ddd" strokeWidth="1" />
              {/* Purple 3D bottom */}
              <path d="M0,90 L10,100 L230,100 L220,90 Z" fill="url(#purpleGrad3D)" />
              {/* Content */}
              <text x="110" y="25" textAnchor="middle" fill="#333" fontSize="14" fontWeight="700">New</text>
              <text x="110" y="42" textAnchor="middle" fill="#333" fontSize="14" fontWeight="700">API Layer</text>
              {/* Java icon */}
              <g transform="translate(40, 50)">
                <path d="M5 0 Q2 -4 5 -7" fill="none" stroke="#E76F00" strokeWidth="1" />
                <path d="M10 -2 Q7 -6 10 -9" fill="none" stroke="#E76F00" strokeWidth="1" />
                <path d="M15 0 Q12 -4 15 -7" fill="none" stroke="#E76F00" strokeWidth="1" />
                <path d="M2 2 L2 18 Q2 22 10 22 Q18 22 18 18 L18 2 Z" fill="#5382A1" />
                <path d="M18 6 Q24 6 24 12 Q24 18 18 18" fill="none" stroke="#5382A1" strokeWidth="2" />
              </g>
              <text x="65" y="73" textAnchor="start" fill="#E76F00" fontSize="12" fontWeight="600">Java</text>
              {/* Drools icon */}
              <g transform="translate(130, 55)">
                <circle cx="10" cy="10" r="10" fill="none" stroke="#1E88E5" strokeWidth="2" />
                <circle cx="10" cy="10" r="4" fill="#1E88E5" />
              </g>
              <text x="160" y="73" textAnchor="start" fill="#1E88E5" fontSize="12" fontWeight="600">Drools</text>
              <text x="110" y="88" textAnchor="middle" fill="#666" fontSize="10">Rules Engine</text>
            </g>

            {/* Arrow down */}
            <path d="M200 345 L200 360" stroke="#7C3AED" strokeWidth="2" markerEnd="url(#archArrow)" />

            {/* MuleSoft */}
            <g transform="translate(115, 370)">
              <rect x="0" y="0" width="170" height="35" rx="17" fill="#fff" stroke="#ddd" strokeWidth="1.5" />
              <circle cx="30" cy="17" r="14" fill="#00A1E0" />
              <text x="30" y="22" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="700">M</text>
              <text x="105" y="22" textAnchor="middle" fill="#333" fontSize="14" fontWeight="600">MuleSoft</text>
            </g>

            {/* Arrow down */}
            <path d="M200 410 L200 425" stroke="#666" strokeWidth="2" markerEnd="url(#archArrowGray)" />

            {/* Oracle + Batch Jobs */}
            <g transform="translate(95, 435)">
              {/* Oracle Database Cylinder */}
              <g transform="translate(0, 0)">
                <ellipse cx="45" cy="8" rx="40" ry="8" fill="#E8E8E8" stroke="#999" strokeWidth="1" />
                <rect x="5" y="8" width="80" height="45" fill="#F5F5F5" stroke="#999" strokeWidth="1" />
                <ellipse cx="45" cy="53" rx="40" ry="8" fill="#E0E0E0" stroke="#999" strokeWidth="1" />
                <line x1="5" y1="8" x2="5" y2="53" stroke="#999" strokeWidth="1" />
                <line x1="85" y1="8" x2="85" y2="53" stroke="#999" strokeWidth="1" />
                <text x="45" y="35" textAnchor="middle" fill="#C74634" fontSize="11" fontWeight="700">ORACLE</text>
              </g>

              {/* Arrow between */}
              <path d="M95 35 L115 35" stroke="#666" strokeWidth="1.5" />
              <polygon points="105,32 115,35 105,38" fill="#666" />

              {/* Batch Jobs */}
              <g transform="translate(125, 5)">
                <rect x="0" y="0" width="70" height="55" rx="3" fill="#fff" stroke="#ddd" strokeWidth="1" />
                <rect x="12" y="10" width="46" height="6" rx="1" fill="#999" />
                <rect x="12" y="20" width="46" height="6" rx="1" fill="#999" />
                <rect x="12" y="30" width="46" height="6" rx="1" fill="#999" />
                <text x="35" y="50" textAnchor="middle" fill="#666" fontSize="9">Batch Jobs</text>
              </g>
            </g>
          </motion.g>

          {/* ========== CENTER DIVIDER ========== */}
          <motion.g
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: phase >= 2 ? 1 : 0, scaleY: phase >= 2 ? 1 : 0 }}
            style={{ transformOrigin: '450px 260px' }}
          >
            <rect x="445" y="50" width="10" height="420" fill="url(#purpleGrad3D)" />

            {/* Data Sync label */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 4 ? 1 : 0 }}
            >
              <text x="390" y="485" fill="#666" fontSize="11">←</text>
              <text x="450" y="485" textAnchor="middle" fill="#444" fontSize="12" fontWeight="600">Data Sync</text>
              <text x="510" y="485" fill="#666" fontSize="11">→</text>
            </motion.g>
          </motion.g>

          {/* ========== RIGHT SIDE: REIMAGINE APPROACH ========== */}
          <motion.g
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: phase >= 1 ? 1 : 0, x: phase >= 1 ? 0 : 30 }}
          >
            {/* Header: → REIMAGINE APPROACH ← */}
            <text x="570" y="30" textAnchor="middle" fill="#7C3AED" fontSize="11" fontWeight="600">→</text>
            <text x="700" y="30" textAnchor="middle" fill="#444" fontSize="14" fontWeight="700">REIMAGINE APPROACH</text>
            <text x="830" y="30" textAnchor="middle" fill="#7C3AED" fontSize="11" fontWeight="600">←</text>

            {/* Flow arrow on right side */}
            <path d="M830 70 L830 400" stroke="#7C3AED" strokeWidth="2" fill="none" />
            <polygon points="830,405 825,395 835,395" fill="#7C3AED" />

            {/* UI/HTML Box with React */}
            <g transform="translate(600, 50)">
              {/* White box */}
              <rect x="0" y="0" width="200" height="70" rx="3" fill="#fff" stroke="#ddd" strokeWidth="1" />
              {/* Purple 3D bottom */}
              <path d="M0,70 L0,80 Q0,85 5,85 L195,85 Q200,85 200,80 L200,70 Z" fill="url(#purpleGrad3D)" />
              {/* Content */}
              <text x="100" y="22" textAnchor="middle" fill="#7C3AED" fontSize="13" fontWeight="600">UI / HTML</text>
              {/* React logo */}
              <g transform="translate(60, 32)">
                <circle cx="20" cy="15" r="3" fill="#61DAFB" />
                <ellipse cx="20" cy="15" rx="15" ry="6" fill="none" stroke="#61DAFB" strokeWidth="1" />
                <ellipse cx="20" cy="15" rx="15" ry="6" fill="none" stroke="#61DAFB" strokeWidth="1" transform="rotate(60 20 15)" />
                <ellipse cx="20" cy="15" rx="15" ry="6" fill="none" stroke="#61DAFB" strokeWidth="1" transform="rotate(120 20 15)" />
              </g>
              <text x="140" y="50" textAnchor="start" fill="#61DAFB" fontSize="14" fontWeight="600">React</text>
            </g>

            {/* Arrow down */}
            <path d="M700 140 L700 155" stroke="#7C3AED" strokeWidth="2" markerEnd="url(#archArrow)" />

            {/* Workflow Engine (top) */}
            <g transform="translate(590, 165)">
              <rect x="0" y="0" width="220" height="35" rx="3" fill="url(#purpleGrad3D)" />
              <path d="M0,35 L10,45 L230,45 L220,35 Z" fill="url(#purpleEdge)" />
              <text x="110" y="23" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="600">Workflow Engine</text>
            </g>

            {/* Arrow down */}
            <path d="M700 215 L700 230" stroke="#7C3AED" strokeWidth="2" markerEnd="url(#archArrow)" />

            {/* Common Capability Box */}
            <g transform="translate(570, 240)">
              {/* White box */}
              <rect x="0" y="0" width="260" height="115" rx="3" fill="#fff" stroke="#ddd" strokeWidth="1" />
              {/* Purple 3D bottom */}
              <path d="M0,115 L10,125 L270,125 L260,115 Z" fill="url(#purpleGrad3D)" />
              {/* Content */}
              <text x="130" y="22" textAnchor="middle" fill="#333" fontSize="14" fontWeight="700">Common Capability</text>
              {/* 2x2 Grid */}
              <rect x="20" y="32" width="100" height="26" rx="2" fill="#f9f9f9" stroke="#ddd" strokeWidth="1" />
              <text x="70" y="50" textAnchor="middle" fill="#555" fontSize="11">Ingestion</text>
              <rect x="140" y="32" width="100" height="26" rx="2" fill="#f9f9f9" stroke="#ddd" strokeWidth="1" />
              <text x="190" y="50" textAnchor="middle" fill="#555" fontSize="11">Extraction</text>
              <rect x="20" y="62" width="100" height="26" rx="2" fill="#f9f9f9" stroke="#ddd" strokeWidth="1" />
              <text x="70" y="80" textAnchor="middle" fill="#555" fontSize="11">Validation</text>
              <rect x="140" y="62" width="100" height="26" rx="2" fill="#f9f9f9" stroke="#ddd" strokeWidth="1" />
              <text x="190" y="80" textAnchor="middle" fill="#555" fontSize="11">Booking</text>
              {/* Tech icons row */}
              <g transform="translate(25, 93)">
                <path d="M3 0 Q0 -3 3 -5" fill="none" stroke="#E76F00" strokeWidth="0.8" />
                <path d="M7 -1 Q4 -4 7 -6" fill="none" stroke="#E76F00" strokeWidth="0.8" />
                <path d="M11 0 Q8 -3 11 -5" fill="none" stroke="#E76F00" strokeWidth="0.8" />
                <path d="M1 2 L1 12 Q1 14 7 14 Q13 14 13 12 L13 2 Z" fill="#5382A1" />
                <text x="20" y="12" fill="#E76F00" fontSize="10" fontWeight="600">Java</text>
              </g>
              <g transform="translate(95, 93)">
                <circle cx="8" cy="7" r="7" fill="none" stroke="#666" strokeWidth="1.5" />
                <text x="8" y="10" textAnchor="middle" fill="#666" fontSize="6" fontWeight="600">REST</text>
                <text x="22" y="12" fill="#666" fontSize="10">API</text>
              </g>
              <g transform="translate(175, 93)">
                <circle cx="8" cy="7" r="7" fill="none" stroke="#1E88E5" strokeWidth="1.5" />
                <circle cx="8" cy="7" r="3" fill="#1E88E5" />
                <text x="22" y="12" fill="#1E88E5" fontSize="10" fontWeight="600">Drools</text>
              </g>
            </g>

            {/* Arrow down */}
            <path d="M700 370 L700 385" stroke="#7C3AED" strokeWidth="2" markerEnd="url(#archArrow)" />

            {/* Workflow Engine (bottom) */}
            <g transform="translate(590, 395)">
              <rect x="0" y="0" width="220" height="35" rx="3" fill="url(#purpleGrad3D)" />
              <path d="M0,35 L10,45 L230,45 L220,35 Z" fill="url(#purpleEdge)" />
              <text x="110" y="23" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="600">Workflow Engine</text>
            </g>

            {/* Arrow down */}
            <path d="M700 445 L700 455" stroke="#4DB33D" strokeWidth="2" />
            <polygon points="700,462 695,452 705,452" fill="#4DB33D" />

            {/* MongoDB */}
            <g transform="translate(660, 468)">
              {/* Database Cylinder */}
              <ellipse cx="40" cy="6" rx="35" ry="6" fill="#E8E8E8" stroke="#999" strokeWidth="1" />
              <rect x="5" y="6" width="70" height="40" fill="#F5F5F5" stroke="#999" strokeWidth="1" />
              <ellipse cx="40" cy="46" rx="35" ry="6" fill="#E0E0E0" stroke="#999" strokeWidth="1" />
              <line x1="5" y1="6" x2="5" y2="46" stroke="#999" strokeWidth="1" />
              <line x1="75" y1="6" x2="75" y2="46" stroke="#999" strokeWidth="1" />
              {/* MongoDB Leaf */}
              <path d="M40 15 C40 15 32 22 32 32 C32 38 36 44 40 47 C44 44 48 38 48 32 C48 22 40 15 40 15 Z" fill="#4DB33D" />
              <path d="M40 47 L40 52" stroke="#4DB33D" strokeWidth="2" />
            </g>
          </motion.g>

          {/* ========== BOTTOM: Trade AI Banner ========== */}
          <motion.g
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: phase >= 4 ? 1 : 0, y: phase >= 4 ? 0 : 20 }}
          >
            {/* Banner box */}
            <rect x="100" y="530" width="700" height="55" rx="5" fill="#fff" stroke="#ddd" strokeWidth="1.5" />

            {/* Trade AI label */}
            <text x="160" y="562" textAnchor="middle" fill="#333" fontSize="16" fontWeight="700">Trade AI</text>

            {/* LLM */}
            <g transform="translate(260, 540)">
              <rect x="0" y="0" width="28" height="28" rx="3" fill="#f5f5f5" stroke="#999" strokeWidth="1" />
              <circle cx="10" cy="12" r="3" fill="#666" />
              <circle cx="18" cy="12" r="3" fill="#666" />
              <path d="M8 20 L20 20" stroke="#666" strokeWidth="2" strokeLinecap="round" />
              <text x="45" y="20" fill="#555" fontSize="12" fontWeight="500">LLM</text>
            </g>

            {/* Cognitive Intelligence */}
            <g transform="translate(420, 540)">
              <circle cx="14" cy="14" r="12" fill="#f5f5f5" stroke="#999" strokeWidth="1" />
              <circle cx="14" cy="14" r="5" fill="#666" />
              <path d="M6 6 L3 3 M22 6 L25 3 M6 22 L3 25 M22 22 L25 25" stroke="#666" strokeWidth="1.5" />
              <text x="35" y="12" fill="#555" fontSize="11" fontWeight="500">Cognitive</text>
              <text x="35" y="24" fill="#555" fontSize="11" fontWeight="500">Intelligence</text>
            </g>

            {/* OCR */}
            <g transform="translate(600, 538)">
              <rect x="0" y="0" width="24" height="32" rx="2" fill="#f5f5f5" stroke="#999" strokeWidth="1" />
              <line x1="5" y1="8" x2="19" y2="8" stroke="#666" strokeWidth="1.5" />
              <line x1="5" y1="14" x2="19" y2="14" stroke="#666" strokeWidth="1.5" />
              <line x1="5" y1="20" x2="14" y2="20" stroke="#666" strokeWidth="1.5" />
              <text x="32" y="12" fill="#555" fontSize="10" fontWeight="500">Optical Character</text>
              <text x="32" y="24" fill="#555" fontSize="10" fontWeight="500">Recognition</text>
            </g>
          </motion.g>
        </svg>
      </div>
    </div>
  );
}

function JourneyOverview() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 600),
      setTimeout(() => setPhase(3), 900),
      setTimeout(() => setPhase(4), 1200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center px-6 py-4 overflow-hidden">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4 mt-4"
      >
        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Where are we in our journey?</h2>
        <p className="text-base text-[var(--text-secondary)]">Trade System — Current State</p>
      </motion.div>

      {/* Main Content - 3 columns */}
      <div className="w-full flex-1 flex gap-4 items-stretch max-w-[1600px]">
        {/* Left Panel - What We've Accomplished */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: phase >= 1 ? 1 : 0, x: phase >= 1 ? 0 : -30 }}
          className="w-72 flex flex-col gap-4 pt-4"
        >
          {/* TENET Delivered - UI Modernization - with pulsing animation */}
          <motion.div
            className="p-5 rounded-xl bg-[#4CAF50]/10 border-2 border-[#4CAF50]/40"
            animate={{
              boxShadow: phase >= 3 ? [
                '0 0 0 0 rgba(76, 175, 80, 0)',
                '0 0 20px 3px rgba(76, 175, 80, 0.3)',
                '0 0 0 0 rgba(76, 175, 80, 0)'
              ] : '0 0 0 0 rgba(76, 175, 80, 0)'
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <h4 className="text-sm font-bold text-[#4CAF50] mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              TENET Delivered
            </h4>
            <p className="text-[11px] text-[var(--text-muted)] mb-3 italic">UI Layer Modernization</p>
            <ul className="text-xs text-[var(--text-secondary)] space-y-1.5">
              <li>• Modern React UI</li>
              <li>• Improved User Experience</li>
              <li>• Reusable Component Library</li>
              <li>• Replaced legacy GWT/Sencha</li>
            </ul>
          </motion.div>

          {/* Infrastructure Upgrades */}
          <div className="p-5 rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--text-muted)]/30">
            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Version Upgrades:</h4>
            <ul className="text-xs text-[var(--text-secondary)] space-y-1.5 ml-1">
              <li>• Drools</li>
              <li>• Java</li>
              <li>• Spring</li>
              <li>• Hibernate</li>
              <li>• Jbpm</li>
            </ul>
          </div>

          {/* Current Limitation */}
          <div className="p-4 rounded-xl bg-[#FF9800]/10 border border-[#FF9800]/30">
            <h4 className="text-xs font-semibold text-[#FF9800] mb-1">Known Limitation:</h4>
            <p className="text-[11px] text-[var(--text-secondary)]">• Non-API implementation pattern still in use</p>
          </div>
        </motion.div>

        {/* Center - Platform A Architecture SVG */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: phase >= 2 ? 1 : 0, scale: phase >= 2 ? 1 : 0.95 }}
          className="flex-1 flex items-center justify-center"
        >
          <svg viewBox="0 0 600 520" className="w-full h-full" style={{ maxWidth: '800px' }}>
            <defs>
              {/* Green glow filter for completed tier */}
              <filter id="greenGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Platform A Container - dashed border with fused title */}
            <rect x="70" y="15" width="400" height="495" rx="12" fill="none" stroke="#888" strokeWidth="2" strokeDasharray="8 4" />
            {/* Title background to create fusion effect */}
            <rect x="145" y="5" width="250" height="22" fill="var(--bg-primary, #0a1628)" />
            <text x="270" y="22" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="700">Trade System</text>

            {/* Users Icon */}
            <g transform="translate(8, 75)">
              <circle cx="22" cy="10" r="10" fill="#666" />
              <circle cx="6" cy="12" r="7" fill="#555" />
              <circle cx="38" cy="12" r="7" fill="#555" />
              <ellipse cx="22" cy="30" rx="14" ry="7" fill="#555" />
              <ellipse cx="8" cy="28" rx="9" ry="6" fill="#444" />
              <ellipse cx="36" cy="28" rx="9" ry="6" fill="#444" />
              <text x="22" y="52" textAnchor="middle" fill="#888" fontSize="12">Users</text>
            </g>
            {/* Arrow from users */}
            <path d="M58 97 L95 97" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <defs>
              <marker id="arrowhead" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                <path d="M0,0 L7,3.5 L0,7 Z" fill="#666" />
              </marker>
            </defs>

            {/* TIER 1 - Presentation - COMPLETED */}
            <motion.g
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 20 }}
            >
              {/* Green glow background for completed tier - pulsing */}
              <motion.rect
                x="96" y="61" width="228" height="105" rx="6"
                fill="#4CAF50" fillOpacity="0.08"
                stroke="#4CAF50" strokeWidth="2"
                initial={{ opacity: 0, scale: 1 }}
                animate={{
                  opacity: phase >= 3 ? [0.6, 1, 0.6] : 0,
                  scale: phase >= 3 ? [1, 1.01, 1] : 1
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{ transformOrigin: 'center' }}
                filter="url(#greenGlow)"
              />

              {/* UI/HTML outer box */}
              <rect x="100" y="65" width="220" height="97" rx="5" fill="#0d2818" stroke="#4CAF50" strokeWidth="1.5" strokeOpacity="0.5" />
              <text x="210" y="83" textAnchor="middle" fill="#4CAF50" fontSize="13" fontWeight="600">UI / HTML</text>

              {/* Inner box with tech logos */}
              <rect x="115" y="90" width="190" height="65" rx="4" fill="#1a2f1a" stroke="#4CAF50" strokeWidth="1" strokeOpacity="0.3" />

              {/* GWT Logo */}
              <g transform="translate(125, 97)">
                <rect width="50" height="50" rx="4" fill="#e53935" fillOpacity="0.15" stroke="#e53935" strokeWidth="0.5" strokeOpacity="0.5" />
                <text x="25" y="22" textAnchor="middle" fill="#e53935" fontSize="12" fontWeight="700">GWT</text>
                <rect x="10" y="28" width="30" height="4" fill="#e53935" />
                <rect x="10" y="35" width="22" height="4" fill="#e53935" opacity="0.7" />
              </g>

              {/* Java Logo - Coffee Cup Style */}
              <g transform="translate(185, 97)">
                <rect width="50" height="50" rx="4" fill="#f89820" fillOpacity="0.1" stroke="#f89820" strokeWidth="0.5" strokeOpacity="0.5" />
                {/* Steam curves */}
                <path d="M20 12 Q17 8 20 5" fill="none" stroke="#f89820" strokeWidth="1" strokeLinecap="round" />
                <path d="M25 10 Q22 6 25 3" fill="none" stroke="#f89820" strokeWidth="1" strokeLinecap="round" />
                <path d="M30 12 Q27 8 30 5" fill="none" stroke="#f89820" strokeWidth="1" strokeLinecap="round" />
                {/* Cup */}
                <path d="M16 15 L16 30 Q16 35 25 35 Q34 35 34 30 L34 15 Z" fill="#5382a1" />
                {/* Handle */}
                <path d="M34 18 Q40 18 40 24 Q40 30 34 30" fill="none" stroke="#5382a1" strokeWidth="2" />
                {/* Java text */}
                <text x="25" y="46" textAnchor="middle" fill="#f89820" fontSize="8" fontWeight="600" fontStyle="italic">Java</text>
              </g>

              {/* Sencha Logo */}
              <g transform="translate(245, 97)">
                <rect width="50" height="50" rx="4" fill="#8bc34a" fillOpacity="0.15" stroke="#8bc34a" strokeWidth="0.5" strokeOpacity="0.5" />
                <ellipse cx="25" cy="20" rx="10" ry="8" fill="#8bc34a" />
                <path d="M19 28 Q25 38 31 28" fill="#8bc34a" />
                <text x="25" y="46" textAnchor="middle" fill="#8bc34a" fontSize="9">Sencha</text>
              </g>

              {/* TENET Completed - banner below the Presentation tier */}
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: phase >= 3 ? 1 : 0 }}
                transition={{ delay: 0.3 }}
              >
                <rect x="125" y="163" width="170" height="22" rx="4" fill="#4CAF50" fillOpacity="0.15" />
                <text x="210" y="178" textAnchor="middle" fill="#4CAF50" fontSize="11" fontWeight="600">✓ Modernized by TENET</text>
              </motion.g>
            </motion.g>

            {/* TIER 2 - Application */}
            <motion.g
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 20 }}
              transition={{ delay: 0.1 }}
            >
              {/* Business Processing label box */}
              <rect x="100" y="195" width="220" height="105" rx="5" fill="#1a1a2e" fillOpacity="0.5" stroke="#9c27b0" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="4 2" />
              <text x="210" y="215" textAnchor="middle" fill="#9c27b0" fontSize="12" fontWeight="600">Business Processing</text>
              <text x="210" y="231" textAnchor="middle" fill="#9c27b0" fontSize="12" fontWeight="600">& Rules Engine Layer</text>

              {/* Inner box with tech */}
              <rect x="115" y="240" width="190" height="55" rx="4" fill="#1a1a2e" stroke="#9c27b0" strokeWidth="1" strokeOpacity="0.3" />

              {/* Java icon - Coffee Cup Style */}
              <g transform="translate(125, 247)">
                <rect width="55" height="42" rx="4" fill="#f89820" fillOpacity="0.1" stroke="#f89820" strokeWidth="0.5" strokeOpacity="0.5" />
                {/* Steam curves */}
                <path d="M22 8 Q19 4 22 1" fill="none" stroke="#f89820" strokeWidth="0.8" strokeLinecap="round" />
                <path d="M27 6 Q24 2 27 -1" fill="none" stroke="#f89820" strokeWidth="0.8" strokeLinecap="round" />
                <path d="M32 8 Q29 4 32 1" fill="none" stroke="#f89820" strokeWidth="0.8" strokeLinecap="round" />
                {/* Cup */}
                <path d="M18 10 L18 24 Q18 28 27 28 Q36 28 36 24 L36 10 Z" fill="#5382a1" />
                {/* Handle */}
                <path d="M36 13 Q42 13 42 19 Q42 25 36 25" fill="none" stroke="#5382a1" strokeWidth="2" />
                {/* Java text */}
                <text x="27" y="38" textAnchor="middle" fill="#f89820" fontSize="8" fontWeight="600" fontStyle="italic">Java</text>
              </g>

              {/* Drools */}
              <g transform="translate(195, 247)">
                <rect width="100" height="42" rx="4" fill="#2196F3" fillOpacity="0.1" stroke="#2196F3" strokeWidth="0.5" strokeOpacity="0.5" />
                <circle cx="22" cy="18" r="12" fill="#2196F3" opacity="0.3" />
                <text x="22" y="22" textAnchor="middle" fill="#2196F3" fontSize="12" fontWeight="700">D</text>
                <text x="58" y="16" textAnchor="start" fill="#2196F3" fontSize="11" fontWeight="600">Drools</text>
                <text x="42" y="32" textAnchor="start" fill="#888" fontSize="9">Rules Engine</text>
              </g>

              {/* Vertical arrow to MuleSoft */}
              <path d="M210 300 L210 313" stroke="#9c27b0" strokeWidth="1.5" strokeOpacity="0.6" markerEnd="url(#arrowhead)" />
            </motion.g>

            {/* TIER 3 - Middleware (MuleSoft) */}
            <motion.g
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 20 }}
              transition={{ delay: 0.2 }}
            >
              {/* 3D MuleSoft platform - improved styling */}
              <polygon points="115,335 305,335 330,315 140,315" fill="#00A1E0" fillOpacity="0.2" stroke="#00A1E0" strokeWidth="1" />
              <rect x="115" y="335" width="190" height="32" fill="#00A1E0" fillOpacity="0.15" stroke="#00A1E0" strokeWidth="1" />
              <polygon points="305,335 305,367 330,347 330,315" fill="#00A1E0" fillOpacity="0.25" stroke="#00A1E0" strokeWidth="1" />

              {/* MuleSoft logo */}
              <circle cx="155" cy="348" r="14" fill="#00A1E0" />
              <text x="155" y="353" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="700">M</text>
              <text x="235" y="358" textAnchor="middle" fill="#00A1E0" fontSize="15" fontWeight="700">MuleSoft</text>
            </motion.g>

            {/* TIER 4 - Data */}
            <motion.g
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 20 }}
              transition={{ delay: 0.3 }}
            >
              {/* Arrow from Tier 3 to Tier 4 */}
              <path d="M210 370 L210 400" stroke="#c9a227" strokeWidth="1.5" strokeOpacity="0.6" markerEnd="url(#arrowhead)" />

              {/* Oracle Database Cylinder - improved */}
              <g transform="translate(125, 405)">
                {/* Cylinder shadow/glow */}
                <ellipse cx="50" cy="60" rx="40" ry="10" fill="#c9a227" opacity="0.1" />

                {/* Cylinder body */}
                <ellipse cx="50" cy="10" rx="40" ry="10" fill="#c9a227" opacity="0.2" />
                <rect x="10" y="10" width="80" height="50" fill="#1a1a2e" stroke="#c9a227" strokeWidth="1.5" />
                <ellipse cx="50" cy="10" rx="40" ry="10" fill="#1a1a2e" stroke="#c9a227" strokeWidth="1.5" />
                <ellipse cx="50" cy="60" rx="40" ry="10" fill="#1a1a2e" stroke="#c9a227" strokeWidth="1.5" />
                <line x1="10" y1="10" x2="10" y2="60" stroke="#c9a227" strokeWidth="1.5" />
                <line x1="90" y1="10" x2="90" y2="60" stroke="#c9a227" strokeWidth="1.5" />

                {/* Oracle text badge */}
                <rect x="15" y="28" width="70" height="20" rx="3" fill="#c9a227" />
                <text x="50" y="43" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700">ORACLE</text>
              </g>

              {/* Batch Jobs */}
              <g transform="translate(265, 425)">
                {/* Arrow from Oracle to Batch Jobs */}
                <path d="M-50 20 L-5 20" stroke="#c9a227" strokeWidth="1.5" strokeOpacity="0.6" markerEnd="url(#arrowhead)" />

                {/* Batch Jobs icon - improved */}
                <rect x="0" y="0" width="60" height="45" rx="4" fill="#1a1a2e" stroke="#9c27b0" strokeWidth="1" strokeOpacity="0.5" />
                {/* Document lines */}
                <line x1="10" y1="12" x2="50" y2="12" stroke="#9c27b0" strokeWidth="1" strokeOpacity="0.6" />
                <line x1="10" y1="22" x2="50" y2="22" stroke="#9c27b0" strokeWidth="1" strokeOpacity="0.6" />
                <line x1="10" y1="32" x2="38" y2="32" stroke="#9c27b0" strokeWidth="1" strokeOpacity="0.6" />
                {/* Clock icon */}
                <circle cx="47" cy="32" r="6" fill="none" stroke="#9c27b0" strokeWidth="1" />
                <path d="M47 28 L47 32 L50 33" stroke="#9c27b0" strokeWidth="1" strokeLinecap="round" />
                <text x="30" y="58" textAnchor="middle" fill="#9c27b0" fontSize="10" fontWeight="500">Batch Jobs</text>
              </g>
            </motion.g>

            {/* Tier Labels with dashed bracket connectors - all aligned */}
            <motion.g
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: phase >= 3 ? 1 : 0, x: phase >= 3 ? 0 : 10 }}
            >
              {/* Tier 1 - Presentation (y=61-185) */}
              <path d="M325 61 L345 61 L345 185 L325 185" fill="none" stroke="#4CAF50" strokeWidth="1.5" strokeDasharray="4 2" />
              <line x1="345" y1="123" x2="478" y2="123" stroke="#4CAF50" strokeWidth="1.5" strokeDasharray="4 2" />
              <text x="485" y="119" fill="#4CAF50" fontSize="10" fontWeight="600">Presentation</text>
              <text x="485" y="131" fill="#4CAF50" fontSize="10" fontWeight="600">Tier</text>

              {/* Tier 2 - Application (y=193-300) */}
              <path d="M325 193 L345 193 L345 300 L325 300" fill="none" stroke="#9c27b0" strokeWidth="1" strokeOpacity="0.6" strokeDasharray="4 2" />
              <line x1="345" y1="247" x2="478" y2="247" stroke="#9c27b0" strokeWidth="1" strokeOpacity="0.6" strokeDasharray="4 2" />
              <text x="485" y="243" fill="#888" fontSize="10">Application</text>
              <text x="485" y="255" fill="#888" fontSize="10">Tier</text>

              {/* Tier 3 - Middleware (y=313-370) */}
              <path d="M325 313 L345 313 L345 370 L325 370" fill="none" stroke="#9c27b0" strokeWidth="1" strokeOpacity="0.6" strokeDasharray="4 2" />
              <line x1="345" y1="341" x2="478" y2="341" stroke="#9c27b0" strokeWidth="1" strokeOpacity="0.6" strokeDasharray="4 2" />
              <text x="485" y="337" fill="#888" fontSize="10">Middleware</text>
              <text x="485" y="349" fill="#888" fontSize="10">Tier</text>

              {/* Tier 4 - Data (y=398-490) */}
              <path d="M325 398 L345 398 L345 490 L325 490" fill="none" stroke="#9c27b0" strokeWidth="1" strokeOpacity="0.6" strokeDasharray="4 2" />
              <line x1="345" y1="444" x2="478" y2="444" stroke="#9c27b0" strokeWidth="1" strokeOpacity="0.6" strokeDasharray="4 2" />
              <text x="485" y="440" fill="#888" fontSize="10">Data</text>
              <text x="485" y="452" fill="#888" fontSize="10">Tier</text>
            </motion.g>
          </svg>
        </motion.div>

        {/* Right Panel - Issues */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: phase >= 4 ? 1 : 0, x: phase >= 4 ? 0 : 30 }}
          className="w-72 flex flex-col gap-4 pt-4"
        >
          {/* Presentation Tier - What Was Fixed - with pulsing animation */}
          <motion.div
            className="p-5 rounded-xl bg-[#4CAF50]/10 border-2 border-[#4CAF50]/40"
            animate={{
              boxShadow: phase >= 4 ? [
                '0 0 0 0 rgba(76, 175, 80, 0)',
                '0 0 20px 3px rgba(76, 175, 80, 0.3)',
                '0 0 0 0 rgba(76, 175, 80, 0)'
              ] : '0 0 0 0 rgba(76, 175, 80, 0)'
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <h4 className="text-sm font-bold text-[#4CAF50] mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Issues Resolved
            </h4>
            <ul className="text-xs text-[var(--text-secondary)] space-y-2">
              <li>• Sencha and GWT out of support</li>
              <li>• Hardcoding business rules and logic</li>
              <li>• Client heavy implementation</li>
            </ul>
            <div className="mt-3 pt-3 border-t border-[#4CAF50]/30">
              <span className="text-xs text-[#4CAF50] font-semibold">✓ Being fixed by TENET</span>
            </div>
          </motion.div>

          {/* Remaining Challenges */}
          <div className="p-5 rounded-xl bg-[#FF9800]/10 border-2 border-[#FF9800]/40">
            <h4 className="text-sm font-bold text-[#FF9800] mb-3">Remaining Challenges</h4>
            <ul className="text-xs text-[var(--text-secondary)] space-y-2">
              <li>• Mule version upgrade needed</li>
              <li>• Strong coupling & dependency with business process layer</li>
              <li>• Non-API implementation</li>
              <li>• Legacy DB dependencies</li>
            </ul>
            <div className="mt-3 pt-3 border-t border-[#FF9800]/30">
              <span className="text-xs text-[#FF9800] font-semibold">⚠ Next Phase (ELC)</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: phase >= 4 ? 1 : 0, y: phase >= 4 ? 0 : 20 }}
        className="mt-auto pt-3 pb-2 flex gap-8 items-center"
      >
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#4CAF50]"></div>
          <span className="text-xs text-[var(--text-secondary)]">Completed (TENET)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#9c27b0] opacity-70"></div>
          <span className="text-xs text-[var(--text-secondary)]">Remaining Work</span>
        </div>
        <div className="px-4 py-1.5 rounded-full bg-[var(--accent-gold)]/20 border border-[var(--accent-gold)]/50">
          <span className="text-xs font-semibold text-[var(--accent-gold)]">1 of 4 Tiers Complete</span>
        </div>
      </motion.div>
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
      desc: '100+ service-level connections',
      detail: '5x industry average • No standard APIs • High coordination cost',
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
    {
      icon: '6',
      label: 'Schema Rigidity',
      desc: 'Fixed relational models',
      detail: 'Every change requires deployment • No runtime flexibility • Tightly coupled data structures',
    },
    {
      icon: '7',
      label: 'Quality & Defects',
      desc: 'Growing technical debt',
      detail: 'High defect backlog • Long resolution cycles • Reactive fixes over proactive quality',
    },
    {
      icon: '8',
      label: 'AI Coding Agents',
      desc: 'Architecture limits AI tooling adoption',
      detail: 'Monolith exceeds AI context windows • Industry moving to AI-native architectures • Domain boundaries enable AI mastery',
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
          <div className="relative w-full h-full flex items-center justify-center p-4 lg:p-8 overflow-auto">
            <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-6 lg:gap-12">
              {/* Left: Architecture Diagram */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: animPhase >= 1 ? 1 : 0, x: animPhase >= 1 ? 0 : -20 }}
                className="flex-1 min-w-0"
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
                className="w-full lg:w-80 flex-shrink-0"
              >
                <h3 className="text-lg font-semibold text-[var(--text-secondary)] mb-4">Business Impact</h3>

                <div className="space-y-4">
                  {[
                    { label: 'Deployment Frequency', value: '1x / month', impact: 'vs. industry 10x/day', bad: true },
                    { label: 'Change Lead Time', value: '6-8 weeks', impact: 'vs. industry <1 week', bad: true },
                    { label: 'Test → Dev Cycles', value: 'Multiple', impact: 'regressions bounce back to engineering', bad: true },
                    { label: 'Regression Risk', value: 'High', impact: 'changes break unrelated areas', bad: true },
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
          <div className="relative w-full h-full flex items-center justify-center p-4 lg:p-8 overflow-auto">
            <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-6 lg:gap-12">
              {/* Left: Processing Flow Diagram */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: animPhase >= 1 ? 1 : 0, x: animPhase >= 1 ? 0 : -20 }}
                className="flex-1 min-w-0"
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
                className="w-full lg:w-80 flex-shrink-0"
              >
                <h3 className="text-lg font-semibold text-[var(--text-secondary)] mb-4">Performance Impact</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Settlement Cycle', value: 'T+2', impact: 'Industry moving to T+0', bad: true },
                    { label: 'Batch Window', value: '4 hrs/night', impact: 'Limits processing capacity', bad: true },
                    { label: 'Queue Depth', value: '12,000+', impact: 'avg. trades waiting', bad: true },
                    { label: 'Manual Touch', value: '34%', impact: 'of trades require intervention', bad: true },
                    { label: 'STP Rate', value: '20%', impact: 'vs. target 90%', bad: true },
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
          <div className="relative w-full h-full flex items-center justify-center p-4 lg:p-8 overflow-auto">
            <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-6 lg:gap-12">
              {/* Left: Integration Architecture */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: animPhase >= 1 ? 1 : 0, x: animPhase >= 1 ? 0 : -20 }}
                className="flex-1 min-w-0"
              >
                <h3 className="text-lg font-semibold text-[var(--text-secondary)] mb-4">Current Integration Landscape</h3>
                <div className="bg-[var(--bg-secondary)] rounded-xl border border-gray-700 p-6">
                  {/* Systems grid */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { name: 'Platform A Core', connections: 12 },
                      { name: 'Legacy System', connections: 9 },
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
                        { issue: 'Service-level connections', count: '100+', severity: 'critical' },
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
                className="w-full lg:w-80 flex-shrink-0"
              >
                <h3 className="text-lg font-semibold text-[var(--text-secondary)] mb-4">Integration Debt</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Integration Points', value: '100+', impact: 'vs. industry avg of 20 service-level connections', bad: true },
                    { label: 'API Documentation', value: '12%', impact: 'interfaces documented', bad: true },
                    { label: 'Breaking Changes/Yr', value: '156', impact: 'avg. cascading failures', bad: true },
                    { label: 'Change Coordination', value: '3-4 weeks', impact: 'for multi-system updates', bad: true },
                    { label: 'Testing Coverage', value: '60%', impact: 'of integration paths', bad: true },
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
          <div className="relative w-full h-full flex items-center justify-center p-4 lg:p-8 overflow-auto">
            <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-6 lg:gap-12">
              {/* Left: Core Visibility Issues */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: animPhase >= 1 ? 1 : 0, x: animPhase >= 1 ? 0 : -20 }}
                className="flex-1 min-w-0"
              >
                <h3 className="text-lg font-semibold text-[var(--text-secondary)] mb-4">Data Visibility Challenges</h3>
                <div className="bg-[var(--bg-secondary)] rounded-xl border border-gray-700 p-6 space-y-5">

                  {/* Issue 1: Legacy Reporting Architecture */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: animPhase >= 2 ? 1 : 0, y: animPhase >= 2 ? 0 : 10 }}
                    className="p-4 bg-gray-800/50 rounded-lg border-l-4 border-red-500"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-white font-semibold">Legacy Reporting Architecture</p>
                      <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded">Outdated</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">Reports run via stored procedures at application level</p>
                    <div className="flex flex-col gap-1 text-xs">
                      <span className="text-gray-500">• <span className="text-orange-400">Batch-based processing</span> — no real-time insights</span>
                      <span className="text-gray-500">• <span className="text-orange-400">Tightly coupled</span> — hard to modify or extend</span>
                    </div>
                  </motion.div>

                  {/* Issue 2: Data Fragmentation */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: animPhase >= 2 ? 1 : 0, y: animPhase >= 2 ? 0 : 10 }}
                    transition={{ delay: 0.1 }}
                    className="p-4 bg-gray-800/50 rounded-lg border-l-4 border-orange-500"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-white font-semibold">Data Fragmentation</p>
                      <span className="text-xs px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded">Silos</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">No single source of truth across platforms</p>
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
                    <p className="text-xs text-red-400 mt-2 text-center">Frequent mismatches require manual reconciliation</p>
                  </motion.div>

                  {/* Issue 3: Manual Reconciliation */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: animPhase >= 3 ? 1 : 0, y: animPhase >= 3 ? 0 : 10 }}
                    transition={{ delay: 0.2 }}
                    className="p-4 bg-gray-800/50 rounded-lg border-l-4 border-yellow-500"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-white font-semibold">Manual Reconciliation</p>
                      <span className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded">Labor Intensive</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">Significant manual effort to reconcile data across systems</p>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-gray-700/30 rounded">
                        <p className="text-lg font-bold text-yellow-400">Hours</p>
                        <p className="text-xs text-gray-500">daily</p>
                      </div>
                      <div className="p-2 bg-gray-700/30 rounded">
                        <p className="text-lg font-bold text-yellow-400">Excel</p>
                        <p className="text-xs text-gray-500">based</p>
                      </div>
                      <div className="p-2 bg-gray-700/30 rounded">
                        <p className="text-lg font-bold text-yellow-400">Team</p>
                        <p className="text-xs text-gray-500">effort</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Right: Impact Metrics */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: animPhase >= 2 ? 1 : 0, x: animPhase >= 2 ? 0 : 20 }}
                className="w-full lg:w-80 flex-shrink-0"
              >
                <h3 className="text-lg font-semibold text-[var(--text-secondary)] mb-4">Business Impact</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Report Freshness', value: 'Delayed', impact: 'batch-based, not real-time', severity: 'Critical' },
                    { label: 'Data Consistency', value: 'Fragmented', impact: 'multiple sources of truth', severity: 'High' },
                    { label: 'Reconciliation', value: 'Manual', impact: 'significant daily effort', severity: 'High' },
                    { label: 'Error Discovery', value: 'Delayed', impact: 'issues found reactively', severity: 'Critical' },
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
          <div className="relative w-full h-full flex items-center justify-center p-4 lg:p-8 overflow-auto">
            <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-6 lg:gap-12">
              {/* Left: Technical Debt Overview */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: animPhase >= 1 ? 1 : 0, x: animPhase >= 1 ? 0 : -20 }}
                className="flex-1 min-w-0"
              >
                <h3 className="text-lg font-semibold text-[var(--text-secondary)] mb-4">Technical Debt Assessment</h3>
                <div className="bg-[var(--bg-secondary)] rounded-xl border border-gray-700 p-6">
                  {/* Codebase stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {[
                      { label: 'Codebase Age', value: '10+ years', status: 'critical' },
                      { label: 'Lines of Code', value: '2.4M', status: 'high' },
                      { label: 'Active Modules', value: '47', status: 'high' },
                      { label: 'Legacy Components', value: 'Outdated Mule ESB', status: 'critical' },
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
                className="w-full lg:w-80 flex-shrink-0"
              >
                <h3 className="text-lg font-semibold text-[var(--text-secondary)] mb-4">Maintenance Cost</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Change Lead Time', value: '4-6 months', impact: 'for significant changes', bad: true },
                    { label: 'Bug Fix Time', value: '3-4 weeks', impact: 'average resolution', bad: true },
                    { label: 'Regression Rate', value: '20%', impact: 'of changes cause issues in regression', bad: true },
                    { label: 'Support Escalations', value: 'High', impact: 'requiring dev attention', bad: true },
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

      case 5: // Schema Rigidity - Architectural comparison view
        return (
          <div className="relative w-full h-full flex items-center justify-center p-4 lg:p-8 overflow-auto">
            <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-6 lg:gap-12">
              {/* Left: Current Architecture */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: animPhase >= 1 ? 1 : 0, x: animPhase >= 1 ? 0 : -20 }}
                className="flex-1 min-w-0"
              >
                <h3 className="text-lg font-semibold text-red-400 mb-4">Current: Fixed Relational Model</h3>
                <div className="bg-[var(--bg-secondary)] rounded-xl border border-red-500/30 p-6">
                  {/* Current constraints */}
                  <div className="space-y-3 mb-4">
                    {[
                      { label: 'Data Model', value: 'Fixed relational tables', desc: 'Schema defined at design time' },
                      { label: 'Any Change', value: 'Requires deployment', desc: 'No runtime flexibility' },
                      { label: 'Structure', value: 'Tightly coupled', desc: 'Changes cascade across system' },
                      { label: 'Adaptability', value: 'Code-driven only', desc: 'Cannot configure without release' },
                    ].map((item, i) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: animPhase >= 2 ? 1 : 0, x: animPhase >= 2 ? 0 : -10 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-3 bg-gray-800/50 rounded-lg border-l-4 border-red-500/50"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-white font-medium">{item.label}</span>
                          <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-400">{item.value}</span>
                        </div>
                        <p className="text-xs text-gray-500">{item.desc}</p>
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
                      <p className="text-red-400 text-sm text-center">Every business change requires a full release cycle</p>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Right: Modern Architecture */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: animPhase >= 2 ? 1 : 0, x: animPhase >= 2 ? 0 : 20 }}
                className="w-full lg:w-80 flex-shrink-0"
              >
                <h3 className="text-lg font-semibold text-green-400 mb-4">Modern: Flexible Architecture</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Flexible Models', desc: 'Document stores, event sourcing adapt to change' },
                    { label: 'Config-Driven', desc: 'Many changes without deployment' },
                    { label: 'Loosely Coupled', desc: 'Services evolve independently' },
                    { label: 'Runtime Adaptable', desc: 'Feature flags, dynamic schemas' },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: animPhase >= 3 ? 1 : 0, y: animPhase >= 3 ? 0 : 10 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-[var(--bg-secondary)] rounded-lg border border-green-500/30 p-4"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-green-400">✓</span>
                        <p className="text-sm text-white font-medium">{item.label}</p>
                      </div>
                      <p className="text-xs text-gray-400 ml-5">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        );

      case 6: // Quality & Defects - Balanced view with industry comparison
        return (
          <div className="relative w-full h-full flex items-center justify-center p-4 lg:p-8 overflow-auto">
            <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-6 lg:gap-12">
              {/* Left: Progress Made */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: animPhase >= 1 ? 1 : 0, x: animPhase >= 1 ? 0 : -20 }}
                className="flex-1 min-w-0"
              >
                <h3 className="text-lg font-semibold text-[var(--text-secondary)] mb-4">Progress Made (2023 → 2025)</h3>
                <div className="bg-[var(--bg-secondary)] rounded-xl border border-gray-700 p-6">
                  {/* Metrics with improvement */}
                  <div className="space-y-4">
                    {[
                      { metric: 'Production Tickets', from: '1,197', to: '581', total: '3,022', change: '-51%', status: 'good' },
                      { metric: 'Defect Count', from: '132', to: '168', total: '495', change: '+27%', status: 'needs-work' },
                      { metric: 'AOComms', from: '103', to: '77', total: '241', change: '-25%', status: 'good' },
                      { metric: 'Farm Breaks', from: '4,380', to: '729', total: '7,209', change: '-83%', status: 'good' },
                    ].map((item, i) => (
                      <motion.div
                        key={item.metric}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: animPhase >= 2 ? 1 : 0, x: animPhase >= 2 ? 0 : -10 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="text-sm text-white font-medium">{item.metric}</p>
                          <p className="text-xs text-gray-500">{item.from} → {item.to}</p>
                        </div>
                        <div className="text-center mx-4">
                          <p className="text-2xl font-bold text-[var(--accent-cyan)]">{item.total}</p>
                          <p className="text-[10px] text-gray-500">TOTAL</p>
                        </div>
                        <span className={`text-lg font-bold px-3 py-1 rounded ${
                          item.status === 'good' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
                        }`}>{item.change}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Acknowledgment */}
                  {animPhase >= 3 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg"
                    >
                      <p className="text-green-400 text-sm text-center">Team has made significant strides in reducing incidents</p>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Right: Industry Comparison */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: animPhase >= 2 ? 1 : 0, x: animPhase >= 2 ? 0 : 20 }}
                className="w-full lg:w-96 flex-shrink-0"
              >
                <h3 className="text-lg font-semibold text-[var(--text-secondary)] mb-4">vs Industry Standards</h3>
                <div className="bg-[var(--bg-secondary)] rounded-xl border border-gray-700 p-6">
                  <div className="space-y-4">
                    {[
                      { metric: 'Defect Density', current: '2.1/KLOC', target: '<1.0/KLOC', gap: '2x above', note: 'per 1,000 lines of code' },
                      { metric: 'MTTR', current: '4.2 hrs', target: '<1 hr', gap: '4x slower', note: 'Mean Time To Recovery' },
                      { metric: 'Change Failure Rate', current: '18%', target: '<5%', gap: '3.6x higher', note: 'deployments causing issues' },
                      { metric: 'Deployment Frequency', current: 'Monthly', target: 'Daily', gap: '30x less', note: 'how often we release' },
                    ].map((item, i) => (
                      <motion.div
                        key={item.metric}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: animPhase >= 3 ? 1 : 0, y: animPhase >= 3 ? 0 : 10 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-3 bg-gray-800/30 rounded-lg border-l-4 border-orange-500/50"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <p className="text-sm text-white font-medium">{item.metric}</p>
                            <p className="text-[10px] text-gray-500 italic">{item.note}</p>
                          </div>
                          <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded">{item.gap}</span>
                        </div>
                        <div className="flex justify-between text-xs mt-2">
                          <span className="text-gray-400">Current: <span className="text-orange-400">{item.current}</span></span>
                          <span className="text-gray-400">Target: <span className="text-green-400">{item.target}</span></span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Gap summary */}
                  {animPhase >= 4 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                    >
                      <p className="text-red-400 text-sm text-center">10,967 total incidents over 3 years — modernization needed to reach industry standards</p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        );

      case 7: // AI Coding Agents - Monorepo vs Domain Architecture
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-4 lg:p-5 overflow-hidden">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: animPhase >= 1 ? 1 : 0, y: animPhase >= 1 ? 0 : -20 }}
              className="mb-3 text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-xs text-gray-500">Industry Trend:</span>
                <span className="text-sm font-semibold text-[var(--accent-primary)] px-2 py-0.5 bg-[var(--accent-primary)]/10 rounded">AI-Native Architecture</span>
              </div>
              <h3 className="text-xl font-bold text-white">Context Window is the New Constraint</h3>
            </motion.div>

            <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-4 flex-1 min-h-0 max-h-[380px]">
              {/* Left: Monorepo - Context Overflow */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: animPhase >= 1 ? 1 : 0, x: animPhase >= 1 ? 0 : -30 }}
                className="flex-1 min-w-0 flex flex-col"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-red-500/20 flex items-center justify-center">
                    <span className="text-red-400 text-sm">✗</span>
                  </div>
                  <h4 className="text-base font-bold text-red-400">Monolithic Codebase</h4>
                </div>

                <div className="bg-gray-900/80 rounded-xl border border-red-500/30 p-3 flex-1 flex flex-col">
                  {/* Context Window Visualization */}
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                      <span>AI Context Window</span>
                      <motion.span
                        animate={{ color: animPhase >= 2 ? ['#ef4444', '#ffffff', '#ef4444'] : '#ef4444' }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="text-red-400"
                      >
                        OVERFLOW
                      </motion.span>
                    </div>
                    <div className="relative h-5 bg-gray-800 rounded border border-gray-700 overflow-hidden">
                      <motion.div
                        initial={{ width: '100%' }}
                        animate={{ width: animPhase >= 2 ? '100%' : '100%' }}
                        className="absolute inset-y-0 left-0 bg-red-500/30"
                      />
                      <motion.div
                        animate={{ x: animPhase >= 2 ? [0, -10, 0] : 0 }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 flex items-center"
                      >
                        {Array(22).fill(0).map((_, i) => (
                          <div key={i} className="h-2.5 w-5 mx-0.5 bg-red-500/60 rounded-sm flex-shrink-0" />
                        ))}
                      </motion.div>
                      <motion.div
                        animate={{ opacity: animPhase >= 2 ? [0.5, 1, 0.5] : 0 }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="absolute right-0 inset-y-0 w-7 bg-gradient-to-l from-red-500 to-transparent flex items-center justify-center"
                      >
                        <span className="text-white text-[9px] font-bold">...</span>
                      </motion.div>
                    </div>
                  </div>

                  {/* The Problem Visual - Tangled Dependencies */}
                  <div className="relative bg-gray-800/50 rounded-lg p-2 mb-2 flex-1 min-h-[100px]">
                    <svg className="w-full h-full absolute inset-0" viewBox="0 0 200 80">
                      {animPhase >= 2 && (
                        <>
                          {[
                            'M20,15 Q100,60 180,25', 'M30,65 Q80,15 170,55', 'M40,40 Q120,70 160,15',
                            'M50,25 Q90,55 140,35', 'M60,55 Q110,25 180,50',
                          ].map((path, i) => (
                            <motion.path
                              key={i}
                              d={path}
                              fill="none"
                              stroke="rgba(239,68,68,0.3)"
                              strokeWidth="1"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 1, delay: i * 0.1 }}
                            />
                          ))}
                        </>
                      )}
                    </svg>
                    <div className="relative z-10 grid grid-cols-5 gap-1">
                      {['Trade', 'Risk', 'Settle', 'Auth', 'Pay', 'Msg', 'Log', 'API', 'DB', 'UI'].map((mod, i) => (
                        <motion.div
                          key={mod}
                          animate={{
                            scale: animPhase >= 2 ? [1, 1.05, 1] : 1,
                            opacity: animPhase >= 2 ? [0.6, 0.8, 0.6] : 0.6
                          }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                          className="bg-red-500/20 border border-red-500/40 rounded px-1 py-0.5 text-[7px] text-red-300 text-center"
                        >
                          {mod}
                        </motion.div>
                      ))}
                    </div>
                    <motion.div
                      animate={{
                        rotate: animPhase >= 2 ? [-5, 5, -5] : 0,
                        scale: animPhase >= 2 ? [1, 0.95, 1] : 1
                      }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="absolute bottom-2 right-2 flex items-center gap-1 bg-gray-900/90 rounded-lg px-2 py-1"
                    >
                      <span className="text-base">🤖</span>
                      <motion.span
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="text-red-400 text-[10px]"
                      >
                        ERROR
                      </motion.span>
                    </motion.div>
                  </div>

                  {/* Output: Slow/Manual */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: animPhase >= 3 ? 1 : 0 }}
                    className="space-y-1"
                  >
                    {[
                      { text: 'Cannot fit codebase in context', icon: '🚫' },
                      { text: 'High hallucination rate', icon: '💭' },
                      { text: 'More review & fixing overhead', icon: '⌨️' },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-2 text-xs text-gray-400"
                      >
                        <span>{item.icon}</span>
                        <span>{item.text}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>

              {/* Center: Feature Race */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: animPhase >= 2 ? 1 : 0, scale: animPhase >= 2 ? 1 : 0.8 }}
                className="w-28 flex-shrink-0 flex flex-col items-center justify-center"
              >
                <p className="text-[10px] text-gray-500 mb-1">Features Shipped</p>
                <div className="relative w-full h-36 bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: animPhase >= 3 ? '15%' : 0 }}
                    transition={{ duration: 3, ease: 'easeOut' }}
                    className="absolute bottom-0 left-2 w-10 bg-gradient-to-t from-red-600 to-red-400 rounded-t"
                  />
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: animPhase >= 3 ? '85%' : 0 }}
                    transition={{ duration: 2, ease: 'easeOut' }}
                    className="absolute bottom-0 right-2 w-10 bg-gradient-to-t from-green-600 to-emerald-400 rounded-t"
                  />
                  <div className="absolute bottom-1 left-2 w-10 text-center">
                    <span className="text-[9px] text-red-300">Us</span>
                  </div>
                  <div className="absolute bottom-1 right-2 w-10 text-center">
                    <span className="text-[9px] text-green-300">Them</span>
                  </div>
                  {animPhase >= 3 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute top-2 inset-x-0 text-center"
                    >
                      <span className="text-lg font-black text-[var(--accent-primary)]">5x</span>
                      <p className="text-[9px] text-gray-400">gap</p>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Right: Domain Architecture - Perfect Fit */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: animPhase >= 2 ? 1 : 0, x: animPhase >= 2 ? 0 : 30 }}
                className="flex-1 min-w-0 flex flex-col"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center">
                    <span className="text-green-400 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-green-400">AI-Native Architecture</h4>
                    <p className="text-[9px] text-gray-500">Bounded contexts fit AI context windows</p>
                  </div>
                </div>

                <div className="bg-gray-900/80 rounded-xl border border-green-500/30 p-3 flex-1 flex flex-col">
                  {/* Context Window - Fits Perfectly */}
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                      <span>AI Context Window</span>
                      <span className="text-green-400">OPTIMAL</span>
                    </div>
                    <div className="relative h-5 bg-gray-800 rounded border border-gray-700 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: animPhase >= 2 ? '70%' : 0 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-y-0 left-0 bg-green-500/30"
                      />
                      <motion.div className="absolute inset-0 flex items-center px-1">
                        {Array(7).fill(0).map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: animPhase >= 2 ? 1 : 0, scale: animPhase >= 2 ? 1 : 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="h-2.5 w-5 mx-0.5 bg-green-500/60 rounded-sm flex-shrink-0"
                          />
                        ))}
                        <div className="flex-1" />
                        <span className="text-[8px] text-green-400 mr-1">Room to spare</span>
                      </motion.div>
                    </div>
                  </div>

                  {/* Domain Agents Working in Parallel */}
                  <div className="relative bg-gray-800/50 rounded-lg p-2 mb-2 flex-1 min-h-[100px]">
                    <div className="grid grid-cols-2 gap-1.5 h-full">
                      {[
                        { name: 'Trade', color: '#00BCD4', typing: 'executeTrade()...' },
                        { name: 'Risk', color: '#FF9800', typing: 'calcExposure()...' },
                        { name: 'Settle', color: '#9C27B0', typing: 'confirmSettle()...' },
                        { name: 'Report', color: '#4CAF50', typing: 'genReport()...' },
                      ].map((agent, i) => (
                        <motion.div
                          key={agent.name}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: animPhase >= 2 ? 1 : 0, y: animPhase >= 2 ? 0 : 10 }}
                          transition={{ delay: i * 0.1 }}
                          className="rounded-lg p-1.5 flex flex-col"
                          style={{ backgroundColor: `${agent.color}15`, border: `1px solid ${agent.color}40` }}
                        >
                          <div className="flex items-center gap-1 mb-0.5">
                            <motion.span
                              animate={{ scale: animPhase >= 3 ? [1, 1.1, 1] : 1 }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                              className="text-sm"
                            >
                              🤖
                            </motion.span>
                            <span className="text-[8px] font-semibold" style={{ color: agent.color }}>{agent.name}</span>
                          </div>
                          <div className="bg-gray-900/60 rounded px-1 py-0.5 flex-1 overflow-hidden">
                            <motion.p
                              animate={{ opacity: animPhase >= 3 ? [0.4, 1, 0.4] : 0 }}
                              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                              className="text-[7px] font-mono text-green-400 truncate"
                            >
                              {agent.typing}
                            </motion.p>
                          </div>
                          {animPhase >= 3 && (
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: '100%' }}
                              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                              className="h-0.5 mt-1 rounded-full"
                              style={{ backgroundColor: agent.color }}
                            />
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Output: Fast/Automated */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: animPhase >= 3 ? 1 : 0 }}
                    className="space-y-1"
                  >
                    {[
                      { text: 'Full domain fits in context', icon: '✅' },
                      { text: 'Parallel agent development', icon: '⚡' },
                      { text: 'Continuous automated delivery', icon: '🚀' },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ x: 10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-2 text-xs text-gray-400"
                      >
                        <span>{item.icon}</span>
                        <span>{item.text}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Bottom Insight */}
            {animPhase >= 4 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 p-3 bg-gray-800/60 border border-gray-700 rounded-xl max-w-4xl"
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-xs text-gray-500">Leading teams are adopting</span>
                  <span className="text-sm font-bold text-[var(--accent-primary)] px-2 py-0.5 bg-[var(--accent-primary)]/10 rounded">AI-Native Architecture</span>
                </div>
                <div className="flex items-center justify-center gap-4 text-xs">
                  <span className="text-gray-400">✓ Cursor / Copilot optimized</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-400">✓ Agent-friendly boundaries</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-400">✓ RAG-ready codebases</span>
                </div>
              </motion.div>
            )}
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
        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-1">The Legacy Challenge</h2>
        <p className="text-base text-[var(--text-secondary)]">Current Trade Systems</p>
      </motion.div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Problem selector - Left side */}
        <div className="w-64 flex flex-col gap-1.5 overflow-y-auto">
          {problems.map((problem, i) => {
            const isActive = activeProblem === i;
            return (
              <motion.button
                key={i}
                onClick={() => { onPhaseChange ? onPhaseChange(i) : setInternalActiveProblem(i); }}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`flex-shrink-0 text-left p-2.5 rounded-xl border-2 transition-all ${
                  isActive
                    ? 'bg-red-500/20 border-red-500'
                    : 'bg-[var(--bg-secondary)]/50 border-transparent hover:border-red-500/30'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isActive ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-400'
                  }`}>
                    {problem.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-xs ${isActive ? 'text-red-400' : 'text-[var(--text-primary)]'}`}>
                      {problem.label}
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)] truncate">{problem.desc}</p>
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
            className="flex-shrink-0 mt-2 p-2 bg-red-500/10 border border-red-500/30 rounded-lg"
          >
            <p className="text-[10px] text-[var(--text-muted)]">Assessment</p>
            <p className="text-red-400 font-bold text-xs">Requires Modernization</p>
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
      title: 'Schema Rigidity',
      subtitle: 'Hard-coded data models',
      impact: '6+ months for changes',
      detail: 'Adding new fields requires full release cycle',
    },
    {
      icon: '2',
      title: 'Data Silos',
      subtitle: 'Fragmented data across systems',
      impact: 'No single source of truth',
      detail: 'Platform A, Platform B, and other systems maintain separate datasets',
    },
    {
      icon: '3',
      title: 'Integration Constraints',
      subtitle: 'High service-level complexity',
      impact: '100+ connections vs. 20 industry avg',
      detail: 'No standardized API layer or event-driven architecture',
    },
    {
      icon: '4',
      title: 'Limited Data Sharing',
      subtitle: 'Assets locked in systems',
      impact: 'Manual data extraction',
      detail: 'Cannot expose data to partners or new channels easily',
    },
    {
      icon: '5',
      title: 'Batch-Only Processing',
      subtitle: 'No real-time data flow',
      impact: 'T-1 day data latency',
      detail: 'All data synchronization happens overnight',
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
          { label: 'Total Connections', value: '100+', impact: '5x industry benchmark', severity: 'Critical' },
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
      <div className="relative w-full h-full flex items-center justify-center p-4 lg:p-8 overflow-auto">
        <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-6 lg:gap-12">
          {/* Left: Current State */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: animPhase >= 1 ? 1 : 0, x: animPhase >= 1 ? 0 : -20 }}
            className="flex-1 min-w-0"
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
            className="w-full lg:w-80 flex-shrink-0"
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
    {
      icon: '5',
      title: 'Market Expansion',
      subtitle: 'Microservices-powered growth',
      enabler: 'Modular architecture enables rapid market entry',
      detail: 'Deploy new capabilities independently, reach markets faster',
    },
    {
      icon: '6',
      title: 'Intelligent Scaling',
      subtitle: 'Focused domains, targeted changes',
      enabler: 'Changes happen where they matter, not in duplicate places',
      detail: 'Engage only required teams per program • Navigate new markets with changes in one place • Drive efficiency and cost reduction',
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
          { metric: 'Asset Accessibility', from: 'Internal only', to: 'Global', percent: 100 },
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
        kpi: 'Market Speed',
        current: { value: 'Slow', detail: 'Monolithic deployment cycles' },
        target: { value: 'Rapid', detail: 'Independent microservice releases' },
        improvements: [
          { metric: 'New Feature Delivery', from: 'Months', to: 'Days', percent: 95 },
          { metric: 'Market Entry', from: 'Sequential', to: 'Parallel', percent: 100 },
          { metric: 'Regional Rollout', from: 'Full release', to: 'Targeted deploy', percent: 100 },
        ],
        businessValue: { label: 'Time to Market', value: '10x', note: 'faster feature delivery' },
      },
      {
        kpi: 'Resource Efficiency',
        current: { value: 'Constrained', detail: 'System limits growth potential' },
        target: { value: 'Intelligent', detail: 'Smart integration unlocks capacity' },
        improvements: [
          { metric: 'System Integration', from: 'Manual', to: 'Automated', percent: 0 },
          { metric: 'Processing Capacity', from: 'Limited', to: 'Elastic', percent: 0 },
          { metric: 'Scaling Approach', from: 'Add resources', to: 'Add intelligence', percent: 0 },
        ],
        businessValue: { label: 'Growth Enablement', value: '→', note: 'scale smarter, not harder' },
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

      const commercializationOpportunities = [
        { id: 'tbml', label: 'TBML Detection', desc: 'Trade-Based Money Laundering screening as a service', icon: '🛡️', color: '#EF4444' },
        { id: 'trade-ai', label: 'Trade AI/LLM', desc: 'Intelligent document processing & risk analysis', icon: '🤖', color: '#8B5CF6' },
        { id: 'api-products', label: 'API Products', desc: 'Monetize unified platform capabilities', icon: '💰', color: '#F59E0B' },
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

            {/* Commercialization Opportunity */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              animate={{
                opacity: phase >= 3 ? 1 : 0,
                scale: phase >= 3 ? 1 : 0.95,
                filter: phase >= 3 ? 'blur(0px)' : 'blur(10px)'
              }}
              transition={{ delay: 0.6, duration: 0.5, ease: 'easeOut' }}
              className="mt-4 p-4 bg-gradient-to-r from-red-500/10 via-purple-500/10 to-amber-500/10 border border-[var(--accent-gold)]/30 rounded-lg relative overflow-hidden"
            >
              {/* Animated background shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
              <div className="relative flex items-center justify-between">
                <div>
                  <motion.p
                    className="text-xs text-[var(--accent-gold)] uppercase tracking-wider mb-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: phase >= 3 ? 1 : 0, x: phase >= 3 ? 0 : -20 }}
                    transition={{ delay: 0.7 }}
                  >
                    Commercialization Opportunity
                  </motion.p>
                  <motion.p
                    className="text-sm text-white font-medium"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: phase >= 3 ? 1 : 0, x: phase >= 3 ? 0 : -20 }}
                    transition={{ delay: 0.8 }}
                  >
                    APIs & unified platform unlock new revenue streams
                  </motion.p>
                </div>
                <div className="flex gap-3">
                  {commercializationOpportunities.map((opp, i) => (
                    <motion.div
                      key={opp.id}
                      initial={{ opacity: 0, y: 30, rotateX: -15 }}
                      animate={{
                        opacity: phase >= 3 ? 1 : 0,
                        y: phase >= 3 ? 0 : 30,
                        rotateX: phase >= 3 ? 0 : -15
                      }}
                      transition={{
                        delay: 0.8 + i * 0.15,
                        type: 'spring',
                        stiffness: 200,
                        damping: 20
                      }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="flex flex-col items-center p-3 rounded-lg cursor-pointer"
                      style={{ backgroundColor: `${opp.color}15`, border: `1px solid ${opp.color}40` }}
                    >
                      <motion.span
                        className="text-2xl"
                        animate={{
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.3,
                          ease: 'easeInOut'
                        }}
                      >
                        {opp.icon}
                      </motion.span>
                      <span className="text-xs font-semibold mt-1" style={{ color: opp.color }}>{opp.label}</span>
                      <span className="text-[10px] text-gray-400 text-center max-w-[120px]">{opp.desc}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom insight */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 3 ? 1 : 0 }}
            className="absolute bottom-8 left-0 right-0 text-center"
          >
            <p className="text-[var(--accent-gold)] font-semibold">Multiple channels, one platform — reach any partner, unlock new markets</p>
            <p className="text-xs text-gray-500 mt-1">From internal operations to external revenue opportunities</p>
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
        { year: 'Y1', volume: 20, oldEffort: 20, newEffort: 20 },
        { year: 'Y2', volume: 40, oldEffort: 38, newEffort: 22 },
        { year: 'Y3', volume: 70, oldEffort: 65, newEffort: 25 },
        { year: 'Y4', volume: 100, oldEffort: 95, newEffort: 28 },
        { year: 'Y5', volume: 150, oldEffort: 140, newEffort: 32 },
      ];

      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-6 pt-16">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-16 left-0 right-0 text-center z-10"
          >
            <h2 className="text-2xl font-bold text-white mb-1">Scalable by Design</h2>
            <p className="text-sm text-gray-400">Architecture supports volume growth through modular components</p>
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
                <p className="text-lg font-semibold text-gray-400">Legacy System Constraints</p>
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
                        {/* Effort bar (old way) */}
                        <motion.div
                          className="w-5 bg-red-500/70 rounded-t"
                          initial={{ height: 0 }}
                          animate={{ height: phase >= 1 ? `${d.oldEffort * 0.95}%` : 0 }}
                          transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{d.year}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-4 text-xs">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-600 rounded" /> Volume</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500/70 rounded" /> System Effort</span>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: phase >= 1 ? 1 : 0 }}
                  transition={{ delay: 0.8 }}
                  className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-center"
                >
                  <p className="text-red-400 font-semibold">Growth limited by system capacity</p>
                  <p className="text-xs text-gray-500">Manual constraints hold back expansion</p>
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
                <p className="text-lg font-semibold text-white">Intelligent Scaling</p>
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
                        {/* Effort bar (new way - flat) */}
                        <motion.div
                          className="w-5 bg-green-500 rounded-t"
                          initial={{ height: 0 }}
                          animate={{ height: phase >= 3 ? `${d.newEffort * 0.95}%` : 0 }}
                          transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                        />
                      </div>
                      <span className="text-xs text-gray-400">{d.year}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-4 text-xs">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-[var(--accent-cyan)] rounded" /> Volume Growth</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded" /> Team Capacity</span>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: phase >= 3 ? 1 : 0 }}
                  transition={{ delay: 0.8 }}
                  className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-center"
                >
                  <p className="text-green-400 font-semibold">Volume ≠ Staff</p>
                  <p className="text-xs text-gray-400">Focused domains + intelligent systems enable growth without proportional headcount</p>
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
              { metric: 'Cost per Transaction', old: 'High', new: 'Optimized', saving: '80%+ reduction' },
              { metric: 'Processing Capacity', old: 'Limited', new: 'Elastic', saving: '50x+ throughput' },
              { metric: 'Cost of Change', old: 'High', new: 'Low', saving: 'Focused domains' },
              { metric: 'Time to Scale', old: 'Months', new: 'Instant', saving: 'On-demand' },
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
            <p className="text-[var(--accent-gold)] font-semibold">Volume growth without linear cost increase</p>
            <p className="text-xs text-gray-500 mt-1">Automation handles routine processing — teams focus on exceptions</p>
          </motion.div>
        </div>
      );
    }

    // Special visualization for Intelligent Scaling (index 5) - Focused Domains
    if (index === 5) {
      const duplicatedDomains = [
        { id: 'billing', label: 'Billing', copies: ['Platform A', 'Platform B', 'LCS'] },
        { id: 'cif', label: 'Module C', copies: ['Platform A', 'Platform B'] },
        { id: 'participation', label: 'Module P', copies: ['Platform A', 'GTS'] },
      ];

      const focusedDomains = [
        { id: 'billing', label: 'Billing Domain', owner: 'Billing Team', color: '#00D4FF' },
        { id: 'cif', label: 'CIF Domain', owner: 'CIF Team', color: '#10B981' },
        { id: 'participation', label: 'Participation Domain', owner: 'Participation Team', color: '#8B5CF6' },
      ];

      const teams = [
        { id: 't1', label: 'Billing', active: true },
        { id: 't2', label: 'Module C', active: false },
        { id: 't3', label: 'Module P', active: false },
        { id: 't4', label: 'Ops', active: false },
        { id: 't5', label: 'QA', active: false },
      ];

      // Message showing which team is engaged for the change
      const engagementMessage = "When billing logic needs to change or a fix:";

      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-4 lg:p-8 pt-16">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-16 left-0 right-0 text-center z-10"
          >
            <h2 className="text-2xl font-bold text-white mb-1">Focused Domains, Targeted Changes</h2>
            <p className="text-sm text-gray-400">Changes where they matter, teams engaged when needed</p>
          </motion.div>

          {/* Main comparison layout */}
          <div className="w-full max-w-6xl flex flex-col lg:flex-row items-stretch gap-6 mt-8">

            {/* LEFT - Duplicated Domains (Old Way) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: phase >= 1 ? 1 : 0, x: phase >= 1 ? 0 : -30 }}
              className="flex-1 bg-red-500/5 rounded-xl border border-red-500/30 p-4"
            >
              <div className="text-center mb-4">
                <p className="text-xs text-red-400 uppercase tracking-wider">Legacy Architecture</p>
                <p className="text-lg font-semibold text-white">Duplicated Logic</p>
              </div>

              {/* Duplicated modules visualization */}
              <div className="space-y-3 mb-4">
                {duplicatedDomains.map((domain, i) => (
                  <motion.div
                    key={domain.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: phase >= 1 ? 1 : 0, x: phase >= 1 ? 0 : -10 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-3 bg-gray-800/50 rounded-lg border border-gray-700"
                  >
                    <p className="text-xs text-gray-400 mb-2">{domain.label} Logic exists in:</p>
                    <div className="flex flex-wrap gap-2">
                      {domain.copies.map((copy, j) => (
                        <motion.span
                          key={j}
                          className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded border border-red-500/30"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity, delay: j * 0.3 }}
                        >
                          {copy}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Change impact */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: phase >= 1 ? 1 : 0 }}
                transition={{ delay: 0.5 }}
                className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
              >
                <p className="text-xs text-red-400 font-semibold mb-2">When a change is needed:</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {['All Teams', 'All Systems', 'Full Testing'].map((item, i) => (
                    <motion.span
                      key={i}
                      className="px-2 py-1 text-xs bg-red-500/20 text-red-300 rounded"
                      initial={{ scale: 0 }}
                      animate={{ scale: phase >= 1 ? 1 : 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                    >
                      ⚠️ {item}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* CENTER - Transformation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: phase >= 2 ? 1 : 0, scale: phase >= 2 ? 1 : 0.8 }}
              className="flex flex-col items-center justify-center w-32 lg:w-40"
            >
              <div className="relative">
                <motion.div
                  className="w-20 h-20 rounded-full border-4 border-[var(--accent-cyan)] flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                >
                  <div className="absolute inset-2 rounded-full bg-[var(--accent-cyan)]/10" />
                </motion.div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-2xl">🎯</span>
                    <p className="text-[9px] text-[var(--accent-cyan)] font-semibold">Focus</p>
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: phase >= 2 ? 1 : 0 }}
                className="my-3"
              >
                <svg width="40" height="50" viewBox="0 0 40 50">
                  <motion.path
                    d="M20 0 L20 35 M10 28 L20 40 L30 28"
                    stroke="var(--accent-cyan)"
                    strokeWidth="2"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8 }}
                  />
                </svg>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: phase >= 2 ? 1 : 0 }}
                className="text-xs text-center text-gray-400"
              >
                Domain<br />Ownership
              </motion.p>
            </motion.div>

            {/* RIGHT - Focused Domains (New Way) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: phase >= 3 ? 1 : 0, x: phase >= 3 ? 0 : 30 }}
              className="flex-1 bg-[var(--accent-cyan)]/5 rounded-xl border border-[var(--accent-cyan)]/30 p-4"
            >
              <div className="text-center mb-4">
                <p className="text-xs text-[var(--accent-cyan)] uppercase tracking-wider">Modern Architecture</p>
                <p className="text-lg font-semibold text-white">Focused Domains</p>
              </div>

              {/* Single-owner domains */}
              <div className="space-y-3 mb-4">
                {focusedDomains.map((domain, i) => (
                  <motion.div
                    key={domain.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: phase >= 3 ? 1 : 0, x: phase >= 3 ? 0 : 10 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-3 rounded-lg border"
                    style={{
                      backgroundColor: `${domain.color}10`,
                      borderColor: `${domain.color}50`
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-white">{domain.label}</p>
                      <span
                        className="px-2 py-1 text-xs rounded"
                        style={{ backgroundColor: `${domain.color}30`, color: domain.color }}
                      >
                        {domain.owner}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Single source of truth</p>
                  </motion.div>
                ))}
              </div>

              {/* Change impact - targeted */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: phase >= 3 ? 1 : 0 }}
                transition={{ delay: 0.5 }}
                className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg"
              >
                <p className="text-xs text-green-400 font-semibold mb-2">When billing logic needs to change or a fix:</p>
                <div className="flex items-center gap-2">
                  {teams.map((team, i) => (
                    <motion.span
                      key={team.id}
                      className={`px-2 py-1 text-xs rounded ${
                        team.active
                          ? 'bg-green-500/30 text-green-300 border border-green-500/50'
                          : 'bg-gray-700/30 text-gray-500'
                      }`}
                      initial={{ scale: 0 }}
                      animate={{ scale: phase >= 3 ? 1 : 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                    >
                      {team.active ? '✓' : '—'} {team.label}
                    </motion.span>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">Only required teams engage</p>
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom - Efficiency Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: phase >= 3 ? 1 : 0, y: phase >= 3 ? 0 : 20 }}
            transition={{ delay: 0.5 }}
            className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl"
          >
            {[
              { metric: 'Change Scope', old: 'All systems', new: 'One domain', icon: '🎯' },
              { metric: 'Teams Involved', old: 'Everyone', new: 'Domain owner', icon: '👥' },
              { metric: 'Testing Effort', old: 'Full regression', new: 'Targeted tests', icon: '✅' },
              { metric: 'Market Agility', old: 'Constrained', new: 'Rapid entry', icon: '🚀' },
            ].map((item, i) => (
              <motion.div
                key={item.metric}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: phase >= 3 ? 1 : 0, scale: phase >= 3 ? 1 : 0.95 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="bg-[var(--bg-secondary)]/50 rounded-lg border border-gray-700 p-3 text-center"
              >
                <span className="text-lg">{item.icon}</span>
                <p className="text-xs text-gray-400 mt-1">{item.metric}</p>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">{item.old}</span>
                  <span className="text-gray-600">→</span>
                  <span className="text-xs text-[var(--accent-cyan)] font-semibold">{item.new}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom insight */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 3 ? 1 : 0 }}
            className="absolute bottom-16 left-0 right-0 text-center"
          >
            <p className="text-[var(--accent-gold)] font-semibold">Changes in one place, efficiency everywhere</p>
            <p className="text-xs text-gray-500 mt-1">Navigate new markets faster with architecture that enables focus, not friction</p>
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
        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Business Opportunities</h2>
        <p className="text-base text-[var(--text-secondary)]">Technical modernization enables business innovation</p>
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
          {/* Opportunity title inside viz - hide for visualizations with their own titles (index 2, 3, 4, 5) */}
          {activeOpportunity < 2 && (
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
          )}

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
    { icon: '⚡', title: 'Cost Reduction', metric: '~30%', unit: 'lower cost of change', color: '#00D4FF', height: 85 },
    { icon: '🚀', title: 'Time to Market', metric: '2-6', unit: 'months (vs 3-12)', color: '#C9A227', height: 75 },
    { icon: '🔄', title: 'End-to-End STP', metric: '~90%', unit: 'straight-through', color: '#4ECDC4', height: 95 },
    { icon: '📈', title: 'Processing Time', metric: '40%+', unit: 'reduction', color: '#9B59B6', height: 80 },
    { icon: '☁️', title: 'Availability', metric: '5 9s', unit: 'system uptime', color: '#E74C3C', height: 90 },
    { icon: '🎯', title: 'Accuracy', metric: '>95%', unit: 'target', color: '#3498DB', height: 70 },
  ];

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 700),
      setTimeout(() => setPhase(3), 1200),
      setTimeout(() => setPhase(4), 1800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (phase >= 3 && activeGoal < goals.length - 1) {
      const timer = setTimeout(() => {
        setActiveGoal(prev => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [phase, activeGoal, goals.length]);

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
                <p className="text-2xl font-bold text-red-400">20%</p>
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
                <p className="text-2xl font-bold text-green-400">~90%</p>
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
              <p className="text-2xl font-bold text-[var(--accent-gold)]">~30%</p>
              <p className="text-xs text-[var(--text-muted)]">Cost Reduction</p>
            </div>
            <div className="w-px h-10 bg-[var(--accent-gold)]/30" />
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--accent-cyan)]">40%+</p>
              <p className="text-xs text-[var(--text-muted)]">Faster Processing</p>
            </div>
            <div className="w-px h-10 bg-[var(--accent-gold)]/30" />
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">~90%</p>
              <p className="text-xs text-[var(--text-muted)]">STP Target</p>
            </div>
            <div className="w-px h-10 bg-[var(--accent-gold)]/30" />
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-400">5 9's</p>
              <p className="text-xs text-[var(--text-muted)]">Availability</p>
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
    { icon: '⚡', label: 'Speed', value: '40%+ faster' },
    { icon: '🎯', label: 'Accuracy', value: '>95%' },
    { icon: '💰', label: 'Cost', value: '~30% reduction' },
    { icon: '📊', label: 'STP Rate', value: '~90%' },
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

  const metrics = [
    {
      icon: '🔄',
      label: 'STP Rate',
      before: '20%',
      after: '~90%',
      badge: '+70%',
      color: '#4ECDC4',
      gradient: 'from-red-500/20 to-emerald-500/20'
    },
    {
      icon: '⏱️',
      label: 'Processing Time',
      before: '40min - 4hrs',
      after: '15min - 1hr',
      badge: '40%+ faster',
      color: '#C9A227',
      gradient: 'from-orange-500/20 to-cyan-500/20'
    },
    {
      icon: '📋',
      label: 'Process Steps',
      before: '6 steps',
      after: '4 steps',
      badge: '-33%',
      color: '#00D4FF',
      gradient: 'from-gray-500/20 to-blue-500/20'
    },
    {
      icon: '🎯',
      label: 'Accuracy',
      before: '~85%',
      after: '>95%',
      badge: '+10%',
      color: '#9B59B6',
      gradient: 'from-purple-500/20 to-green-500/20'
    },
    {
      icon: '💰',
      label: 'Cost of Change',
      before: 'High',
      after: 'Low',
      badge: '~30%↓',
      color: '#E74C3C',
      gradient: 'from-red-500/20 to-emerald-500/20'
    },
    {
      icon: '☁️',
      label: 'Availability',
      before: '3 9\'s',
      after: '5 9\'s',
      badge: 'Enterprise',
      color: '#2ECC71',
      gradient: 'from-yellow-500/20 to-green-500/20'
    },
    {
      icon: '🚀',
      label: 'Time to Market',
      before: '3-12 months',
      after: '2-6 months',
      badge: '50%+ faster',
      color: '#FF6B6B',
      gradient: 'from-pink-500/20 to-cyan-500/20'
    },
  ];

  useEffect(() => {
    setTimeout(() => setPhase(1), 300);
    setTimeout(() => setPhase(2), 800);
    setTimeout(() => setPhase(3), 1400);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center p-4 lg:p-6">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-5"
        >
          <h2 className="text-2xl lg:text-3xl font-bold text-[var(--text-primary)] mb-1">
            Goals & Value Proposition
          </h2>
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="text-red-400 font-medium">TPS/TENET</span>
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-gray-500"
            >
              →
            </motion.span>
            <span className="text-emerald-400 font-medium">New System</span>
          </div>
        </motion.div>

        {/* Metrics Grid - 2 rows */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {metrics.slice(0, 4).map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{
                opacity: phase >= 1 ? 1 : 0,
                y: phase >= 1 ? 0 : 30,
                scale: phase >= 1 ? 1 : 0.9
              }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 120 }}
              className={`relative rounded-xl p-4 bg-gradient-to-br ${metric.gradient} border border-gray-700/50 overflow-hidden`}
            >
              {/* Animated background pulse */}
              <motion.div
                className="absolute inset-0 bg-white/5"
                animate={{ opacity: [0, 0.1, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
              />

              {/* Icon & Label */}
              <div className="flex items-center gap-2 mb-3">
                <motion.span
                  className="text-xl"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
                >
                  {metric.icon}
                </motion.span>
                <span className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wide">
                  {metric.label}
                </span>
              </div>

              {/* Before → After */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1">
                  <p className="text-[10px] text-gray-500 mb-0.5">Before</p>
                  <motion.p
                    className="text-sm lg:text-base font-bold text-red-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: phase >= 2 ? 1 : 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                  >
                    {metric.before}
                  </motion.p>
                </div>

                <motion.div
                  animate={{ x: [0, 3, 0], opacity: phase >= 2 ? 1 : 0 }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                  className="text-gray-500 text-lg"
                >
                  →
                </motion.div>

                <div className="flex-1 text-right">
                  <p className="text-[10px] text-gray-500 mb-0.5">After</p>
                  <motion.p
                    className="text-sm lg:text-base font-bold text-emerald-400"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: phase >= 2 ? 1 : 0,
                      scale: phase >= 2 ? 1 : 0.8
                    }}
                    transition={{ delay: 0.4 + i * 0.1, type: 'spring' }}
                  >
                    {metric.after}
                  </motion.p>
                </div>
              </div>

              {/* Improvement Badge */}
              <motion.div
                className="absolute -top-1 -right-1"
                initial={{ scale: 0, rotate: -20 }}
                animate={{
                  scale: phase >= 3 ? 1 : 0,
                  rotate: phase >= 3 ? 0 : -20
                }}
                transition={{ delay: 0.6 + i * 0.1, type: 'spring', stiffness: 200 }}
              >
                <span
                  className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold"
                  style={{
                    backgroundColor: metric.color,
                    color: '#000',
                    boxShadow: `0 0 15px ${metric.color}60`
                  }}
                >
                  {metric.badge}
                </span>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Second row - 3 cards centered */}
        <div className="flex justify-center gap-3 lg:gap-4 mt-3 lg:mt-4">
          {metrics.slice(4).map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{
                opacity: phase >= 1 ? 1 : 0,
                y: phase >= 1 ? 0 : 30,
                scale: phase >= 1 ? 1 : 0.9
              }}
              transition={{ delay: 0.4 + i * 0.1, type: 'spring', stiffness: 120 }}
              className={`relative rounded-xl p-4 bg-gradient-to-br ${metric.gradient} border border-gray-700/50 overflow-hidden w-full max-w-[220px]`}
            >
              {/* Animated background pulse */}
              <motion.div
                className="absolute inset-0 bg-white/5"
                animate={{ opacity: [0, 0.1, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
              />

              {/* Icon & Label */}
              <div className="flex items-center gap-2 mb-3">
                <motion.span
                  className="text-xl"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
                >
                  {metric.icon}
                </motion.span>
                <span className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wide">
                  {metric.label}
                </span>
              </div>

              {/* Before → After */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1">
                  <p className="text-[10px] text-gray-500 mb-0.5">Before</p>
                  <motion.p
                    className="text-sm lg:text-base font-bold text-red-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: phase >= 2 ? 1 : 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    {metric.before}
                  </motion.p>
                </div>

                <motion.div
                  animate={{ x: [0, 3, 0], opacity: phase >= 2 ? 1 : 0 }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                  className="text-gray-500 text-lg"
                >
                  →
                </motion.div>

                <div className="flex-1 text-right">
                  <p className="text-[10px] text-gray-500 mb-0.5">After</p>
                  <motion.p
                    className="text-sm lg:text-base font-bold text-emerald-400"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: phase >= 2 ? 1 : 0,
                      scale: phase >= 2 ? 1 : 0.8
                    }}
                    transition={{ delay: 0.7 + i * 0.1, type: 'spring' }}
                  >
                    {metric.after}
                  </motion.p>
                </div>
              </div>

              {/* Improvement Badge */}
              <motion.div
                className="absolute -top-1 -right-1"
                initial={{ scale: 0, rotate: -20 }}
                animate={{
                  scale: phase >= 3 ? 1 : 0,
                  rotate: phase >= 3 ? 0 : -20
                }}
                transition={{ delay: 0.9 + i * 0.1, type: 'spring', stiffness: 200 }}
              >
                <span
                  className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold"
                  style={{
                    backgroundColor: metric.color,
                    color: '#000',
                    boxShadow: `0 0 15px ${metric.color}60`
                  }}
                >
                  {metric.badge}
                </span>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Summary - Total Improvement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: phase >= 3 ? 1 : 0, y: phase >= 3 ? 0 : 20 }}
          transition={{ delay: 1.2 }}
          className="mt-5 flex justify-center"
        >
          <div className="flex items-center gap-6 px-6 py-3 rounded-2xl bg-gradient-to-r from-[var(--accent-gold)]/10 via-[var(--accent-cyan)]/10 to-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/30">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-center"
            >
              <p className="text-xs text-gray-400">Total Reduction</p>
              <p className="text-xl font-bold text-[var(--accent-gold)]">40%+</p>
            </motion.div>
            <div className="w-px h-8 bg-gray-700" />
            <div className="text-center">
              <p className="text-xs text-gray-400">Modern Platform</p>
              <p className="text-sm font-semibold text-emerald-400">Enterprise Ready</p>
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
  const phase = forcePhase !== undefined ? forcePhase : 0;

  // All 14 Trade systems (APAR and Platform A are highlighted)
  const allTradeSystems = [
    { id: 'tps', name: 'Platform A', highlight: true, color: '#00D4FF' },
    { id: 'apar', name: 'Platform B', highlight: true, color: '#C9A227' },
    { id: 'tcfe', name: 'Unified Frontend', highlight: false, color: '#6B7280' },
    { id: 'tce', name: 'TCE', highlight: false, color: '#6B7280' },
    { id: 'sop', name: 'Module S', highlight: false, color: '#6B7280' },
    { id: 'dd', name: 'Module D', highlight: false, color: '#6B7280' },
    { id: 'cleartrade', name: 'ClearTrade', highlight: false, color: '#6B7280' },
    { id: 'tradesharp', name: 'TradeSharp - Doc Services', highlight: false, color: '#6B7280' },
    { id: 'falcon', name: 'Falcon', highlight: false, color: '#6B7280' },
    { id: 'inigio', name: 'Inigio', highlight: false, color: '#6B7280' },
    { id: 'bir', name: 'BIR', highlight: false, color: '#6B7280' },
    { id: 'arcrm', name: 'Accounts Receivable CRM', highlight: false, color: '#6B7280' },
    { id: 'smartdx', name: 'SmartDX - Document Services', highlight: false, color: '#6B7280' },
    { id: 'erp', name: 'ERP Integrator', highlight: false, color: '#6B7280' },
  ];

  // Modules currently duplicated in Platform B that will move
  const duplicatedModules = [
    { name: 'Billing', icon: '🧾', color: '#00D4FF', destination: 'payment' },
    { name: 'GL Posting', icon: '📒', color: '#10B981', destination: 'payment' },
    { name: 'Module P', icon: '🤝', color: '#C9A227', destination: 'trade' },
    { name: 'Module C', icon: '👥', color: '#8B5CF6', destination: 'trade' },
  ];

  // Trade Shared modules (14 modules under Trade Org level)
  const tradeSharedModules = [
    { name: 'KYC', icon: '🔐' },
    { name: 'Loan', icon: '💳' },
    { name: 'Payments', icon: '💸' },
    { name: 'Request Ingestion', icon: '📥' },
    { name: 'Sanction Screening', icon: '🛡️' },
    { name: 'Analytics', icon: '📊' },
    { name: 'Asset Distribution', icon: '📦' },
    { name: 'Doc Mgmt', icon: '📄' },
    { name: 'Offer Mgmt', icon: '🎯' },
    { name: 'Invoice Mgmt', icon: '🧾' },
    { name: 'Doc Extraction', icon: '🔍' },
    { name: 'AI/ML', icon: '🤖' },
    { name: 'TBML', icon: '⚠️' },
    { name: 'Reference Data', icon: '📋' },
  ];

  // Payment level modules (shared at Payment Org level)
  const paymentModules = [
    { name: 'Billing', icon: '🧾' },
    { name: 'GL Posting', icon: '📒' },
    { name: 'Payment Initiation', icon: '💳' },
    { name: 'Client Service', icon: '👥' },
    { name: 'Navigator', icon: '🧭' },
    { name: 'Doc Express', icon: '📄' },
    { name: 'BRIE', icon: '🔍' },
    { name: 'Sentry', icon: '🛡️' },
    { name: 'PUPEE', icon: '⚙️' },
  ];

  // Animation phases:
  // 0: Show Payment Org with modules, Trade Org with system map (14 systems)
  // 1: Expand Platform A & Platform B to show their duplicate modules
  // 2: Trade Shared appears, Participation & CIF fly from APAR/TPS to Trade Shared
  // 3: Billing & GL Posting fly from APAR/TPS to Payment
  // 4: Platform B & Platform A collapse, remaining Trade Shared modules appear
  // 5: Final consolidated view

  const isExpanded = phase >= 1 && phase <= 3; // Keep expanded during flying animations
  const showTradeSharedContainer = phase >= 2;
  const showFlyingToTrade = phase === 2; // Modules flying to Trade Shared
  const showFlyingToPayment = phase === 3; // Modules flying to Payment
  const showAllTradeShared = phase >= 4; // All Trade Shared modules visible
  const isConsolidated = phase >= 5;
  const platformsCollapsed = phase >= 4; // APAR/TPS collapse after all modules fly

  // Cycle through highlighted modules during phase 1
  useEffect(() => {
    if (isCapturing) {
      if (phase === 1) setHighlightedModule(0);
      return;
    }

    if (phase === 1) {
      const timer = setInterval(() => {
        setHighlightedModule(prev => (prev + 1) % duplicatedModules.length);
      }, 600);
      return () => clearInterval(timer);
    } else {
      setHighlightedModule(-1);
    }
  }, [phase, duplicatedModules.length, isCapturing]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 lg:p-8 overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4"
      >
        <h2 className="text-xl lg:text-2xl font-bold text-[var(--text-primary)] mb-1">
          {phase === 0 ? 'Trade & WC Duplication' :
           phase === 1 ? 'Trade & WC Duplication' :
           phase === 2 ? 'Moving to Trade Shared' :
           phase === 3 ? 'Moving to Payment Org' :
           phase === 4 ? 'Shared Services Consolidated' :
           'Consolidated Architecture'}
        </h2>
        <p className="text-xs text-[var(--text-secondary)]">
          {phase === 0 ? 'Payment Org & Trade Org with 14 systems' :
           phase === 1 ? 'APAR & Platform A contain duplicate modules' :
           phase === 2 ? 'Participation & CIF → Trade Shared' :
           phase === 3 ? 'Billing & GL Posting → Payment Org' :
           phase === 4 ? '14 Trade Shared + 9 Payment Shared modules' :
           'Clear ownership • Single source of truth'}
        </p>
      </motion.div>

      {/* Main Layout - Side by Side: Payment Org | Trade Org */}
      <div className="flex-1 flex items-start justify-center gap-4 w-full max-w-7xl relative pt-2">

        {/* LEFT: Payment Org */}
        <motion.div
          layout
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-72 flex-shrink-0"
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="rounded-xl p-4 border-2 bg-purple-500/5 border-purple-500/40 h-full">
            {/* Payment Org Header */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">💳</span>
              <p className="text-sm font-bold text-purple-400">Payment Org</p>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 mb-3 inline-block">
              9 Shared Modules
            </span>

            {/* Payment Shared Modules */}
            <div className="space-y-1.5">
              {paymentModules.map((module, i) => {
                const isFlyingIn = showFlyingToPayment && (module.name === 'Billing' || module.name === 'GL Posting');
                const hasArrived = phase >= 4 && (module.name === 'Billing' || module.name === 'GL Posting');
                const flyingIndex = module.name === 'Billing' ? 0 : (module.name === 'GL Posting' ? 1 : -1);

                return (
                  <motion.div
                    key={module.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: 1,
                      scale: isFlyingIn ? [1, 1.1, 1] : 1,
                    }}
                    transition={{
                      delay: isFlyingIn ? 0.8 + flyingIndex * 0.6 : 0.1 + i * 0.03,
                      duration: isFlyingIn ? 1.5 : 0.3,
                    }}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs ${
                      isFlyingIn || hasArrived
                        ? 'bg-green-500/25 border border-green-500/50'
                        : isConsolidated
                          ? 'bg-purple-500/25 border border-purple-500/40'
                          : 'bg-purple-500/15 border border-purple-500/30'
                    }`}
                  >
                    <span className="text-sm">{module.icon}</span>
                    <span className={(isFlyingIn || hasArrived) ? 'text-green-200' : 'text-purple-200'}>{module.name}</span>
                    {(hasArrived || isConsolidated) && <span className="text-green-400 ml-auto text-[10px]">✓</span>}
                  </motion.div>
                );
              })}
            </div>

            {/* Flying indicator */}
            {showFlyingToPayment && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-2 mt-3 text-purple-400"
              >
                <motion.span animate={{ x: [5, -5, 5] }} transition={{ duration: 0.8, repeat: Infinity }}>
                  ←
                </motion.span>
                <span className="text-[10px]">Billing & GL arriving</span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* RIGHT: Trade Org + Trade Shared below */}
        <motion.div
          layout
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 flex flex-col gap-3"
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Trade Org Container */}
          <div className="rounded-xl p-4 border-2 bg-[#00D4FF]/5 border-[#00D4FF]/40">
            {/* Trade Org Header */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xl">🏦</span>
              <p className="text-sm font-bold text-[#00D4FF]">Trade Org</p>
              <span className="text-xs px-2 py-1 rounded-full bg-[#00D4FF]/20 text-[#00D4FF] ml-auto">
                14 Systems
              </span>
            </div>

            {/* Systems & Applications */}
            <div className="rounded-lg border border-gray-600/50 bg-gray-800/20 p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm">📦</span>
                <p className="text-xs font-medium text-gray-400">Systems & Applications</p>
              </div>

              <motion.div layout className="flex flex-wrap gap-2 justify-start">
                {allTradeSystems.map((system, i) => {
                  const shouldExpand = isExpanded && system.highlight && !platformsCollapsed;

                  return (
                    <motion.div
                      key={system.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.02, layout: { duration: 0.4 } }}
                      className={`rounded-lg border overflow-hidden ${
                        system.highlight ? 'bg-gradient-to-br from-white/10 to-white/5' : 'bg-gray-800/50'
                      }`}
                      style={{
                        borderColor: system.highlight ? system.color : '#4B5563',
                        width: shouldExpand ? '180px' : 'auto',
                      }}
                    >
                      <div className={`flex items-center justify-center gap-1.5 ${shouldExpand ? 'p-2 border-b' : 'px-2 py-1.5'}`}
                        style={{ borderColor: shouldExpand ? `${system.color}30` : 'transparent' }}
                      >
                        <span className={`font-semibold whitespace-nowrap ${shouldExpand ? 'text-sm' : 'text-[10px]'}`}
                          style={{ color: system.highlight ? system.color : '#9CA3AF' }}
                        >
                          {system.name}
                        </span>
                        {system.highlight && !shouldExpand && (
                          <motion.div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: system.color }}
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                        )}
                      </div>

                      <AnimatePresence>
                        {shouldExpand && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="px-2 pb-2"
                          >
                            <p className="text-[9px] text-[var(--text-muted)] uppercase mb-1.5 mt-1">
                              {(showFlyingToTrade || showFlyingToPayment) ? 'Moving...' : 'Modules:'}
                            </p>
                            <div className="space-y-1">
                              {duplicatedModules.map((module, mi) => {
                                const isHighlighted = highlightedModule === mi;
                                const shouldFlyNow = (module.destination === 'trade' && showFlyingToTrade) ||
                                                     (module.destination === 'payment' && showFlyingToPayment);
                                const hasFlown = (module.destination === 'trade' && phase >= 3) ||
                                                 (module.destination === 'payment' && phase >= 4);

                                if (hasFlown) return null;

                                return (
                                  <motion.div
                                    key={`${system.id}-${module.name}`}
                                    animate={{
                                      opacity: shouldFlyNow ? [1, 0.5, 0] : 1,
                                      x: shouldFlyNow ? [0, module.destination === 'payment' ? -50 : 0] : 0,
                                      y: shouldFlyNow ? [0, -30] : 0,
                                    }}
                                    transition={{ duration: shouldFlyNow ? 1.5 : 0.3, delay: shouldFlyNow ? mi * 0.3 : 0 }}
                                    className="flex items-center gap-1.5 px-1.5 py-1 rounded text-[10px]"
                                    style={{
                                      backgroundColor: isHighlighted ? `${module.color}35` : `${module.color}15`,
                                      border: `1px solid ${isHighlighted ? module.color : 'transparent'}`,
                                    }}
                                  >
                                    <span className="text-xs">{module.icon}</span>
                                    <span className="text-[var(--text-primary)]">{module.name}</span>
                                    {isHighlighted && (
                                      <span className="ml-auto text-[8px] px-1 py-0.5 rounded bg-red-500/40 text-red-200 font-bold">
                                        DUP
                                      </span>
                                    )}
                                  </motion.div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </motion.div>

              {isConsolidated && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-2 rounded-lg bg-green-500/10 border border-green-500/30 text-center"
                >
                  <p className="text-xs text-green-400">✓ All systems use shared modules</p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Trade Shared - Below Trade Org */}
          <AnimatePresence>
            {showTradeSharedContainer && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                className={`rounded-xl p-4 border-2 ${
                  isConsolidated ? 'bg-green-500/5 border-green-500/40' : 'bg-cyan-500/5 border-cyan-500/40'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl">🔧</span>
                  <p className={`text-sm font-bold ${isConsolidated ? 'text-green-400' : 'text-cyan-400'}`}>
                    Trade Shared
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ml-auto ${
                    isConsolidated ? 'bg-green-500/20 text-green-300' : 'bg-cyan-500/20 text-cyan-300'
                  }`}>
                    {showAllTradeShared ? tradeSharedModules.length : 2} Modules
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(showAllTradeShared ? tradeSharedModules : duplicatedModules.filter(m => m.destination === 'trade')).map((module, i) => (
                    <motion.div
                      key={module.name}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs ${
                        isConsolidated ? 'bg-green-500/20 border border-green-500/30' : 'bg-cyan-500/20 border border-cyan-500/30'
                      }`}
                    >
                      <span className="text-sm">{module.icon}</span>
                      <span className={isConsolidated ? 'text-green-200' : 'text-cyan-200'}>{module.name}</span>
                      {isConsolidated && <span className="text-green-400">✓</span>}
                    </motion.div>
                  ))}
                </div>
                {showFlyingToTrade && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-cyan-400 mt-3 text-center"
                  >
                    ↑ Participation & CIF arriving from systems above
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Right Sidebar - Business & Technical Gains (only in final phase) */}
        <AnimatePresence>
          {isConsolidated && (
            <motion.div
              initial={{ opacity: 0, x: 50, width: 0 }}
              animate={{ opacity: 1, x: 0, width: 'auto' }}
              exit={{ opacity: 0, x: 50, width: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className="flex flex-col gap-3 w-64"
            >
              {/* Business Gains */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[var(--accent-gold)]/10 rounded-xl border border-[var(--accent-gold)]/30 p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">💼</span>
                  <p className="text-xs font-bold text-[var(--accent-gold)]">Business Value</p>
                </div>
                <div className="space-y-2 text-[11px]">
                  <div className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>Faster time-to-market for new products</span>
                  </div>
                  <div className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>Consistent client experience across platforms</span>
                  </div>
                  <div className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>Single source of truth for billing & pricing</span>
                  </div>
                </div>
              </motion.div>

              {/* Technical Gains */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#00D4FF]/10 rounded-xl border border-[#00D4FF]/30 p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">⚙️</span>
                  <p className="text-xs font-bold text-[#00D4FF]">Technical Value</p>
                </div>
                <div className="space-y-2 text-[11px]">
                  <div className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>Reduced code duplication & maintenance</span>
                  </div>
                  <div className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>Shared modules = single codebase to enhance</span>
                  </div>
                  <div className="flex items-start gap-2 text-[var(--text-secondary)]">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>Clear ownership & faster defect resolution</span>
                  </div>
                </div>
              </motion.div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Systems', value: '14', color: 'text-green-400' },
                  { label: 'Trade Shared', value: '14', color: 'text-[#00D4FF]' },
                  { label: 'Payment Shared', value: '9', color: 'text-purple-400' },
                  { label: 'Duplication', value: '0', color: 'text-green-400' },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="bg-[var(--bg-secondary)]/50 rounded-lg border border-gray-700 p-2 text-center"
                  >
                    <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
                    <p className="text-[10px] text-gray-400">{item.label}</p>
                  </motion.div>
                ))}
              </div>
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
    { icon: '👥', label: 'Module C', desc: 'Customer Information', color: '#00D4FF' },
    { icon: '🤝', label: 'Module P', desc: 'Syndication & Distribution', color: '#C9A227' },
    { icon: '💰', label: 'Pricing', desc: 'Dynamic Rate Engine', color: '#10B981' },
    { icon: '🧾', label: 'Billing', desc: 'Revenue Management', color: '#8B5CF6' },
  ];

  // Shared Services
  const sharedServices = [
    { label: 'Document Management', color: '#00D4FF' },
    { label: 'Module C', color: '#C9A227' },
    { label: 'Payments', color: '#10B981' },
    { label: 'Accounting (Ledger)', color: '#8B5CF6' },
  ];

  // Applications utilizing shared services
  const applications = [
    { label: 'Platform B/SCF', desc: 'Payables & Receivables' },
    { label: 'Platform A', desc: 'Trade Processing' },
    { label: 'Unified Frontend', desc: 'Data Conversion' },
    { label: 'Module S', desc: 'Supplier Onboarding' },
    { label: 'Module D', desc: 'Dynamic Discounting' },
  ];

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2000),
      setTimeout(() => setPhase(4), 2800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (phase >= 4 && activeModule < modularComponents.length - 1) {
      const timer = setTimeout(() => {
        setActiveModule(prev => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [phase, activeModule, modularComponents.length]);

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
      case 'journey-overview':
        return <JourneyOverview key={uniqueKey} />;
      case 'architecture-comparison':
        return <ArchitectureComparison key={uniqueKey} />;
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
      case 'engineering-score-journey':
        return <EngineeringScoreJourney key={uniqueKey} />;
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
      case 'elc-architecture':
        return <ELCArchitecture key={uniqueKey} />;
      case 'elc-integration-patterns':
        return <ELCIntegrationPatterns key={uniqueKey} />;
      case 'elc-roadmap':
        return <ELCRoadmap key={uniqueKey} />;
      case 'elc-deliverables-heatmap':
        return <ELCDeliverablesHeatmap key={uniqueKey} />;
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
