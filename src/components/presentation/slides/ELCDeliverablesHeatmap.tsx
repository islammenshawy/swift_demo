'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function ELCDeliverablesHeatmap() {
  const [phase, setPhase] = useState(0);

  // Requirement Tasks
  const requirementTasks = [
    { name: 'UI Design', weightage: '20%' },
    { name: 'Datapoints Mapping (Direct/Derivation logic + Calculation + Inheritance)', weightage: '80%' },
  ];

  // Column headers - split into Existing Integration and New Features
  const existingIntegration = [
    'CT/Falcon/LLM integration',
    'Actionable Dashboard',
    'WF Routing',
    'User Queue & Txn Monitor',
    'Reporting + Response',
    'Utilities',
    'Source View',
    'Panorama View',
  ];

  const newFeatures = [
    'Smart Imaging Viewer',
    'Data Quality Scores',
    'Maker/Checker Collab',
    'Synopsis of Txn journey',
    'Data Dependency Lineage',
    'SLA timer clock',
    'Smart Route-Outs',
    'Enhanced STP',
    'Template Decisions',
    'Edit Indicators',
    'Data-Lite Screen',
    'Sanction Alerts',
    'Key Summary Board',
  ];

  // Deliverables (rows)
  const deliverables = [
    'Export LC',
    'Import LC',
    'Export LC Presentation',
    'Import LC Presentation',
    'Standby Advising',
    'Standby Issuance',
    'Export Collection',
    'Import Collection',
    'Loans',
  ];

  // Heatmap data - values and colors mapped exactly from image
  const heatmapData: Record<string, (number | string)[]> = {
    'Export LC': [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
    'Import LC': [10, '<5', 100, 5, 55, 15, 20, 20, '<5', '<5', '<5', 5, 30, '<5', '<5', 40, 20, '<5', 20, 10, 10],
    'Export LC Presentation': [90, '<5', 100, 5, 100, 15, 80, 80, '<5', '<5', '<5', 5, 95, '<5', '<5', 100, 100, '<5', 20, 10, 10],
    'Import LC Presentation': [10, '<5', 100, 5, 55, 15, 20, 20, '<5', '<5', '<5', 5, 30, '<5', '<5', 40, 20, '<5', 20, 10, 10],
    'Standby Advising': [90, '<5', 100, 5, 100, 15, 80, 80, '<5', '<5', '<5', 5, 100, '<5', '<5', 100, 100, '<5', 70, 10, 15],
    'Standby Issuance': [10, '<5', 100, 5, 55, 15, 20, 20, '<5', '<5', '<5', 5, 30, '<5', '<5', 40, 20, '<5', 20, 10, 10],
    'Export Collection': [90, '<5', 100, 5, 100, 15, 80, 80, '<5', '<5', '<5', 5, 95, '<5', '<5', 100, 100, '<5', 20, 10, 10],
    'Import Collection': [10, '<5', 100, 5, 55, 15, 20, 20, '<5', '<5', '<5', 5, 30, '<5', '<5', 40, 20, '<5', 20, 10, 10],
    'Loans': [90, '<5', 100, 5, 100, 15, 80, 80, '<5', '<5', '<5', 5, 95, '<5', '<5', 100, 100, '<5', 20, 10, 10],
  };

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 600),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Color mapping - REVERSED: 100 = RED (more work), low = GREEN (less work)
  const getCellBg = (value: number | string) => {
    // Grey for '<5' string
    if (value === '<5') return 'bg-[#6B7280]';

    const v = typeof value === 'number' ? value : 0;

    // RED for high values (80-100) - more work needed
    if (v >= 80) return 'bg-[#F44336]';
    // YELLOW for medium values (30-79)
    if (v >= 30) return 'bg-[#D4A017] text-white';
    // GREEN for low values (<30) - less work needed
    return 'bg-[#4CAF50]';
  };

  const allColumns = [...existingIntegration, ...newFeatures];

  return (
    <div className="w-full h-full flex flex-col pt-12 px-6 pb-4 overflow-hidden">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4"
      >
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">
          ELC Deliverables Coverage
        </h2>
        <p className="text-xs text-[var(--text-secondary)]">
          Feature readiness across trade products
        </p>
      </motion.div>

      {/* Requirement Tasks */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : -10 }}
        className="mb-6 flex justify-center"
      >
        <div className="inline-flex gap-6 px-4 py-2 rounded-lg bg-[var(--bg-secondary)]/50 border border-[var(--text-muted)]/20">
          {requirementTasks.map((task, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs text-[var(--text-muted)]">{task.name}:</span>
              <span className="text-sm font-bold text-[var(--accent-gold)]">{task.weightage}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Main Heatmap */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 2 ? 1 : 0 }}
        className="flex-1 overflow-auto rounded-lg border border-[var(--text-muted)]/30"
      >
        <table className="w-full text-[10px]" style={{ borderSpacing: '2px', borderCollapse: 'separate' }}>
          <thead className="sticky top-0 z-10">
            {/* Category Headers */}
            <tr>
              <th
                className="p-2 text-left rounded sticky left-0 z-20 border border-[var(--text-muted)]/20"
                style={{ backgroundColor: '#0a1628' }}
                rowSpan={2}
              >
                <span className="text-xs font-semibold text-[var(--text-muted)]">Deliverables</span>
              </th>
              <th
                className="bg-[#6B5B45] text-white p-2 text-center rounded-t"
                colSpan={existingIntegration.length}
              >
                <span className="text-xs font-semibold">Existing Integration</span>
              </th>
              <th
                className="bg-[#2E7D4A] text-white p-2 text-center rounded-t"
                colSpan={newFeatures.length}
              >
                <span className="text-xs font-semibold">New Features</span>
              </th>
            </tr>
            {/* Column Headers */}
            <tr>
              {allColumns.map((col, i) => (
                <th
                  key={col}
                  className={`p-1 rounded ${
                    i < existingIntegration.length ? 'bg-[#6B5B45]/40' : 'bg-[#2E7D4A]/40'
                  }`}
                  style={{ minWidth: '36px', maxWidth: '36px', height: '180px' }}
                >
                  <div
                    className="h-full flex items-center justify-center"
                  >
                    <span
                      className="text-[10px] text-white font-semibold leading-tight"
                      style={{
                        writingMode: 'vertical-rl',
                        transform: 'rotate(180deg)',
                        whiteSpace: 'nowrap',
                        textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                      }}
                    >
                      {col}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {deliverables.map((deliverable, rowIndex) => (
              <motion.tr
                key={deliverable}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.03 * rowIndex }}
                className="hover:bg-[var(--bg-secondary)]/20 transition-colors"
              >
                <td
                  className="px-3 py-2 text-[var(--text-primary)] font-medium whitespace-nowrap sticky left-0 z-[5] rounded border border-[var(--text-muted)]/20"
                  style={{ backgroundColor: '#0a1628' }}
                >
                  {deliverable}
                </td>
                {heatmapData[deliverable]?.map((value, colIndex) => (
                  <motion.td
                    key={colIndex}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.01 * colIndex + 0.02 * rowIndex }}
                    className={`text-center text-[11px] font-extrabold text-white rounded ${getCellBg(value)}`}
                    style={{ minWidth: '36px', padding: '6px 2px', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
                  >
                    {value}
                  </motion.td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 10 }}
        className="mt-3 flex items-center justify-center gap-6 text-xs"
      >
        <span className="text-[var(--text-muted)] font-medium">Coverage:</span>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-[#F44336]"></div>
          <span className="text-[var(--text-secondary)]">80-100%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-[#D4A017]"></div>
          <span className="text-[var(--text-secondary)]">30-79%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-[#4CAF50]"></div>
          <span className="text-[var(--text-secondary)]">5-29%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-[#6B7280]"></div>
          <span className="text-[var(--text-secondary)]">&lt;5%</span>
        </div>
      </motion.div>
    </div>
  );
}
