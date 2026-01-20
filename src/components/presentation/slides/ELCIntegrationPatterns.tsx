'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Animation phases for the visualization
const phases = [
  { id: 0, title: 'Frontend Layer', description: 'TENET MFE Architecture with ELC + LLM' },
  { id: 1, title: 'Platform & CDC', description: 'Modern Microservices ↔ CDC ↔ Legacy Java Monolith' },
  { id: 2, title: 'Shared Services', description: 'Independent Services with CIF Dual-Read Pattern' },
  { id: 3, title: 'DevOps', description: 'Kubernetes, Blue/Green, 7 Nines Availability' },
  { id: 4, title: 'Complete Architecture', description: 'Full System Overview - All Layers' },
];

export function ELCIntegrationPatterns() {
  const [activePhase, setActivePhase] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setActivePhase(prev => {
        // Stop at the last phase (Complete)
        if (prev >= phases.length - 1) {
          setAutoPlay(false);
          return prev;
        }
        return prev + 1;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
      className="w-full h-full flex flex-col p-4 overflow-hidden bg-[var(--bg-primary)]"
    >
      {/* Title */}
      <div className="text-center mt-4 mb-6">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">ELC Dependencies & Integration</h2>
        <p className="text-xs text-[var(--text-secondary)] mt-1">Modern Architecture with Legacy Compatibility</p>
      </div>

      {/* Phase Navigation */}
      <div className="flex justify-center gap-2 mb-4">
        {phases.map((phase, i) => (
          <button
            key={phase.id}
            onClick={() => { setActivePhase(i); setAutoPlay(false); }}
            className={`px-3 py-1 rounded text-xs transition-all ${
              activePhase === i
                ? 'bg-[var(--accent-cyan)] text-[var(--bg-primary)] font-semibold'
                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
            }`}
          >
            {phase.title}
          </button>
        ))}
      </div>

      {/* Main SVG Diagram */}
      <div className="flex-1 relative bg-[var(--bg-secondary)] rounded-lg border border-[var(--accent-cyan)]/20 overflow-hidden">
        <svg viewBox="0 15 1100 510" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            {/* Arrow markers */}
            <marker id="arrow-cyan-int" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="#00D4FF" />
            </marker>
            <marker id="arrow-gold-int" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="#C9A227" />
            </marker>
            <marker id="arrow-green-int" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="#4ECDC4" />
            </marker>
            <marker id="arrow-red-int" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="#ef4444" />
            </marker>
            <marker id="arrow-purple" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="#A855F7" />
            </marker>
            <marker id="arrow-white" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="#FFFFFF" />
            </marker>

            {/* Gradients */}
            <linearGradient id="modernGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#4ECDC4" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="legacyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="pgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#336791" />
              <stop offset="100%" stopColor="#1d4a6e" />
            </linearGradient>
            <linearGradient id="oracleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f80000" />
              <stop offset="100%" stopColor="#b30000" />
            </linearGradient>
          </defs>

          {/* ========== FRONTEND LAYER ========== */}
          <motion.g animate={{ opacity: activePhase >= 0 ? 1 : 0.4 }}>
            <rect x="95" y="25" width="965" height="90" rx="8" fill="url(#modernGrad)" stroke="#00D4FF" strokeOpacity={activePhase === 0 || activePhase === 4 ? 0.8 : 0.3} strokeWidth={activePhase === 0 || activePhase === 4 ? 2 : 1} />
            <text x="115" y="48" fill="#00D4FF" fontSize="11" fontWeight="600">FRONTEND - TENET Platform</text>

            {/* MFE Legend - Small, outside boxes */}
            <circle cx="340" cy="43" r="3" fill="none" stroke="#61dafb" strokeWidth="1" />
            <ellipse cx="340" cy="43" rx="5" ry="2" fill="none" stroke="#61dafb" strokeWidth="0.5" />
            <text x="350" y="46" fill="#61dafb" fontSize="6">React MFEs</text>

            {/* MFE - Payments */}
            <rect x="145" y="55" width="70" height="38" rx="4" fill="#0F1F35" stroke="#64748b" strokeWidth="1" />
            <text x="180" y="78" textAnchor="middle" fill="#B4C7E7" fontSize="8">Payments</text>

            {/* MFE - Reports */}
            <rect x="225" y="55" width="70" height="38" rx="4" fill="#0F1F35" stroke="#64748b" strokeWidth="1" />
            <text x="260" y="78" textAnchor="middle" fill="#B4C7E7" fontSize="8">Reports</text>

            {/* MFE - Loan */}
            <rect x="305" y="55" width="70" height="38" rx="4" fill="#0F1F35" stroke="#64748b" strokeWidth="1" />
            <text x="340" y="78" textAnchor="middle" fill="#B4C7E7" fontSize="8">Loan</text>

            {/* ELC MFE - Highlighted */}
            <motion.rect x="385" y="55" width="85" height="38" rx="4" fill="#0F1F35" stroke="#00D4FF" strokeWidth={activePhase === 0 || activePhase === 4 ? 2 : 1} />
            <circle cx="460" cy="63" r="3" fill="none" stroke="#4ECDC4" strokeWidth="1" />
            <circle cx="464" cy="63" r="3" fill="#4ECDC4" />
            <text x="427" y="72" textAnchor="middle" fill="#00D4FF" fontSize="9" fontWeight="600">ELC</text>
            <text x="427" y="84" textAnchor="middle" fill="#4ECDC4" fontSize="5">AI + Workflow</text>

            {/* MFE - Dashboard */}
            <rect x="480" y="55" width="90" height="38" rx="4" fill="#0F1F35" stroke="#64748b" strokeWidth="1" />
            <text x="525" y="72" textAnchor="middle" fill="#B4C7E7" fontSize="7">Actionable</text>
            <text x="525" y="82" textAnchor="middle" fill="#B4C7E7" fontSize="7">Dashboard</text>

            {/* Arrow ELC to Shared Toolkit - from top of ELC box */}
            <path d="M427,55 L427,42 L660,42 L660,55" fill="none" stroke="#C9A227" strokeWidth="1.5" strokeDasharray="4,2" markerEnd="url(#arrow-gold-int)" />

            {/* Shared UI Toolkit (contains LLM) */}
            <rect x="580" y="55" width="160" height="38" rx="4" fill="#0F1F35" stroke="#64748b" strokeWidth="1" />
            <text x="660" y="68" textAnchor="middle" fill="#B4C7E7" fontSize="7">Shared Toolkit</text>

            {/* LLM inside Shared Toolkit */}
            <rect x="590" y="72" width="60" height="16" rx="3" fill="#C9A227" fillOpacity="0.2" stroke="#C9A227" strokeWidth="1" />
            <g transform="translate(595, 74)">
              <circle cx="5" cy="5" r="4" fill="none" stroke="#C9A227" strokeWidth="0.8" />
              <path d="M3,4 Q5,2 7,4 M3,6 Q5,8 7,6" fill="none" stroke="#C9A227" strokeWidth="0.5" />
            </g>
            <text x="635" y="83" textAnchor="middle" fill="#C9A227" fontSize="6" fontWeight="600">LLM</text>

            {/* Design System inside Shared Toolkit */}
            <rect x="660" y="72" width="70" height="16" rx="3" fill="#64748b" fillOpacity="0.2" stroke="#64748b" strokeWidth="1" />
            <g transform="translate(665, 74)">
              <rect x="0" y="0" width="4" height="4" fill="#61dafb" />
              <rect x="5" y="0" width="4" height="4" fill="#4ECDC4" />
              <rect x="0" y="5" width="4" height="4" fill="#C9A227" />
              <rect x="5" y="5" width="4" height="4" fill="#64748b" />
            </g>
            <text x="705" y="83" textAnchor="middle" fill="#64748b" fontSize="5">Design System</text>
          </motion.g>

          {/* ========== MIDDLE LAYER - PLATFORMS WITH EMBEDDED DBs ========== */}
          <motion.g animate={{ opacity: activePhase >= 1 ? 1 : 0.4 }}>
            {/* ===== ELC PLATFORM (After DevOps sidebar) ===== */}
            <rect x="95" y="130" width="395" height="195" rx="8" fill="url(#modernGrad)" stroke="#00D4FF" strokeOpacity={activePhase === 1 || activePhase === 4 ? 0.8 : 0.3} strokeWidth={activePhase === 1 || activePhase === 4 ? 2 : 1} />
            <text x="115" y="148" fill="#00D4FF" fontSize="10" fontWeight="600">ELC PLATFORM</text>

            {/* ===== WORKFLOW ENGINE - HORIZONTAL BAR ===== */}
            <motion.rect
              x="128" y="155" width="350" height="28" rx="4"
              fill="#C9A227"
              fillOpacity="0.15"
              stroke="#C9A227"
              strokeWidth="2"
              animate={{ strokeOpacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <circle cx="468" cy="163" r="4" fill="none" stroke="#4ECDC4" strokeWidth="1" />
            <circle cx="473" cy="163" r="4" fill="#4ECDC4" />
            {/* Workflow orchestration icon */}
            <g transform="translate(138, 162)">
              <rect x="0" y="0" width="10" height="8" rx="1" fill="#C9A227" />
              <path d="M10,4 L16,4" stroke="#C9A227" strokeWidth="1.5" />
              <rect x="16" y="0" width="10" height="8" rx="1" fill="#00D4FF" />
              <path d="M26,4 L32,4" stroke="#00D4FF" strokeWidth="1.5" />
              <rect x="32" y="0" width="10" height="8" rx="1" fill="#4ECDC4" />
              <path d="M42,4 L48,4" stroke="#4ECDC4" strokeWidth="1.5" />
              <rect x="48" y="0" width="10" height="8" rx="1" fill="#C9A227" />
            </g>
            <text x="303" y="173" textAnchor="middle" fill="#C9A227" fontSize="9" fontWeight="700">WORKFLOW ENGINE</text>

            {/* ===== API GATEWAY - Horizontal Bar under Workflow ===== */}
            <rect x="128" y="188" width="350" height="22" rx="4" fill="#4ECDC4" fillOpacity="0.1" stroke="#4ECDC4" strokeWidth="1.5" />
            <g transform="translate(138, 192)">
              <rect x="0" y="2" width="10" height="8" rx="2" fill="none" stroke="#4ECDC4" strokeWidth="1" />
              <line x1="3" y1="2" x2="3" y2="10" stroke="#4ECDC4" strokeWidth="0.5" />
              <line x1="7" y1="2" x2="7" y2="10" stroke="#4ECDC4" strokeWidth="0.5" />
            </g>
            <text x="303" y="202" textAnchor="middle" fill="#4ECDC4" fontSize="8" fontWeight="700">API GATEWAY</text>
            <text x="420" y="202" textAnchor="middle" fill="#B4C7E7" fontSize="6">Rate Limiting • Auth • Routing</text>

            {/* ===== APPLICATION BOXES ROW ===== */}
            <text x="133" y="222" fill="#00D4FF" fontSize="7" fontWeight="600">Applications</text>

            {/* ELC App */}
            <rect x="128" y="227" width="60" height="28" rx="3" fill="#0F1F35" stroke="#4ECDC4" strokeWidth="1" />
            <circle cx="178" cy="233" r="3" fill="none" stroke="#4ECDC4" strokeWidth="1" />
            <circle cx="182" cy="233" r="3" fill="#4ECDC4" />
            <text x="158" y="240" textAnchor="middle" fill="#4ECDC4" fontSize="7" fontWeight="600">ELC</text>
            <text x="158" y="250" textAnchor="middle" fill="#B4C7E7" fontSize="5">AI Powered</text>

            {/* Ingestion App */}
            <rect x="198" y="227" width="60" height="28" rx="3" fill="#0F1F35" stroke="#00D4FF" strokeWidth="1" />
            <text x="228" y="240" textAnchor="middle" fill="#00D4FF" fontSize="7" fontWeight="600">Ingestion</text>
            <text x="228" y="250" textAnchor="middle" fill="#B4C7E7" fontSize="5">Data Import</text>

            {/* Transaction App */}
            <rect x="268" y="227" width="60" height="28" rx="3" fill="#0F1F35" stroke="#00D4FF" strokeWidth="1" />
            <text x="298" y="240" textAnchor="middle" fill="#00D4FF" fontSize="7" fontWeight="600">Transaction</text>
            <text x="298" y="250" textAnchor="middle" fill="#B4C7E7" fontSize="5">Processing</text>

            {/* Notification App */}
            <rect x="338" y="227" width="60" height="28" rx="3" fill="#0F1F35" stroke="#00D4FF" strokeWidth="1" />
            <text x="368" y="240" textAnchor="middle" fill="#00D4FF" fontSize="7" fontWeight="600">Notify</text>
            <text x="368" y="250" textAnchor="middle" fill="#B4C7E7" fontSize="5">Alerts</text>

            {/* Connection lines from Apps up to Gateway */}
            <path d="M158,227 L158,210" fill="none" stroke="#4ECDC4" strokeWidth="1" strokeDasharray="2,2" />
            <path d="M228,227 L228,210" fill="none" stroke="#4ECDC4" strokeWidth="1" strokeDasharray="2,2" />
            <path d="M298,227 L298,210" fill="none" stroke="#4ECDC4" strokeWidth="1" strokeDasharray="2,2" />
            <path d="M368,227 L368,210" fill="none" stroke="#4ECDC4" strokeWidth="1" strokeDasharray="2,2" />

            {/* ===== EXTERNAL LLM - Outside ELC Platform, bottom left ===== */}
            <motion.g
              animate={{ opacity: activePhase === 1 || activePhase === 4 ? 1 : 0.6 }}
            >
              {/* External LLM Box */}
              <motion.rect
                x="95" y="345" width="75" height="38" rx="6"
                fill="#A855F7"
                fillOpacity="0.15"
                stroke="#A855F7"
                strokeWidth="2"
                animate={{
                  strokeOpacity: [0.6, 1, 0.6],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              {/* Brain/AI icon animation */}
              <motion.g transform="translate(100, 350)">
                <motion.circle
                  cx="12" cy="12" r="10"
                  fill="none"
                  stroke="#A855F7"
                  strokeWidth="1.5"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                {/* Neural network dots */}
                <motion.circle cx="8" cy="9" r="2" fill="#A855F7" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0 }} />
                <motion.circle cx="16" cy="9" r="2" fill="#A855F7" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }} />
                <motion.circle cx="12" cy="16" r="2" fill="#A855F7" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }} />
                {/* Connection lines between dots */}
                <path d="M8,9 L16,9 M12,9 L12,16 M8,9 L12,16 M16,9 L12,16" stroke="#A855F7" strokeWidth="0.8" opacity="0.5" />
              </motion.g>
              <text x="145" y="361" textAnchor="middle" fill="#A855F7" fontSize="7" fontWeight="700">External</text>
              <text x="145" y="373" textAnchor="middle" fill="#A855F7" fontSize="8" fontWeight="800">LLM</text>

              {/* Arrow from ELC App down to External LLM */}
              <motion.path
                d="M128,241 L110,241 L110,330 L132,330 L132,345"
                fill="none"
                stroke="#A855F7"
                strokeWidth="1.5"
                strokeDasharray="4,2"
                markerEnd="url(#arrow-purple)"
                animate={{ strokeDashoffset: [0, -12] }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </motion.g>

            {/* ===== DATABASES ROW ===== */}

            {/* DB Group Box - CDC connects here */}
            <motion.rect
              x="123" y="268" width="215" height="52" rx="4"
              fill="#C9A227" fillOpacity="0.05"
              stroke="#C9A227" strokeWidth="2"
              animate={{ strokeOpacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <text x="231" y="265" textAnchor="middle" fill="#C9A227" fontSize="6" fontWeight="700">DB Layer (CDC Source)</text>

            {/* ELC DB with pgvector - PostgreSQL */}
            <g transform="translate(128, 275)">
              <ellipse cx="28" cy="5" rx="25" ry="6" fill="url(#pgGrad)" />
              <rect x="3" y="5" width="50" height="25" fill="url(#pgGrad)" />
              <ellipse cx="28" cy="30" rx="25" ry="6" fill="#1d4a6e" />
              <ellipse cx="28" cy="5" rx="25" ry="6" fill="none" stroke="#4ECDC4" strokeWidth="1" />
              <text x="28" y="17" textAnchor="middle" fill="#fff" fontSize="5" fontWeight="600">elc_db</text>
              <text x="28" y="26" textAnchor="middle" fill="#4ECDC4" fontSize="4">pgvector</text>
            </g>
            {/* Connection line */}
            <path d="M158,255 L158,275" fill="none" stroke="#4ECDC4" strokeWidth="1" markerEnd="url(#arrow-green-int)" />

            {/* Ingestion DB - MongoDB */}
            <g transform="translate(198, 275)">
              <ellipse cx="28" cy="5" rx="25" ry="6" fill="#4DB33D" />
              <rect x="3" y="5" width="50" height="25" fill="#4DB33D" />
              <ellipse cx="28" cy="30" rx="25" ry="6" fill="#3A8C2E" />
              <ellipse cx="28" cy="5" rx="25" ry="6" fill="none" stroke="#6FCF5A" strokeWidth="1" />
              <text x="28" y="17" textAnchor="middle" fill="#fff" fontSize="5" fontWeight="600">ingestion</text>
              <text x="28" y="26" textAnchor="middle" fill="#C8F7C0" fontSize="4">MongoDB</text>
            </g>
            {/* Connection line */}
            <path d="M228,255 L228,275" fill="none" stroke="#4DB33D" strokeWidth="1" markerEnd="url(#arrow-green-int)" />

            {/* Transaction DB - PostgreSQL */}
            <g transform="translate(268, 275)">
              <ellipse cx="28" cy="5" rx="25" ry="6" fill="url(#pgGrad)" />
              <rect x="3" y="5" width="50" height="25" fill="url(#pgGrad)" />
              <ellipse cx="28" cy="30" rx="25" ry="6" fill="#1d4a6e" />
              <ellipse cx="28" cy="5" rx="25" ry="6" fill="none" stroke="#4db8ff" strokeWidth="1" />
              <text x="28" y="17" textAnchor="middle" fill="#fff" fontSize="5" fontWeight="600">txn_db</text>
              <text x="28" y="26" textAnchor="middle" fill="#a3d9ff" fontSize="4">PostgreSQL</text>
            </g>
            {/* Connection line */}
            <path d="M298,255 L298,275" fill="none" stroke="#4db8ff" strokeWidth="1" markerEnd="url(#arrow-cyan-int)" />

            {/* Kafka - Notify uses for events (to the right of Notify) */}
            <g transform="translate(408, 212)">
              <rect x="0" y="0" width="55" height="32" rx="4" fill="#0F1F35" stroke="#C9A227" strokeWidth="1.5" />
              {/* Pub/Sub icon - arrows in/out */}
              <g transform="translate(5, 6)">
                <rect x="4" y="4" width="10" height="10" rx="2" fill="#C9A227" fillOpacity="0.3" stroke="#C9A227" strokeWidth="1" />
                <path d="M0,9 L4,9" stroke="#C9A227" strokeWidth="1" markerEnd="url(#arrow-gold-int)" />
                <path d="M14,6 L18,6" stroke="#C9A227" strokeWidth="1" markerEnd="url(#arrow-gold-int)" />
                <path d="M14,12 L18,12" stroke="#C9A227" strokeWidth="1" markerEnd="url(#arrow-gold-int)" />
              </g>
              <text x="38" y="14" textAnchor="middle" fill="#C9A227" fontSize="6" fontWeight="700">Kafka</text>
              <text x="38" y="24" textAnchor="middle" fill="#B4C7E7" fontSize="5">Pub/Sub</text>
            </g>
            {/* Connection line - Notify to Kafka (horizontal) */}
            <path d="M398,241 L408,228" fill="none" stroke="#C9A227" strokeWidth="1" markerEnd="url(#arrow-gold-int)" />

            {/* GemFire Cache - under Kafka, above CDC arrows */}
            <g transform="translate(408, 247)">
              <rect x="0" y="0" width="55" height="22" rx="3" fill="#0F1F35" stroke="#6DB33F" strokeWidth="1" />
              <g transform="translate(4, 4)">
                <polygon points="6,0 12,4 12,10 6,14 0,10 0,4" fill="none" stroke="#6DB33F" strokeWidth="1" />
              </g>
              <text x="38" y="10" textAnchor="middle" fill="#6DB33F" fontSize="5" fontWeight="600">GemFire</text>
              <text x="38" y="18" textAnchor="middle" fill="#B4C7E7" fontSize="4">Cache</text>
            </g>

            {/* ===== CDC - CENTRALIZED ===== */}
            <motion.rect
              x="500" y="130" width="120" height="195" rx="8"
              fill="#C9A227"
              fillOpacity="0.15"
              stroke="#C9A227"
              strokeWidth="3"
              animate={{ strokeOpacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {/* CDC Header Badge */}
            <motion.rect
              x="515" y="120" width="90" height="24" rx="12"
              fill="#C9A227"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <text x="560" y="136" textAnchor="middle" fill="#0A1628" fontSize="11" fontWeight="800">CDC</text>
            <text x="560" y="158" textAnchor="middle" fill="#C9A227" fontSize="7">Change Data Capture</text>
            <text x="560" y="170" textAnchor="middle" fill="#B4C7E7" fontSize="6">Real-time Sync</text>

            {/* Kafka Connect icon */}
            <g transform="translate(515, 180)">
              <rect x="0" y="0" width="90" height="45" rx="4" fill="#0F1F35" stroke="#00D4FF" strokeWidth="1.5" />
              {/* CDC streaming icon */}
              <g transform="translate(5, 10)">
                <circle cx="10" cy="10" r="8" fill="none" stroke="#00D4FF" strokeWidth="1.5" />
                <path d="M7,10 L13,10 M10,7 L10,13" stroke="#00D4FF" strokeWidth="1.5" />
                <motion.circle
                  cx="10" cy="10" r="12"
                  fill="none"
                  stroke="#C9A227"
                  strokeWidth="1"
                  strokeDasharray="4,3"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  style={{ transformOrigin: "10px 10px" }}
                />
              </g>
              <text x="55" y="18" textAnchor="middle" fill="#00D4FF" fontSize="7" fontWeight="700">Kafka</text>
              <text x="55" y="30" textAnchor="middle" fill="#B4C7E7" fontSize="6">Connect</text>
            </g>

            {/* Debezium / Oracle GoldenGate */}
            <g transform="translate(515, 235)">
              <rect x="0" y="0" width="90" height="40" rx="4" fill="#0F1F35" stroke="#C9A227" strokeWidth="1.5" />
              {/* Log icon */}
              <g transform="translate(5, 10)">
                <rect x="0" y="2" width="16" height="12" rx="2" fill="none" stroke="#C9A227" strokeWidth="1" />
                <path d="M3,7 L13,7 M3,10 L10,10" stroke="#C9A227" strokeWidth="1" />
              </g>
              <text x="55" y="16" textAnchor="middle" fill="#C9A227" fontSize="6" fontWeight="700">Debezium /</text>
              <text x="55" y="26" textAnchor="middle" fill="#C9A227" fontSize="6" fontWeight="700">GoldenGate</text>
              <text x="55" y="36" textAnchor="middle" fill="#B4C7E7" fontSize="5">Log-based CDC</text>
            </g>

            {/* Data Sync Status */}
            <g transform="translate(515, 285)">
              <rect x="0" y="0" width="90" height="30" rx="4" fill="#0F1F35" stroke="#4ECDC4" strokeWidth="1" />
              <motion.circle
                cx="18" cy="15" r="6"
                fill="#4ECDC4"
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <text x="55" y="12" textAnchor="middle" fill="#4ECDC4" fontSize="7" fontWeight="600">LIVE</text>
              <text x="55" y="22" textAnchor="middle" fill="#B4C7E7" fontSize="5">Bi-directional</text>
            </g>

            {/* Bidirectional arrows - connecting DB Group to CDC to Oracle (dashed with animation) */}
            {/* DB Group to CDC */}
            <motion.path
              d="M338,300 L500,300"
              fill="none" stroke="#C9A227" strokeWidth="1.5" strokeDasharray="6,3"
              markerEnd="url(#arrow-gold-int)"
              animate={{ strokeDashoffset: [0, -18] }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.path
              d="M500,290 L338,290"
              fill="none" stroke="#C9A227" strokeWidth="1.5" strokeDasharray="6,3"
              markerEnd="url(#arrow-gold-int)"
              animate={{ strokeDashoffset: [0, 18] }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            {/* CDC to Oracle */}
            <motion.path
              d="M620,290 L710,290"
              fill="none" stroke="#C9A227" strokeWidth="1.5" strokeDasharray="6,3"
              markerEnd="url(#arrow-gold-int)"
              animate={{ strokeDashoffset: [0, -18] }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.path
              d="M710,300 L620,300"
              fill="none" stroke="#C9A227" strokeWidth="1.5" strokeDasharray="6,3"
              markerEnd="url(#arrow-gold-int)"
              animate={{ strokeDashoffset: [0, 18] }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />

            {/* ===== TPS MONOLITH (Right) ===== */}
            <rect x="650" y="130" width="410" height="195" rx="8" fill="url(#legacyGrad)" stroke="#ef4444" strokeOpacity={activePhase === 1 || activePhase === 4 ? 0.8 : 0.3} strokeWidth={activePhase === 1 || activePhase === 4 ? 2 : 1} />
            <text x="670" y="153" fill="#ef4444" fontSize="11" fontWeight="600">TPS (Monolith)</text>

            {/* ===== MULESOFT - HORIZONTAL BAR ===== */}
            <motion.rect
              x="668" y="160" width="380" height="28" rx="4"
              fill="#00A1E0"
              fillOpacity="0.15"
              stroke="#00A1E0"
              strokeWidth="2"
              animate={{ strokeOpacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {/* MuleSoft M Logo */}
            <g transform="translate(678, 166)">
              <circle cx="10" cy="8" r="8" fill="#00A1E0" fillOpacity="0.3" stroke="#00A1E0" strokeWidth="1.5" />
              <text x="10" y="12" textAnchor="middle" fill="#00A1E0" fontSize="10" fontWeight="800">M</text>
            </g>
            <text x="780" y="178" textAnchor="middle" fill="#00A1E0" fontSize="9" fontWeight="700">MuleSoft Layer</text>

            {/* Mule ESB inside MuleSoft Layer */}
            <rect x="900" y="164" width="90" height="20" rx="3" fill="#0F1F35" stroke="#f97316" strokeWidth="1" />
            <g transform="translate(908, 167)">
              <ellipse cx="7" cy="6" rx="5" ry="4" fill="none" stroke="#f97316" strokeWidth="1" />
              <circle cx="5" cy="5" r="1.5" fill="#f97316" />
              <circle cx="9" cy="5" r="1.5" fill="#f97316" />
            </g>
            <text x="955" y="177" textAnchor="middle" fill="#f97316" fontSize="7" fontWeight="600">Mule ESB</text>

            {/* TPS Core */}
            <rect x="710" y="205" width="100" height="35" rx="4" fill="#0F1F35" stroke="#ef4444" strokeWidth="1" strokeDasharray="4,2" />
            {/* Java icon */}
            <g transform="translate(718, 210)">
              <text x="8" y="12" fill="#ef4444" fontSize="10" fontWeight="700">J</text>
              <path d="M14,3 Q17,6 14,9" fill="none" stroke="#ef4444" strokeWidth="1" />
            </g>
            <text x="760" y="230" textAnchor="middle" fill="#ef4444" fontSize="8" fontWeight="600">TPS Core</text>

            {/* Arrow from TPS Core to MuleSoft Layer */}
            <path d="M760,205 L760,188" fill="none" stroke="#00A1E0" strokeWidth="1.5" markerEnd="url(#arrow-cyan-int)" />

            {/* Oracle Database - Embedded - SINGLE DB FOR ALL */}
            <g transform="translate(710, 260)">
              <ellipse cx="70" cy="6" rx="65" ry="8" fill="url(#oracleGrad)" />
              <rect x="5" y="6" width="130" height="35" fill="url(#oracleGrad)" />
              <ellipse cx="70" cy="41" rx="65" ry="8" fill="#800000" />
              <ellipse cx="70" cy="6" rx="65" ry="8" fill="none" stroke="#ff6666" strokeWidth="1.5" />
              <text x="70" y="22" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="800">ORACLE</text>
              <text x="70" y="34" textAnchor="middle" fill="#ffcccc" fontSize="6">Single DB for All</text>
            </g>

            {/* Batch Jobs */}
            <g transform="translate(920, 250)">
              <rect x="0" y="0" width="80" height="35" rx="4" fill="#0F1F35" stroke="#9333ea" strokeWidth="1.5" />
              {/* Clock icon */}
              <g transform="translate(8, 7)">
                <circle cx="10" cy="10" r="8" fill="none" stroke="#9333ea" strokeWidth="1.5" />
                <path d="M10,5 L10,10 L13,12" fill="none" stroke="#9333ea" strokeWidth="1.5" strokeLinecap="round" />
              </g>
              <text x="50" y="15" textAnchor="middle" fill="#9333ea" fontSize="7" fontWeight="700">Batch</text>
              <text x="50" y="26" textAnchor="middle" fill="#9333ea" fontSize="7" fontWeight="700">Jobs</text>
            </g>

            {/* Warning: Tight Coupling */}
            <g transform="translate(910, 295)">
              <rect x="0" y="0" width="100" height="24" rx="4" fill="#ef4444" fillOpacity="0.2" stroke="#ef4444" strokeWidth="1" />
              <text x="50" y="10" textAnchor="middle" fill="#ef4444" fontSize="6" fontWeight="700">TIGHT COUPLING</text>
              <text x="50" y="19" textAnchor="middle" fill="#ef4444" fontSize="5">Shared DB Anti-pattern</text>
            </g>

            {/* TPS Core to Oracle */}
            <path d="M760,240 L780,260" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="3,2" markerEnd="url(#arrow-red-int)" />
            {/* Connection from Batch Jobs to Oracle */}
            <path d="M920,270 L840,270" fill="none" stroke="#9333ea" strokeWidth="1.5" strokeDasharray="3,2" markerEnd="url(#arrow-red-int)" />
          </motion.g>

          {/* ========== MIGRATION PATTERN HIGHLIGHT - FLOATING OVERLAY ========== */}
          <motion.g
            animate={{
              opacity: activePhase === 2 || activePhase === 4 ? 1 : 0.15,
              scale: activePhase === 2 || activePhase === 4 ? 1 : 0.98,
            }}
            transition={{ duration: 0.5 }}
          >
            {/* Migration Pattern Box - Compact */}
            <motion.rect
              x="180" y="340" width="220" height="70" rx="6"
              fill="#0A1628"
              stroke="#C9A227"
              strokeWidth="2"
              animate={{
                strokeOpacity: [0.5, 1, 0.5],
                filter: activePhase === 2 || activePhase === 4 ? ['drop-shadow(0 0 3px #C9A227)', 'drop-shadow(0 0 8px #C9A227)', 'drop-shadow(0 0 3px #C9A227)'] : 'none'
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Title - CIF Migration */}
            <motion.g
              animate={{ y: activePhase === 2 || activePhase === 4 ? [0, -1, 0] : 0 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <rect x="200" y="332" width="180" height="18" rx="3" fill="#C9A227" />
              <text x="290" y="344" textAnchor="middle" fill="#0A1628" fontSize="8" fontWeight="800">MIGRATION PATTERN (CIF)</text>
            </motion.g>

            {/* Step 1: Read Modern */}
            <g transform="translate(190, 355)">
              <motion.circle
                cx="10" cy="10" r="8"
                fill="#00D4FF"
                fillOpacity="0.2"
                stroke="#00D4FF"
                strokeWidth="1.5"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
              />
              <text x="10" y="13" textAnchor="middle" fill="#00D4FF" fontSize="8" fontWeight="800">1</text>
              <text x="25" y="8" fill="#00D4FF" fontSize="6" fontWeight="600">Read CIF (Modern DB)</text>
              <text x="25" y="16" fill="#B4C7E7" fontSize="5">PostgreSQL first</text>
            </g>

            {/* Step 2: Fallback TPS */}
            <g transform="translate(190, 378)">
              <motion.circle
                cx="10" cy="10" r="8"
                fill="#ef4444"
                fillOpacity="0.2"
                stroke="#ef4444"
                strokeWidth="1.5"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              />
              <text x="10" y="13" textAnchor="middle" fill="#ef4444" fontSize="8" fontWeight="800">2</text>
              <text x="25" y="8" fill="#ef4444" fontSize="6" fontWeight="600">Call TPS API</text>
              <text x="25" y="16" fill="#B4C7E7" fontSize="5">If not migrated</text>
            </g>

            {/* Arrow showing flow */}
            <motion.path
              d="M290,368 L290,380"
              fill="none"
              stroke="#C9A227"
              strokeWidth="1.5"
              markerEnd="url(#arrow-gold-int)"
              animate={{ strokeDashoffset: [0, -8] }}
              transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
              strokeDasharray="4,2"
            />

            {/* Arrow from CIF to Migration Pattern */}
            <motion.path
              d="M140,468 L140,410 L180,410"
              fill="none"
              stroke="#C9A227"
              strokeWidth="1.5"
              markerEnd="url(#arrow-gold-int)"
              animate={{ strokeDashoffset: [0, -10] }}
              transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
              strokeDasharray="6,3"
            />
            <text x="100" y="435" fill="#C9A227" fontSize="5" fontWeight="600">CIF → Migration</text>

            {/* Fallback arrow from Migration Pattern to TPS outer box (API Call) */}
            <motion.path
              d="M400,375 L760,375 L760,325"
              fill="none"
              stroke="#ef4444"
              strokeWidth="1.5"
              strokeDasharray="6,3"
              markerEnd="url(#arrow-red-int)"
              animate={{ strokeDashoffset: [0, -12] }}
              transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
            />

            {/* API Call highlight badge */}
            <g>
              <rect x="550" y="355" width="70" height="20" rx="10" fill="#ef4444" />
              <text x="585" y="368" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="700">API CALL</text>
            </g>

            {/* Future Cut Scissors - on the API call to TPS */}
            <g transform="translate(470, 362)">
              <text x="0" y="0" fill="#ef4444" fontSize="14">✂</text>
              <text x="16" y="0" fill="#ef4444" fontSize="6" fontWeight="700">Future Cut</text>
            </g>
          </motion.g>

          {/* ========== SHARED SERVICES ========== */}
          <motion.g animate={{ opacity: activePhase >= 2 ? 1 : 0.4 }}>
            <rect x="95" y="440" width="965" height="75" rx="8" fill="url(#modernGrad)" stroke="#C9A227" strokeOpacity={activePhase === 2 || activePhase === 4 ? 0.8 : 0.3} strokeWidth={activePhase === 2 || activePhase === 4 ? 2 : 1} />
            <text x="115" y="460" fill="#C9A227" fontSize="11" fontWeight="600">SHARED SERVICES - Independent</text>

            {/* Highlight: Each with own DB */}
            <motion.rect
              x="300" y="447" width="110" height="16" rx="3"
              fill="#336791"
              fillOpacity="0.3"
              stroke="#336791"
              strokeWidth="1"
              animate={{ fillOpacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <g transform="translate(305, 450)">
              <ellipse cx="5" cy="4" rx="4" ry="3" fill="#336791" />
              <rect x="1" y="4" width="8" height="6" fill="#336791" />
              <ellipse cx="5" cy="10" rx="4" ry="2" fill="#1d4a6e" />
            </g>
            <text x="360" y="459" textAnchor="middle" fill="#a3d9ff" fontSize="8" fontWeight="700">Each with own DB</text>

            {/* CIF Service - MAIN FOCUS */}
            <motion.rect
              x="110" y="468" width="130" height="40" rx="4"
              fill="#0F1F35"
              stroke="#ef4444"
              strokeWidth="2"
              animate={{ strokeOpacity: activePhase === 2 || activePhase === 4 ? [0.5, 1, 0.5] : 0.5 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            {/* Customer icon */}
            <g transform="translate(120, 472)">
              <circle cx="8" cy="5" r="4" fill="none" stroke="#ef4444" strokeWidth="1" />
              <path d="M2,14 Q8,10 14,14" fill="none" stroke="#ef4444" strokeWidth="1" />
            </g>
            <text x="175" y="485" textAnchor="middle" fill="#ef4444" fontSize="9" fontWeight="700">CIF</text>
            <text x="175" y="497" textAnchor="middle" fill="#C9A227" fontSize="6">Migrating</text>
            {/* CIF DB indicator */}
            <g transform="translate(210, 482)">
              <ellipse cx="8" cy="3" rx="7" ry="4" fill="#336791" />
              <rect x="1" y="3" width="14" height="10" fill="#336791" />
              <ellipse cx="8" cy="13" rx="7" ry="3" fill="#1d4a6e" />
              <text x="8" y="10" textAnchor="middle" fill="#fff" fontSize="4">PG</text>
            </g>

            {/* Participation Service */}
            <rect x="260" y="468" width="130" height="40" rx="4" fill="#0F1F35" stroke="#4ECDC4" strokeWidth="1" />
            <text x="325" y="488" textAnchor="middle" fill="#4ECDC4" fontSize="9" fontWeight="600">Participation</text>
            <text x="325" y="500" textAnchor="middle" fill="#4ECDC4" fontSize="6">Own DB</text>
            {/* Payments DB indicator */}
            <g transform="translate(360, 482)">
              <ellipse cx="8" cy="3" rx="7" ry="4" fill="#336791" />
              <rect x="1" y="3" width="14" height="10" fill="#336791" />
              <ellipse cx="8" cy="13" rx="7" ry="3" fill="#1d4a6e" />
              <text x="8" y="10" textAnchor="middle" fill="#fff" fontSize="4">PG</text>
            </g>

            {/* Billing Service */}
            <rect x="410" y="468" width="130" height="40" rx="4" fill="#0F1F35" stroke="#4ECDC4" strokeWidth="1" />
            <text x="475" y="488" textAnchor="middle" fill="#4ECDC4" fontSize="9" fontWeight="600">Billing</text>
            <text x="475" y="500" textAnchor="middle" fill="#4ECDC4" fontSize="6">Own DB</text>
            {/* Billing DB indicator */}
            <g transform="translate(510, 482)">
              <ellipse cx="8" cy="3" rx="7" ry="4" fill="#336791" />
              <rect x="1" y="3" width="14" height="10" fill="#336791" />
              <ellipse cx="8" cy="13" rx="7" ry="3" fill="#1d4a6e" />
              <text x="8" y="10" textAnchor="middle" fill="#fff" fontSize="4">PG</text>
            </g>

            {/* Decoupling Status - Compact */}
            <rect x="560" y="455" width="200" height="55" rx="8" fill="#0F1F35" stroke="#C9A227" strokeWidth="1" />
            <text x="660" y="472" textAnchor="middle" fill="#C9A227" fontSize="8" fontWeight="700">DECOUPLING STATUS</text>
            <g transform="translate(580, 478)">
              <circle cx="5" cy="5" r="3" fill="#4ECDC4" />
              <text x="12" y="8" fill="#4ECDC4" fontSize="6">Participation, Billing: Complete</text>
            </g>
            <g transform="translate(580, 492)">
              <circle cx="5" cy="5" r="3" fill="#ef4444" />
              <text x="12" y="8" fill="#ef4444" fontSize="6">CIF: In Migration (Dual-Read)</text>
            </g>

            {/* Architecture highlight */}
            <motion.rect
              x="780" y="455" width="270" height="55" rx="8"
              fill="#00D4FF"
              fillOpacity="0.1"
              stroke="#00D4FF"
              strokeWidth="1"
              animate={{ strokeOpacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <text x="915" y="472" textAnchor="middle" fill="#00D4FF" fontSize="8" fontWeight="700">DB-PER-SERVICE PATTERN</text>
            <text x="915" y="485" textAnchor="middle" fill="#B4C7E7" fontSize="6">No shared database</text>
            <text x="915" y="497" textAnchor="middle" fill="#B4C7E7" fontSize="6">Full service isolation</text>
          </motion.g>

          {/* ========== DEVOPS - LEFT SIDEBAR (spans TENET + ELC + Shared Services) ========== */}
          <motion.g animate={{ opacity: activePhase >= 3 ? 1 : 0.4 }}>
            <rect x="5" y="25" width="85" height="490" rx="8" fill="#0F1F35" stroke="#4ECDC4" strokeOpacity={activePhase === 3 || activePhase === 4 ? 0.8 : 0.3} strokeWidth={activePhase === 3 || activePhase === 4 ? 2 : 1} />
            <text x="47" y="45" textAnchor="middle" fill="#4ECDC4" fontSize="9" fontWeight="700">DEVOPS</text>

            {/* CI/CD */}
            <g transform="translate(15, 55)">
              <circle cx="8" cy="8" r="6" fill="#4ECDC4" fillOpacity="0.3" stroke="#4ECDC4" strokeWidth="1" />
              <circle cx="8" cy="8" r="3" fill="#4ECDC4" />
              <text x="32" y="12" textAnchor="middle" fill="#4ECDC4" fontSize="7" fontWeight="600">CI/CD</text>
            </g>

            {/* Blue/Green */}
            <g transform="translate(15, 85)">
              <rect x="0" y="0" width="28" height="16" rx="3" fill="#3b82f6" fillOpacity="0.3" stroke="#3b82f6" strokeWidth="1" />
              <text x="14" y="11" textAnchor="middle" fill="#3b82f6" fontSize="5" fontWeight="700">Blue</text>
              <rect x="32" y="0" width="28" height="16" rx="3" fill="#22c55e" fillOpacity="0.3" stroke="#22c55e" strokeWidth="1" />
              <text x="46" y="11" textAnchor="middle" fill="#22c55e" fontSize="5" fontWeight="700">Green</text>
            </g>

            {/* Kubernetes */}
            <g transform="translate(15, 110)">
              <circle cx="8" cy="8" r="6" fill="none" stroke="#326ce5" strokeWidth="1" />
              <path d="M8,3 L8,13 M4,5 L12,11 M4,11 L12,5" fill="none" stroke="#326ce5" strokeWidth="0.5" />
              <text x="20" y="12" fill="#326ce5" fontSize="6" fontWeight="600">K8s</text>
            </g>

            {/* Terraform */}
            <g transform="translate(15, 135)">
              <rect x="0" y="2" width="5" height="9" fill="#7b42bc" />
              <rect x="6" y="0" width="5" height="9" fill="#7b42bc" />
              <text x="18" y="11" fill="#7b42bc" fontSize="6" fontWeight="600">Terraform</text>
            </g>

            {/* 7 Nines Badge */}
            <motion.rect
              x="12" y="160" width="66" height="28" rx="14"
              fill="#4ECDC4"
              fillOpacity="0.15"
              stroke="#4ECDC4"
              strokeWidth="2"
              animate={{ scale: activePhase === 3 || activePhase === 4 ? [1, 1.03, 1] : 1 }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <text x="45" y="173" textAnchor="middle" fill="#4ECDC4" fontSize="7" fontWeight="800">99.99999%</text>
            <text x="45" y="183" textAnchor="middle" fill="#4ECDC4" fontSize="5">7 Nines</text>

            {/* Monitoring - Splunk */}
            <g transform="translate(15, 198)">
              <rect x="0" y="0" width="14" height="10" rx="1" fill="none" stroke="#4ECDC4" strokeWidth="1" />
              <path d="M2,5 L4,3 L8,7 L12,2" fill="none" stroke="#4ECDC4" strokeWidth="0.8" />
              <text x="20" y="9" fill="#4ECDC4" fontSize="6" fontWeight="600">Splunk</text>
            </g>

            {/* GitOps */}
            <g transform="translate(15, 242)">
              <circle cx="7" cy="7" r="5" fill="none" stroke="#F1502F" strokeWidth="1" />
              <text x="18" y="11" fill="#F1502F" fontSize="6" fontWeight="600">GitOps</text>
            </g>

            {/* PagerDuty */}
            <g transform="translate(15, 264)">
              <rect x="0" y="0" width="14" height="14" rx="2" fill="#06AC38" fillOpacity="0.3" stroke="#06AC38" strokeWidth="1" />
              <text x="7" y="11" textAnchor="middle" fill="#06AC38" fontSize="8" fontWeight="800">P</text>
              <text x="20" y="11" fill="#06AC38" fontSize="5" fontWeight="600">PagerDuty</text>
            </g>

            {/* Prometheus */}
            <g transform="translate(15, 288)">
              <circle cx="7" cy="7" r="5" fill="none" stroke="#E6522C" strokeWidth="1" />
              <circle cx="7" cy="7" r="2" fill="#E6522C" />
              <text x="18" y="11" fill="#E6522C" fontSize="5" fontWeight="600">Prometheus</text>
            </g>

            {/* Grafana */}
            <g transform="translate(15, 310)">
              <circle cx="7" cy="7" r="5" fill="#F46800" fillOpacity="0.3" stroke="#F46800" strokeWidth="1" />
              <circle cx="7" cy="7" r="2" fill="#F46800" />
              <text x="18" y="11" fill="#F46800" fontSize="6" fontWeight="600">Grafana</text>
            </g>

          </motion.g>

          {/* ========== VERTICAL CONNECTORS ========== */}
          <motion.g animate={{ opacity: activePhase >= 0 ? 1 : 0.4 }}>
            {/* Frontend ELC MFE to ELC Platform outer box - from bottom of MFE, above TENET boundary */}
            <motion.path
              d="M427,93 L427,114 L230,114 L230,130"
              fill="none"
              stroke="#00D4FF"
              strokeWidth="1.5"
              markerEnd="url(#arrow-cyan-int)"
              animate={{ strokeOpacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <text x="320" y="111" fill="#00D4FF" fontSize="5" fontWeight="600">ELC MFE → Platform</text>
          </motion.g>
          <motion.g animate={{ opacity: activePhase >= 1 ? 0.6 : 0.2 }}>
            {/* ELC Platform to Shared Services - main architecture flow */}
            <path d="M290,325 L290,440" fill="none" stroke="#00D4FF" strokeWidth="1.5" markerEnd="url(#arrow-cyan-int)" />
            <text x="300" y="385" fill="#00D4FF" fontSize="6">Services</text>
          </motion.g>

          {/* ========== LEGEND ========== */}
          <rect x="820" y="45" width="230" height="68" rx="4" fill="#0A1628" stroke="#00D4FF" strokeOpacity="0.3" />
          <text x="935" y="60" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="600">Legend</text>

          {/* Row 1 */}
          <circle cx="833" cy="75" r="4" fill="none" stroke="#4ECDC4" strokeWidth="1" />
          <circle cx="838" cy="75" r="4" fill="#4ECDC4" />
          <text x="848" y="78" fill="#fff" fontSize="7">AI Powered</text>

          <line x1="920" y1="75" x2="935" y2="75" stroke="#00D4FF" strokeWidth="2" />
          <text x="943" y="78" fill="#fff" fontSize="7">Modern</text>

          <line x1="990" y1="75" x2="1005" y2="75" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,2" />
          <text x="1013" y="78" fill="#fff" fontSize="7">Legacy</text>

          {/* Row 2 */}
          <motion.circle cx="835" cy="95" r="3" fill="#C9A227" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity }} />
          <text x="848" y="98" fill="#fff" fontSize="7">CDC Sync</text>

          <rect x="918" y="90" width="20" height="10" rx="2" fill="none" stroke="#00D4FF" strokeWidth="1" />
          <text x="943" y="98" fill="#fff" fontSize="7">Kafka</text>

          <text x="990" y="98" fill="#ef4444" fontSize="8">✂</text>
          <text x="1002" y="98" fill="#fff" fontSize="7">Future Cut</text>
        </svg>
      </div>

      {/* Phase Description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activePhase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-2 text-center"
        >
          <p className="text-sm text-[var(--accent-cyan)] font-semibold">{phases[activePhase].title}</p>
          <p className="text-xs text-[var(--text-secondary)]">{phases[activePhase].description}</p>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

export default ELCIntegrationPatterns;
