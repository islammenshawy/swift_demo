'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function ELCRoadmap() {
  const features = [
    { name: 'Business Panorama View', opsEndState: 100, elcPrototype: 100 },
    { name: 'Synopsis of the Transaction', opsEndState: 100, elcPrototype: 100 },
    { name: 'Data Source View', opsEndState: 100, elcPrototype: 100 },
    { name: 'Data Entry Drawers', opsEndState: 100, elcPrototype: 100 },
    { name: 'Outputs _ Swifts/Letters', opsEndState: 100, elcPrototype: 100 },
    { name: 'What changed Indicators', opsEndState: 100, elcPrototype: 100 },
    { name: 'Seamless Integration with Trade AI', opsEndState: 100, elcPrototype: 100 },
    { name: 'STP Enabler (configurable)', opsEndState: 100, elcPrototype: 100 },
    { name: 'Classification & Extraction', opsEndState: 100, elcPrototype: 100 },
    { name: 'Decision Engine', opsEndState: 100, elcPrototype: 100 },
    { name: 'Data Integration', opsEndState: 100, elcPrototype: 100 },
    { name: 'Color Coding on TPS (Static/Mapped/Extracted/User input)', opsEndState: 100, elcPrototype: 100 },
    { name: 'Smart Route outs', opsEndState: 100, elcPrototype: 100 },
    { name: 'Actionable Dashboard', opsEndState: 100, elcPrototype: 100 },
    { name: 'Integrated Image Viewer', opsEndState: 100, elcPrototype: 100 },
    { name: 'Data Quality & Completion Scores', opsEndState: 50, elcPrototype: 100 },
    { name: 'Configurable Workflow', opsEndState: 50, elcPrototype: 100 },
    { name: 'User Navigation to any Tab', opsEndState: 50, elcPrototype: 100 },
    { name: 'Enabler for Agentic Processing', opsEndState: 50, elcPrototype: 100 },
    { name: 'Transaction Processing Wall', opsEndState: 0, elcPrototype: 100 },
    { name: 'Fast Track View', opsEndState: 0, elcPrototype: 100 },
    { name: 'SLA Timer clock', opsEndState: 0, elcPrototype: 100 },
    { name: 'Focused User Edits', opsEndState: 0, elcPrototype: 100 },
    { name: 'Data Dependency/Lineage view', opsEndState: 0, elcPrototype: 100 },
    { name: 'Seamless Integration with Template based Decision/Processing', opsEndState: 0, elcPrototype: 100 },
    { name: 'Proactive Sanctions Alerts', opsEndState: 0, elcPrototype: 100 },
    { name: 'Collaborative Maker Checker Interactions', opsEndState: 0, elcPrototype: 100 },
    { name: 'Document Focused - User Review', opsEndState: 0, elcPrototype: 100 },
  ];

  const getScoreColor = (score: number) => {
    if (score === 100) return 'text-green-400';
    if (score === 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score === 100) return 'bg-green-500/20';
    if (score === 50) return 'bg-yellow-500/20';
    return 'bg-red-500/20';
  };

  return (
    <div className="w-full h-full flex flex-col p-3 pt-4">
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-2"
      >
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">
          Ops End State & Extended Features
        </h2>
        <p className="text-xs text-[var(--text-secondary)]">Feature Alignment Comparison</p>
      </motion.div>

      {/* Table with Legend on right */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="flex-1 flex items-center justify-center gap-4"
      >
        <div
          className="rounded-xl overflow-hidden flex-1 max-w-5xl"
          style={{
            background: 'linear-gradient(145deg, rgba(40,40,50,0.9), rgba(20,20,30,0.95))',
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)',
          }}
        >
          <table className="w-full text-[12px] border-collapse">
            <thead>
              <tr style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0f2744 100%)' }}>
                <th className="px-4 py-2.5 text-left font-semibold text-white border-r border-black/30 w-[60%]">Feature</th>
                <th className="px-4 py-2.5 text-center font-semibold text-white border-r border-black/30 w-[20%]">Ops End State</th>
                <th className="px-4 py-2.5 text-center font-semibold text-white w-[20%]">ELC Prototype</th>
              </tr>
            </thead>
            <tbody>
              {features.map((item, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.01 }}
                  className="hover:bg-white/5 transition-colors"
                  style={{
                    background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.1)',
                  }}
                >
                  <td className="px-4 py-1.5 text-[var(--text-primary)] border-b border-r border-gray-700/50">
                    {item.name}
                  </td>
                  <td className="px-4 py-1.5 text-center border-b border-r border-gray-700/50">
                    <span className={`inline-block min-w-[28px] px-1.5 py-0.5 rounded text-xs font-bold ${getScoreColor(item.opsEndState)} ${getScoreBg(item.opsEndState)}`}>
                      {item.opsEndState}
                    </span>
                  </td>
                  <td className="px-4 py-1.5 text-center border-b border-gray-700/50">
                    <span className={`inline-block min-w-[28px] px-1.5 py-0.5 rounded text-xs font-bold ${getScoreColor(item.elcPrototype)} ${getScoreBg(item.elcPrototype)}`}>
                      {item.elcPrototype}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend - vertical on right */}
        <div className="flex flex-col gap-3 p-3 rounded-lg bg-black/20">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="text-xs text-[var(--text-secondary)]">100 - Fully Aligned</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="text-xs text-[var(--text-secondary)]">50 - Partially Aligned</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="text-xs text-[var(--text-secondary)]">0 - Not available</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
