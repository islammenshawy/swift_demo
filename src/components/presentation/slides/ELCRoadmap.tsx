'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function ELCRoadmap() {
  const opsItems = [
    { req: 'Foundational Framework', watch: 'Aggregated current tech cost $40 per transaction + overhead cognitive cost' },
    { req: 'Collection Related Changes', watch: 'Increased system complexity' },
    { req: 'Loan Related Changes', watch: 'More $ spent later for modularizing the system as per Product Vision' },
    { req: 'Other Product Related Changes (400 per product avg)', watch: '2027 Mule Elimination - Cost of Mule, API unification' },
    { req: 'Data Lite changes', watch: '2029 Mandatory Oracle Migration → 1700+ tables' },
    { req: 'Maker/Checker STP changes', watch: 'Rework & cross impact to TPS when Common Platform starts' },
    { req: 'Reverse API flows / Screen rebuilds', watch: '' },
  ];

  const elcItems = [
    { feature: 'Fastrack Mode of Transaction Processing', status: 'no', gain: '40% reduction in processing time – agentic tech' },
    { feature: 'Dynamic "Source" & "Panorama" View', status: 'no', gain: '50% increased volume resilience' },
    { feature: 'Confidence score driven human involvement', status: 'partial', gain: 'Operations Future-ready scalability' },
    { feature: 'Data dependency lineage view', status: 'no', gain: 'No rework for Mule Elimination' },
    { feature: 'User edits indicators for checker', status: 'partial', gain: 'Reduced Oracle Migration effort' },
    { feature: 'Auto "Party" data mapping for Decision Engine', status: 'partial', gain: 'API driven Trade & Unified Contract' },
    { feature: 'Proactive sanctions hit notifications', status: 'yes', gain: 'Common components readiness' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'yes': return <span className="text-green-400">✓</span>;
      case 'no': return <span className="text-red-400">✗</span>;
      case 'partial': return <span className="text-yellow-400">◐</span>;
      default: return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-4 pt-8">
      {/* Page Title - Fixed at top */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4"
      >
        <h2 className="text-3xl font-bold text-[var(--text-primary)]">
          Ops End State & Extended Features
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Value Proposition</p>
      </motion.div>

      {/* Table centered in remaining space */}
      <div className="flex-1 flex items-start pt-8">
      <div className="flex gap-4 w-full">
        {/* Left Labels */}
        <div className="flex flex-col justify-start pt-[42px] gap-0 shrink-0 w-[130px]">
        {/* Ops End State Label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="h-[calc(7*36px+40px)] flex flex-col justify-center"
        >
          <div className="bg-gradient-to-br from-[#5D4E37] to-[#4a3f2f] rounded-lg p-3 border border-[var(--accent-gold)]/30">
            <div className="text-sm font-bold text-white leading-tight">Ops End State</div>
            <div className="mt-1 px-2 py-0.5 rounded bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] text-xs font-bold inline-block">
              Part of $3.2m
            </div>
          </div>
        </motion.div>

        {/* ELC Features Label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="h-[calc(7*36px+40px)] flex flex-col justify-center"
        >
          <div className="bg-gradient-to-br from-[#2d5a4a] to-[#234a3a] rounded-lg p-3 border border-emerald-500/30">
            <div className="text-sm font-bold text-white leading-tight">ELC Reimagine</div>
            <div className="text-xs text-emerald-300/80 mt-0.5">Enhanced Features</div>
          </div>
        </motion.div>
      </div>

      {/* Main Table with 3D effect */}
      <motion.div
        initial={{ opacity: 0, rotateX: 5 }}
        animate={{ opacity: 1, rotateX: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="flex-1 overflow-hidden"
        style={{ perspective: '1000px' }}
      >
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, rgba(40,40,50,0.9), rgba(20,20,30,0.95))',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.1)',
            transform: 'translateZ(0)',
          }}
        >
          <table className="w-full text-sm border-collapse">
            {/* Ops End State Section */}
            <thead>
              <tr style={{ background: 'linear-gradient(135deg, #5D4E37 0%, #4a3f2f 100%)' }}>
                <th className="px-3 py-2 text-left font-semibold text-white w-[32%] border-r border-black/30 border-b border-b-black/40">Requirements</th>
                <th className="px-1 py-2 text-center font-semibold text-white w-[3%] border-r border-black/30 border-b border-b-black/40">ELC</th>
                <th className="px-3 py-2 text-left font-semibold text-white border-b border-b-black/40">Watch Items</th>
              </tr>
            </thead>
            <tbody>
              {opsItems.map((item, i) => (
                <motion.tr
                  key={`ops-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="hover:bg-white/5 transition-colors"
                  style={{
                    background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.1)',
                  }}
                >
                  <td className="px-3 py-2 text-[var(--text-primary)] border-b border-r border-gray-700/50">{item.req}</td>
                  <td className="px-1 py-2 text-center border-b border-r border-gray-700/50">
                    <span className="text-green-400 text-base">✓</span>
                  </td>
                  <td className="px-3 py-2 text-[var(--text-secondary)] border-b border-gray-700/50">
                    {item.watch && (
                      <span className="flex items-center gap-1.5">
                        <span className="text-amber-500 text-xs">⚠</span>
                        <span>{item.watch}</span>
                      </span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>

            {/* ELC Enhanced Features Section - Continuous Highlight */}
            <tbody className="relative">
              {/* Shimmer overlay */}
              <tr className="absolute inset-0 pointer-events-none overflow-hidden" style={{ height: '100%' }}>
                <td colSpan={3} className="p-0 relative">
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(16, 185, 129, 0.15) 50%, transparent 100%)',
                      width: '50%',
                    }}
                    animate={{ x: ['-100%', '300%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
                  />
                </td>
              </tr>
            </tbody>
            <thead>
              <tr style={{ background: 'linear-gradient(135deg, #2d5a4a 0%, #234a3a 100%)' }}>
                <th className="px-3 py-2 text-left font-semibold text-white border-r border-black/30 border-b border-b-black/40 relative overflow-hidden">
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                  />
                  <span className="relative flex items-center gap-2">
                    <motion.span
                      animate={{
                        opacity: [1, 0.4, 1],
                        textShadow: ['0 0 0px #10b981', '0 0 10px #10b981', '0 0 0px #10b981']
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-emerald-300"
                    >
                      ★
                    </motion.span>
                    Extended Features
                  </span>
                </th>
                <th className="px-1 py-2 text-center font-semibold text-white border-r border-black/30 border-b border-b-black/40">ELC</th>
                <th className="px-3 py-2 text-left font-semibold text-white border-b border-b-black/40">Strategic Gains & Value Drivers</th>
              </tr>
            </thead>
            <tbody
              style={{
                boxShadow: 'inset 0 0 30px rgba(16, 185, 129, 0.1)',
              }}
            >
              {elcItems.map((item, i) => (
                <motion.tr
                  key={`elc-${i}`}
                  animate={{
                    backgroundColor: [
                      i % 2 === 0 ? 'rgba(16, 185, 129, 0.03)' : 'rgba(16, 185, 129, 0.06)',
                      i % 2 === 0 ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.12)',
                      i % 2 === 0 ? 'rgba(16, 185, 129, 0.03)' : 'rgba(16, 185, 129, 0.06)',
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: 'easeInOut'
                  }}
                  className="relative overflow-hidden"
                >
                  <td className={`px-3 py-2 border-b border-r border-gray-700/50 ${item.status === 'yes' ? 'text-green-400' : 'text-[var(--text-primary)]'}`}>
                    {item.feature}
                  </td>
                  <td className="px-1 py-2 text-center border-b border-r border-gray-700/50">
                    <motion.span
                      className="inline-block"
                      animate={item.status === 'yes' ? {
                        scale: [1, 1.3, 1],
                        filter: ['drop-shadow(0 0 0px #22c55e)', 'drop-shadow(0 0 6px #22c55e)', 'drop-shadow(0 0 0px #22c55e)']
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                    >
                      {getStatusIcon(item.status)}
                    </motion.span>
                  </td>
                  <td className="px-3 py-2 text-[var(--text-secondary)] border-b border-gray-700/50">
                    <span className="flex items-center gap-1.5">
                      <motion.span
                        className="text-emerald-400 text-xs"
                        animate={{
                          x: [0, 5, 0],
                          opacity: [0.6, 1, 0.6]
                        }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.1 }}
                      >
                        →
                      </motion.span>
                      <span>{item.gain}</span>
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
      </div>
      </div>
    </div>
  );
}
