/**
 * ELC Architecture Visualization Configuration
 * PlantUML-style config: define components, connections, and notes
 */

export const elcArchitectureConfig = {
  title: 'ELC Reimagined Architecture',
  subtitle: 'Maker-Checker Pattern with AI Augmentation',

  transactionStates: {
    current: ['Pre-Registration', 'Registration', 'Data Input', 'Authorize', 'Pre-release', 'System Release'],
    proposed: ['Registration', 'Booking', 'Review', 'Release'],
  },

  // Lanes (columns)
  lanes: [
    { id: 'system-maker', label: 'System As Maker', icon: '🤖' },
    { id: 'human-maker', label: 'Human Maker', icon: '👤' },
    { id: 'system-checker', label: 'System As Checker', icon: '🔍' },
    { id: 'human-checker', label: 'Human Checker', icon: '👤' },
  ],

  // Rows (layers)
  rows: [
    { id: 'registration', label: 'Registration Module' },
    { id: 'extraction', label: 'Extraction & Decision Engine' },
    { id: 'booking', label: 'Booking Engine' },
    { id: 'services', label: 'Common Services' },
  ],

  // Components - positioned by row and relative x,y within row
  components: [
    // ========== REGISTRATION ROW ==========
    { id: 'start', type: 'start', label: 'Start', row: 'registration', lane: 'system-maker', x: 0, y: 0 },
    { id: 'auto-reg', type: 'process', label: 'Auto Registration', row: 'registration', lane: 'system-maker', x: 1, y: 0 },
    { id: 'manual-reg', type: 'process', label: 'Manual Registration', row: 'registration', lane: 'human-maker', x: 0, y: 0 },

    // ========== EXTRACTION ROW - SYSTEM MAKER ==========
    { id: 'class-extract-sm', type: 'ai-group', label: '• Classification\n• Extraction', row: 'extraction', lane: 'system-maker', x: 0, y: 0,
      children: [
        { id: 'doc-class-sm', label: 'Doc Classification' },
        { id: 'data-extract-sm', label: 'Data Extraction' },
      ]
    },
    { id: 'sanctions-sm', type: 'check', label: 'Sanctions', row: 'extraction', lane: 'system-maker', x: 1, y: 0 },
    { id: 'doc-check-sm', type: 'check', label: 'Doc check', row: 'extraction', lane: 'system-maker', x: 2, y: 0 },
    { id: 'tbml-sm', type: 'check', label: 'TBML', row: 'extraction', lane: 'system-maker', x: 3, y: 0 },
    { id: 'other-checks-sm', type: 'check', label: 'Other checks', row: 'extraction', lane: 'system-maker', x: 4, y: 0 },

    // ========== EXTRACTION ROW - HUMAN MAKER ==========
    { id: 'class-extract-hm', type: 'ai-group', label: '• Classification\n• Extraction', row: 'extraction', lane: 'human-maker', x: 0, y: 1,
      children: [
        { id: 'doc-class-hm', label: 'Doc Classification' },
        { id: 'data-extract-hm', label: 'Data Extraction' },
      ]
    },
    { id: 'sanctions-hm', type: 'check', label: 'Sanctions', row: 'extraction', lane: 'human-maker', x: 1, y: 0, flow: 'vertical' },
    { id: 'doc-check-hm', type: 'check', label: 'Doc check', row: 'extraction', lane: 'human-maker', x: 1, y: 1, flow: 'vertical' },
    { id: 'tbml-hm', type: 'check', label: 'TBML', row: 'extraction', lane: 'human-maker', x: 1, y: 2, flow: 'vertical' },
    { id: 'other-checks-hm', type: 'check', label: 'Other checks', row: 'extraction', lane: 'human-maker', x: 1, y: 3, flow: 'vertical' },

    // ========== EXTRACTION ROW - SYSTEM CHECKER ==========
    { id: 'class-extract-sc', type: 'ai-group', label: '• Classification\n• Extraction', row: 'extraction', lane: 'system-checker', x: 0, y: 0,
      children: [
        { id: 'doc-class-sc', label: 'Doc Classification' },
        { id: 'data-extract-sc', label: 'Data Extraction' },
      ]
    },

    // ========== EXTRACTION ROW - HUMAN CHECKER ==========
    { id: 'sanctions-hc', type: 'check', label: 'Sanctions', row: 'extraction', lane: 'human-checker', x: 0, y: 0, flow: 'vertical' },
    { id: 'doc-check-hc', type: 'check', label: 'Doc check', row: 'extraction', lane: 'human-checker', x: 0, y: 1, flow: 'vertical' },
    { id: 'tbml-hc', type: 'check', label: 'TBML', row: 'extraction', lane: 'human-checker', x: 0, y: 2, flow: 'vertical' },
    { id: 'other-checks-hc', type: 'check', label: 'Other checks', row: 'extraction', lane: 'human-checker', x: 0, y: 3, flow: 'vertical' },

    // ========== BOOKING ROW - SYSTEM MAKER ==========
    { id: 'party-mapper', type: 'process', label: 'System Party Data\nMapper', row: 'booking', lane: 'system-maker', x: 0, y: 0 },
    { id: 'fields-mapped', type: 'decision', label: 'All required\nfields mapped', row: 'booking', lane: 'system-maker', x: 1, y: 0 },
    { id: 'agentic-maker', type: 'ai', label: 'Agentic Maker\nBooking & Data\nAugmentation', row: 'booking', lane: 'system-maker', x: 2, y: 0 },
    { id: 'accuracy-sm', type: 'decision', label: 'Accuracy less\nthan threshold', row: 'booking', lane: 'system-maker', x: 3, y: 0 },
    { id: 'release-workflow', type: 'process', label: 'Release Workflow', row: 'booking', lane: 'system-checker', x: 1, y: 0 },
    { id: 'release-end', type: 'end', label: 'Release/End', row: 'booking', lane: 'human-checker', x: 0, y: 0 },

    // ========== BOOKING ROW - HUMAN MAKER ==========
    { id: 'party-input', type: 'process', label: 'Party Data Input/\nData Lite Screen', row: 'booking', lane: 'human-maker', x: 0, y: 1 },
    { id: 'manual-validation', type: 'process', label: 'Manual Validation &\nBooking', row: 'booking', lane: 'human-maker', x: 1, y: 1 },
    { id: 'manual-checker-req', type: 'decision', label: 'Manual checker\nrequired', row: 'booking', lane: 'human-maker', x: 2, y: 1 },

    // ========== BOOKING ROW - SYSTEM CHECKER ==========
    { id: 'agentic-checker', type: 'ai', label: 'Agentic Checker', row: 'booking', lane: 'system-checker', x: 0, y: 0 },
    { id: 'accuracy-sc', type: 'decision', label: 'Accuracy less\nthan threshold', row: 'booking', lane: 'system-checker', x: 0, y: 1 },
    { id: 'approve-reject', type: 'decision', label: 'Approve/Reject', row: 'booking', lane: 'system-checker', x: 0, y: 2 },

    // ========== BOOKING ROW - HUMAN CHECKER ==========
    { id: 'manual-checker', type: 'process', label: 'Manual Checker', row: 'booking', lane: 'human-checker', x: 0, y: 1 },
    { id: 'decision', type: 'decision', label: 'Decision', row: 'booking', lane: 'human-checker', x: 1, y: 1 },

    // ========== COMMON SERVICES ==========
    { id: 'cif', type: 'service', label: 'CIF Module', row: 'services', lane: 'system-maker', x: 0, y: 0 },
    { id: 'kyc', type: 'service', label: 'KYC', row: 'services', lane: 'system-maker', x: 1, y: 0 },
    { id: 'sanctions-module', type: 'service', label: 'Sanctions /\nCompliance', row: 'services', lane: 'system-maker', x: 2, y: 0 },
    { id: 'payments', type: 'service', label: 'Payments', row: 'services', lane: 'human-maker', x: 0, y: 0 },
    { id: 'trade-apis', type: 'service', label: 'Trade APIs', row: 'services', lane: 'human-maker', x: 1, y: 0 },
  ],

  // Connections (arrows between components)
  connections: [
    // Registration flow
    { from: 'start', to: 'auto-reg', type: 'solid' },
    { from: 'auto-reg', to: 'manual-reg', type: 'solid', label: 'Failure', labelColor: 'red' },
    { from: 'auto-reg', to: 'class-extract-sm', type: 'solid', label: 'Success', labelColor: 'green', direction: 'down' },
    { from: 'manual-reg', to: 'class-extract-hm', type: 'solid', label: 'Done', labelColor: 'green', direction: 'down' },

    // Extraction - System Maker (horizontal)
    { from: 'sanctions-sm', to: 'doc-check-sm', type: 'solid' },
    { from: 'doc-check-sm', to: 'tbml-sm', type: 'solid' },
    { from: 'tbml-sm', to: 'other-checks-sm', type: 'solid' },

    // Extraction - Human Maker (vertical)
    { from: 'sanctions-hm', to: 'doc-check-hm', type: 'solid', direction: 'down' },
    { from: 'doc-check-hm', to: 'tbml-hm', type: 'solid', direction: 'down' },
    { from: 'tbml-hm', to: 'other-checks-hm', type: 'solid', direction: 'down' },
    { from: 'other-checks-hm', to: 'manual-validation', type: 'dashed', label: 'Embedded', direction: 'down' },

    // Extraction - Human Checker (vertical)
    { from: 'sanctions-hc', to: 'doc-check-hc', type: 'solid', direction: 'down' },
    { from: 'doc-check-hc', to: 'tbml-hc', type: 'solid', direction: 'down' },
    { from: 'tbml-hc', to: 'other-checks-hc', type: 'solid', direction: 'down' },
    { from: 'other-checks-hc', to: 'manual-checker', type: 'dashed', label: 'Embedded', direction: 'down' },

    // System Checker extraction to booking
    { from: 'class-extract-sc', to: 'agentic-checker', type: 'dashed', label: 'Embedded', direction: 'down' },

    // Booking - System Maker flow
    { from: 'cif', to: 'party-mapper', type: 'solid', direction: 'up' },
    { from: 'party-mapper', to: 'fields-mapped', type: 'solid' },
    { from: 'fields-mapped', to: 'agentic-maker', type: 'solid', label: 'Yes', labelColor: 'green' },
    { from: 'fields-mapped', to: 'party-input', type: 'solid', label: 'No', labelColor: 'red', direction: 'down' },
    { from: 'agentic-maker', to: 'accuracy-sm', type: 'solid' },
    { from: 'accuracy-sm', to: 'release-workflow', type: 'solid', label: 'No', labelColor: 'red' },
    { from: 'accuracy-sm', to: 'party-input', type: 'solid', label: 'Yes', labelColor: 'green', direction: 'down' },
    { from: 'release-workflow', to: 'release-end', type: 'solid' },

    // Booking - Human Maker flow
    { from: 'party-input', to: 'manual-validation', type: 'solid' },
    { from: 'manual-validation', to: 'manual-checker-req', type: 'solid' },
    { from: 'manual-checker-req', to: 'agentic-checker', type: 'solid', label: 'No', labelColor: 'red', direction: 'up' },
    { from: 'manual-checker-req', to: 'manual-checker', type: 'solid', label: 'Yes', labelColor: 'green' },

    // Booking - System Checker flow
    { from: 'agentic-checker', to: 'accuracy-sc', type: 'solid', direction: 'down' },
    { from: 'accuracy-sc', to: 'manual-checker', type: 'solid', label: 'Yes', labelColor: 'green' },
    { from: 'accuracy-sc', to: 'approve-reject', type: 'solid', label: 'No', labelColor: 'red', direction: 'down' },
    { from: 'approve-reject', to: 'release-workflow', type: 'solid', label: 'Approve', labelColor: 'green', direction: 'up' },
    { from: 'approve-reject', to: 'agentic-maker', type: 'dashed', label: 'Reject', labelColor: 'gray', direction: 'loop' },

    // Booking - Human Checker flow
    { from: 'manual-checker', to: 'decision', type: 'solid' },
  ],

  // Notes (yellow sticky notes)
  notes: [
    { attachTo: 'doc-check-sm', position: 'below', lines: ['Rules Review', 'Discrepancy Checks', 'Consistency Checks', 'Full Doc Check'] },
    { attachTo: 'tbml-sm', position: 'below', lines: ['DUO', 'HRG (UK Only)', 'Vessel Check', 'BL Tracking'] },
    { attachTo: 'other-checks-sm', position: 'below', lines: ['Boycott', 'Emerging Risk'] },
    { attachTo: 'other-checks-sm', position: 'right', lines: ['Manual Review →', 'Mandatory manual', 'review needed'], highlight: true },
    { attachTo: 'agentic-maker', position: 'below', lines: ['CALL FOR ACTION', 'Reimagined Screens'], highlight: true },
    { attachTo: 'manual-checker-req', position: 'right', lines: ['For High value', 'transactions & basis', 'CIF standing,', 'mandatory/2nd level', 'of review needed'] },
    { attachTo: 'other-checks-hc', position: 'right', lines: ['Read only Extraction', 'and validation data will', 'be embedded on TPS', 'screen'] },
    { attachTo: 'approve-reject', position: 'right', lines: ['Rejection Remarks', 'act as feedback for', 'Agentic Maker'] },
  ],

  // Styling
  styles: {
    types: {
      start: { bg: 'transparent', border: '#4ECDC4', text: '#4ECDC4', shape: 'oval' },
      end: { bg: 'transparent', border: '#C9A227', text: '#C9A227', shape: 'oval' },
      process: { bg: '#0F1F35', border: '#00D4FF', text: '#FFFFFF', shape: 'rect' },
      decision: { bg: '#0F1F35', border: '#C9A227', text: '#C9A227', shape: 'diamond' },
      ai: { bg: '#C9A227', border: '#C9A227', text: '#0A1628', shape: 'rect', glow: true },
      'ai-group': { bg: '#0F1F35', border: '#00D4FF', text: '#00D4FF', shape: 'rect' },
      check: { bg: '#0F1F35', border: '#64748b', text: '#FFFFFF', shape: 'rect', dashed: true, indicator: true },
      service: { bg: '#0F1F35', border: '#64748b', text: '#B4C7E7', shape: 'rect' },
    },
    arrow: { solid: '#00D4FF', dashed: '#64748b' },
    note: { bg: '#C9A227', text: '#0A1628' },
    indicator: '#4ECDC4',
    labelColors: { red: '#ef4444', green: '#4ECDC4', gray: '#64748b' },
  },
};

export type ELCConfig = typeof elcArchitectureConfig;
