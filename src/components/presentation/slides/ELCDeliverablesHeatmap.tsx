'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function ELCDeliverablesHeatmap() {
  const [phase, setPhase] = useState(0);

  // Column headers - split into three groups based on the image
  const userNavigationWall = [
    'Transaction Processing Wall',
    'Business Panorama View',
    'Synopsis of the Transaction',
    'Data Source View',
    'Fast Track View',
    'Data Quality & Completion Scores',
    'SLA Timer clock',
    'Actionable Dashboard',
    'User Navigation to any Tab',
  ];

  const focusedDataEntry = [
    'Data Dependency/Lineage view',
    'Data Entry Drawers - Product',
    'Pricing & Accounting',
    'Document Output & Swifts',
    'Compliance/TBML',
    'Data Integration',
    'Focused User Edits',
    'Color Coding on TPS',
    'Proactive Sanctions Alerts',
    'What changed Indicators',
    'Collaborative Maker Checker Interactions',
  ];

  const integratedExperience = [
    'Integrated Image Viewer',
    'Decision Engine',
    'Seamless Integration with Trade AI',
    'Classification & Extraction',
    'Document Focused - User Review',
    'Seamless Integration with Template based',
    'STP Enabler (configurable)',
    'Smart Route outs',
    'Configurable Workflow',
    'Enabler for Agentic Processing',
  ];

  // Deliverables (rows)
  const deliverables = [
    'Export LC',
    'Import LC',
    'Export LC Presentation',
    'Import LC Presentation',
    'Standby Issuance',
    'Standby Advising',
    'Standby Issuance Draw',
    'Standby Advising Draw',
    'Export Collection',
    'Import Collection',
    'Loans',
    'Reimbursement Authority',
    'Reimbursement Claim',
    'Transfer LC',
    'Transfer LC Presentation',
    'Bank Release',
    'Periodic Payment',
  ];

  // Heatmap data from image - values mapped by row
  const heatmapData: Record<string, (number | string)[]> = {
    'Export LC': [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
    'Import LC': [20, 20, 15, 40, 35, 20, 20, 20, 20, 30, 30, 30, 30, 30, 20, 40, 30, 30, 30, 20, 20, 20, 20, 40, 20, 20, 20, 20, 20, 20],
    'Export LC Presentation': [30, 30, 15, 70, 45, 20, 20, 30, 20, 80, 80, 70, 70, 70, 30, 15, 30, 30, 30, 15, 15, 100, 15, 15, 70, 15, 15, 15, 15, 15],
    'Import LC Presentation': [15, 20, 10, 30, 30, 20, 20, 20, 20, 30, 30, 30, 30, 30, 30, 15, 30, 15, 15, 15, 30, 15, 15, 15, 15, 15, 15, 15, 15, 15],
    'Standby Issuance': [20, 30, 10, 30, 35, 20, 20, 20, 20, 70, 70, 40, 60, 80, 30, 15, 30, 15, 15, 30, 100, 15, 15, 40, 15, 15, 15, 15, 15, 15],
    'Standby Advising': [15, 15, 15, 20, 30, 20, 20, 20, 30, 30, 30, 30, 30, 15, 30, 15, 30, 15, 15, 30, 30, 15, 40, 15, 15, 15, 15, 15, 15, 15],
    'Standby Issuance Draw': [20, 15, 15, 30, 35, 20, 20, 20, 70, 70, 30, 30, 15, 70, 30, 15, 30, 15, 15, 30, 30, 80, 15, 15, 15, 15, 15, 15, 15, 15],
    'Standby Advising Draw': [15, 15, 10, 20, 30, 20, 20, 20, 30, 30, 30, 80, 15, 30, 30, 15, 15, 15, 15, 30, 20, 15, 15, 15, 15, 15, 15, 15, 15, 15],
    'Export Collection': [20, 15, 15, 30, 35, 20, 20, 20, 70, 70, 20, 20, 15, 30, 30, 15, 15, 15, 15, 30, 60, 15, 15, 15, 15, 15, 30, 30, 15, 15],
    'Import Collection': [15, 15, 15, 20, 30, 20, 20, 10, 30, 30, 30, 20, 15, 15, 30, 15, 10, 15, 15, 30, 20, 15, 15, 15, 15, 15, 15, 15, 15, 15],
    'Loans': [15, 15, 10, 30, 30, 20, 20, 10, 30, 70, 70, 30, 15, 30, 30, 15, 15, 15, 15, 30, 60, 15, 15, 15, 15, 15, 20, 15, 15, 15],
    'Reimbursement Authority': [15, 15, 15, 20, 30, 20, 20, 10, 20, 70, 20, 70, 15, 60, 30, 15, 15, 15, 15, 30, 30, 100, 15, 15, 15, 15, 15, 15, 15, 15],
    'Reimbursement Claim': [15, 15, 10, 20, 30, 20, 20, 10, 20, 60, 60, 20, 40, 15, 40, 15, 15, 15, 15, 30, 30, 80, 15, 15, 15, 15, 15, 15, 15, 15],
    'Transfer LC': [15, 15, 15, 20, 30, 20, 20, 10, 30, 30, 30, 20, 15, 20, 30, 15, 10, 15, 15, 30, 20, 15, 15, 15, 15, 15, 15, 15, 15, 15],
    'Transfer LC Presentation': [15, 15, 10, 20, 30, 20, 20, 10, 30, 30, 30, 20, 15, 20, 30, 15, 15, 20, 15, 30, 20, 15, 15, 15, 15, 15, 15, 15, 15, 15],
    'Bank Release': [15, 15, 10, 20, 30, 20, 20, 10, 20, 30, 30, 30, 20, 30, 30, 15, 20, 15, 15, 30, 20, 15, 15, 15, 15, 15, 15, 15, 15, 15],
    'Periodic Payment': [15, 15, 10, 20, 30, 20, 20, 10, 20, 70, 70, 30, 20, 30, 30, 15, 15, 15, 15, 30, 20, 15, 15, 15, 15, 15, 30, 15, 15, 15],
  };

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 600),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Color mapping with gradients within ranges
  const getCellStyle = (value: number | string): { backgroundColor: string; color: string } => {
    const v = typeof value === 'number' ? value : 0;

    // Very light green for values <= 5 (special case - distinct color)
    if (value === '<5' || v <= 5) return { backgroundColor: '#E8F5E9', color: '#1a1a1a' };

    // Helper to interpolate between two colors
    const interpolateColor = (color1: number[], color2: number[], factor: number) => {
      const r = Math.round(color1[0] + (color2[0] - color1[0]) * factor);
      const g = Math.round(color1[1] + (color2[1] - color1[1]) * factor);
      const b = Math.round(color1[2] + (color2[2] - color1[2]) * factor);
      return `rgb(${r}, ${g}, ${b})`;
    };

    // Red range (71-100): Light red to dark red
    if (v >= 71) {
      const factor = (v - 71) / 29; // 0 at 71, 1 at 100
      const lightRed = [255, 205, 210]; // #FFCDD2
      const darkRed = [198, 40, 40];    // #C62828
      return { backgroundColor: interpolateColor(lightRed, darkRed, factor), color: factor > 0.3 ? 'white' : '#1a1a1a' };
    }

    // Amber range (40-70): Light amber to dark amber
    if (v >= 40) {
      const factor = (v - 40) / 30; // 0 at 40, 1 at 70
      const lightAmber = [255, 224, 130]; // #FFE082
      const darkAmber = [245, 124, 0];    // #F57C00
      return { backgroundColor: interpolateColor(lightAmber, darkAmber, factor), color: factor > 0.5 ? 'white' : '#1a1a1a' };
    }

    // Green range (6-39): Dark green to light green (lower numbers = darker green)
    const factor = Math.max(0, (v - 6) / 33); // 0 at 6, 1 at 39
    const darkGreen = [46, 125, 50];    // #2E7D32
    const lightGreen = [200, 230, 201]; // #C8E6C9
    return { backgroundColor: interpolateColor(darkGreen, lightGreen, factor), color: factor < 0.5 ? 'white' : '#1a1a1a' };
  };

  const allColumns = [...userNavigationWall, ...focusedDataEntry, ...integratedExperience];

  return (
    <div className="w-full h-full flex flex-col pt-10 px-4 pb-3 overflow-hidden">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-3"
      >
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">
          ELC Deliverables Coverage
        </h2>
        <p className="text-xs text-[var(--text-secondary)]">
          Feature readiness across trade products
        </p>
      </motion.div>

      {/* Main Heatmap */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 ? 1 : 0 }}
        className="flex-1 overflow-auto rounded-lg border border-[var(--text-muted)]/30"
      >
        <table className="w-full text-[8px]" style={{ borderSpacing: '1px', borderCollapse: 'separate' }}>
          <thead className="sticky top-0 z-10">
            {/* Category Headers */}
            <tr>
              <th
                className="p-2 text-left rounded sticky left-0 z-20 border border-white/20"
                style={{ backgroundColor: '#1a2744', minWidth: '140px' }}
                rowSpan={2}
              >
                <span className="text-[11px] font-bold text-white">Product & Features</span>
              </th>
              <th
                className="bg-[#6B5B45] text-white p-1 text-center rounded-t"
                colSpan={userNavigationWall.length}
              >
                <span className="text-[9px] font-semibold">User Navigation Wall</span>
              </th>
              <th
                className="bg-[#2E7D4A] text-white p-1 text-center rounded-t"
                colSpan={focusedDataEntry.length}
              >
                <span className="text-[9px] font-semibold">Focused Data Entry</span>
              </th>
              <th
                className="bg-[#1E88E5] text-white p-1 text-center rounded-t"
                colSpan={integratedExperience.length}
              >
                <span className="text-[9px] font-semibold">Integrated Experience</span>
              </th>
            </tr>
            {/* Column Headers */}
            <tr>
              {allColumns.map((col, i) => {
                let bgClass = 'bg-[#6B5B45]/40';
                if (i >= userNavigationWall.length && i < userNavigationWall.length + focusedDataEntry.length) {
                  bgClass = 'bg-[#2E7D4A]/40';
                } else if (i >= userNavigationWall.length + focusedDataEntry.length) {
                  bgClass = 'bg-[#1E88E5]/40';
                }
                return (
                  <th
                    key={col}
                    className={`p-0.5 rounded ${bgClass}`}
                    style={{ minWidth: '28px', maxWidth: '28px', height: '140px' }}
                  >
                    <div className="h-full flex items-center justify-center">
                      <span
                        className="text-[8px] text-white font-bold leading-tight"
                        style={{
                          writingMode: 'vertical-rl',
                          transform: 'rotate(180deg)',
                          whiteSpace: 'nowrap',
                          textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                        }}
                      >
                        {col}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {deliverables.map((deliverable, rowIndex) => (
              <motion.tr
                key={deliverable}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.02 * rowIndex }}
                className="hover:bg-[var(--bg-secondary)]/20 transition-colors"
              >
                <td
                  className="px-3 py-1.5 text-white font-semibold whitespace-nowrap sticky left-0 z-[5] rounded border border-white/20"
                  style={{ backgroundColor: '#1a2744', fontSize: '10px', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                >
                  {deliverable}
                </td>
                {heatmapData[deliverable]?.map((value, colIndex) => {
                  const cellStyle = getCellStyle(value);
                  return (
                    <motion.td
                      key={colIndex}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.005 * colIndex + 0.01 * rowIndex }}
                      className="text-center text-[8px] font-bold rounded"
                      style={{
                        minWidth: '28px',
                        padding: '3px 1px',
                        backgroundColor: cellStyle.backgroundColor,
                        color: cellStyle.color,
                        textShadow: cellStyle.color === 'white' ? '0 1px 2px rgba(0,0,0,0.3)' : 'none'
                      }}
                    >
                      {value}
                    </motion.td>
                  );
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 10 }}
        className="mt-2 flex items-center justify-center gap-4 text-xs"
      >
        <span className="text-[var(--text-muted)] font-medium">Coverage:</span>
        <div className="flex items-center gap-1">
          <div className="w-12 h-4 rounded" style={{ background: 'linear-gradient(to right, #FFCDD2, #C62828)' }}></div>
          <span className="text-[var(--text-secondary)]">71-100%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-12 h-4 rounded" style={{ background: 'linear-gradient(to right, #FFE082, #F57C00)' }}></div>
          <span className="text-[var(--text-secondary)]">40-70%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-12 h-4 rounded" style={{ background: 'linear-gradient(to right, #2E7D32, #C8E6C9)' }}></div>
          <span className="text-[var(--text-secondary)]">6-39%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#E8F5E9' }}></div>
          <span className="text-[var(--text-secondary)]">≤5%</span>
        </div>
      </motion.div>
    </div>
  );
}
