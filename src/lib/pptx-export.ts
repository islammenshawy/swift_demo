import PptxGenJS from 'pptxgenjs';
import { Demo, Slide, VisualizationType } from '@/types/demo';

// Theme colors matching our app
const THEME = {
  bgPrimary: '0A1628',
  bgSecondary: '0F1F35',
  accentGold: 'C9A227',
  accentCyan: '00D4FF',
  textPrimary: 'FFFFFF',
  textSecondary: 'B4C7E7',
  textMuted: '6B7C93',
  green: '22C55E',
  red: 'EF4444',
  emerald: '10B981',
};

// Animation phase definitions for interactive slides
interface AnimationPhase {
  title: string;
  subtitle: string;
  elements: PhaseElement[];
}

interface PhaseElement {
  type: 'text' | 'shape' | 'box' | 'arrow' | 'icon';
  content: string;
  x: number;
  y: number;
  w: number;
  h: number;
  options?: Record<string, unknown>;
}

// Define animation phases for each visualization type
const VISUALIZATION_PHASES: Record<string, AnimationPhase[]> = {
  'module-consolidation': [
    {
      title: 'The Duplication Problem',
      subtitle: 'Same modules duplicated across Platform A & Platform B systems',
      elements: [
        // Platform A
        { type: 'box', content: 'Platform A', x: 1.5, y: 2, w: 3.5, h: 4, options: { fill: { color: THEME.bgSecondary }, line: { color: THEME.accentCyan, pt: 2 } } },
        { type: 'text', content: 'Platform A', x: 1.5, y: 2.1, w: 3.5, h: 0.5, options: { fontSize: 18, bold: true, color: THEME.accentCyan } },
        { type: 'text', content: 'Trade System', x: 1.5, y: 2.5, w: 3.5, h: 0.3, options: { fontSize: 10, color: THEME.textMuted } },
        { type: 'text', content: '🧾 Billing', x: 1.7, y: 3.1, w: 3, h: 0.4, options: { fontSize: 12, color: THEME.textPrimary } },
        { type: 'text', content: '🤝 Module P', x: 1.7, y: 3.6, w: 3, h: 0.4, options: { fontSize: 12, color: THEME.textPrimary } },
        { type: 'text', content: '👥 Module C', x: 1.7, y: 4.1, w: 3, h: 0.4, options: { fontSize: 12, color: THEME.textPrimary } },
        { type: 'text', content: '💰 Pricing', x: 1.7, y: 4.6, w: 3, h: 0.4, options: { fontSize: 12, color: THEME.textPrimary } },
        // Platform B
        { type: 'box', content: 'Platform B', x: 5.5, y: 2, w: 3.5, h: 4, options: { fill: { color: THEME.bgSecondary }, line: { color: THEME.accentGold, pt: 2 } } },
        { type: 'text', content: 'Platform B', x: 5.5, y: 2.1, w: 3.5, h: 0.5, options: { fontSize: 18, bold: true, color: THEME.accentGold } },
        { type: 'text', content: 'Accounts Platform', x: 5.5, y: 2.5, w: 3.5, h: 0.3, options: { fontSize: 10, color: THEME.textMuted } },
        { type: 'text', content: '🧾 Billing', x: 5.7, y: 3.1, w: 3, h: 0.4, options: { fontSize: 12, color: THEME.textPrimary } },
        { type: 'text', content: '🤝 Module P', x: 5.7, y: 3.6, w: 3, h: 0.4, options: { fontSize: 12, color: THEME.textPrimary } },
        { type: 'text', content: '👥 Module C', x: 5.7, y: 4.1, w: 3, h: 0.4, options: { fontSize: 12, color: THEME.textPrimary } },
        { type: 'text', content: '💰 Pricing', x: 5.7, y: 4.6, w: 3, h: 0.4, options: { fontSize: 12, color: THEME.textPrimary } },
      ],
    },
    {
      title: 'The Duplication Problem',
      subtitle: 'Highlighting redundant modules across systems',
      elements: [
        // Platform A with highlights
        { type: 'box', content: 'Platform A', x: 1.5, y: 2, w: 3.5, h: 4, options: { fill: { color: THEME.bgSecondary }, line: { color: THEME.accentCyan, pt: 2 } } },
        { type: 'text', content: 'Platform A', x: 1.5, y: 2.1, w: 3.5, h: 0.5, options: { fontSize: 18, bold: true, color: THEME.accentCyan } },
        { type: 'box', content: '', x: 1.6, y: 3, w: 3.3, h: 0.5, options: { fill: { color: 'EF444440' }, line: { color: THEME.red, pt: 1 } } },
        { type: 'text', content: '🧾 Billing  ⚠️ DUPLICATE', x: 1.7, y: 3.1, w: 3.1, h: 0.4, options: { fontSize: 11, color: THEME.red, bold: true } },
        { type: 'box', content: '', x: 1.6, y: 3.5, w: 3.3, h: 0.5, options: { fill: { color: 'EF444440' }, line: { color: THEME.red, pt: 1 } } },
        { type: 'text', content: '🤝 Module P  ⚠️ DUPLICATE', x: 1.7, y: 3.6, w: 3.1, h: 0.4, options: { fontSize: 11, color: THEME.red, bold: true } },
        { type: 'box', content: '', x: 1.6, y: 4, w: 3.3, h: 0.5, options: { fill: { color: 'EF444440' }, line: { color: THEME.red, pt: 1 } } },
        { type: 'text', content: '👥 Module C  ⚠️ DUPLICATE', x: 1.7, y: 4.1, w: 3.1, h: 0.4, options: { fontSize: 11, color: THEME.red, bold: true } },
        { type: 'box', content: '', x: 1.6, y: 4.5, w: 3.3, h: 0.5, options: { fill: { color: 'EF444440' }, line: { color: THEME.red, pt: 1 } } },
        { type: 'text', content: '💰 Pricing  ⚠️ DUPLICATE', x: 1.7, y: 4.6, w: 3.1, h: 0.4, options: { fontSize: 11, color: THEME.red, bold: true } },
        // Platform B with highlights
        { type: 'box', content: 'Platform B', x: 5.5, y: 2, w: 3.5, h: 4, options: { fill: { color: THEME.bgSecondary }, line: { color: THEME.accentGold, pt: 2 } } },
        { type: 'text', content: 'Platform B', x: 5.5, y: 2.1, w: 3.5, h: 0.5, options: { fontSize: 18, bold: true, color: THEME.accentGold } },
        { type: 'box', content: '', x: 5.6, y: 3, w: 3.3, h: 0.5, options: { fill: { color: 'EF444440' }, line: { color: THEME.red, pt: 1 } } },
        { type: 'text', content: '🧾 Billing  ⚠️ DUPLICATE', x: 5.7, y: 3.1, w: 3.1, h: 0.4, options: { fontSize: 11, color: THEME.red, bold: true } },
        { type: 'box', content: '', x: 5.6, y: 3.5, w: 3.3, h: 0.5, options: { fill: { color: 'EF444440' }, line: { color: THEME.red, pt: 1 } } },
        { type: 'text', content: '🤝 Module P  ⚠️ DUPLICATE', x: 5.7, y: 3.6, w: 3.1, h: 0.4, options: { fontSize: 11, color: THEME.red, bold: true } },
        { type: 'box', content: '', x: 5.6, y: 4, w: 3.3, h: 0.5, options: { fill: { color: 'EF444440' }, line: { color: THEME.red, pt: 1 } } },
        { type: 'text', content: '👥 Module C  ⚠️ DUPLICATE', x: 5.7, y: 4.1, w: 3.1, h: 0.4, options: { fontSize: 11, color: THEME.red, bold: true } },
        { type: 'box', content: '', x: 5.6, y: 4.5, w: 3.3, h: 0.5, options: { fill: { color: 'EF444440' }, line: { color: THEME.red, pt: 1 } } },
        { type: 'text', content: '💰 Pricing  ⚠️ DUPLICATE', x: 5.7, y: 4.6, w: 3.1, h: 0.4, options: { fontSize: 11, color: THEME.red, bold: true } },
      ],
    },
    {
      title: 'Introducing Unified Frontend',
      subtitle: 'Frontend connects to both platforms as unified entry point',
      elements: [
        // Unified Frontend on top
        { type: 'box', content: 'Unified Frontend', x: 2.5, y: 0.8, w: 5.5, h: 1.2, options: { fill: { color: '10B98130' }, line: { color: THEME.emerald, pt: 2 } } },
        { type: 'text', content: '🔄 Unified Frontend - Unified Entry Point', x: 2.5, y: 0.9, w: 5.5, h: 0.5, options: { fontSize: 16, bold: true, color: THEME.emerald } },
        { type: 'text', content: 'Channel Routing  •  Format Conversion  •  API Gateway', x: 2.5, y: 1.4, w: 5.5, h: 0.4, options: { fontSize: 10, color: THEME.textSecondary } },
        // Connection lines (as text arrows)
        { type: 'text', content: '↓', x: 3.5, y: 2, w: 0.5, h: 0.5, options: { fontSize: 24, color: THEME.emerald } },
        { type: 'text', content: '↓', x: 6.5, y: 2, w: 0.5, h: 0.5, options: { fontSize: 24, color: THEME.emerald } },
        // Platform A (smaller, no duplicates shown)
        { type: 'box', content: 'Platform A', x: 1.5, y: 2.5, w: 3.5, h: 2, options: { fill: { color: THEME.bgSecondary }, line: { color: THEME.accentCyan, pt: 2 } } },
        { type: 'text', content: '🏦 Platform A', x: 1.5, y: 2.6, w: 3.5, h: 0.5, options: { fontSize: 16, bold: true, color: THEME.accentCyan } },
        { type: 'text', content: 'Trade System', x: 1.5, y: 3.0, w: 3.5, h: 0.3, options: { fontSize: 10, color: THEME.textMuted } },
        { type: 'text', content: 'Duplicated modules...', x: 1.7, y: 3.5, w: 3, h: 0.4, options: { fontSize: 11, color: THEME.textMuted, italic: true } },
        // Platform B (smaller, no duplicates shown)
        { type: 'box', content: 'Platform B', x: 5.5, y: 2.5, w: 3.5, h: 2, options: { fill: { color: THEME.bgSecondary }, line: { color: THEME.accentGold, pt: 2 } } },
        { type: 'text', content: '💳 Platform B', x: 5.5, y: 2.6, w: 3.5, h: 0.5, options: { fontSize: 16, bold: true, color: THEME.accentGold } },
        { type: 'text', content: 'Accounts Platform', x: 5.5, y: 3.0, w: 3.5, h: 0.3, options: { fontSize: 10, color: THEME.textMuted } },
        { type: 'text', content: 'Duplicated modules...', x: 5.7, y: 3.5, w: 3, h: 0.4, options: { fontSize: 11, color: THEME.textMuted, italic: true } },
      ],
    },
    {
      title: 'Introducing Unified Frontend & Shared Modules',
      subtitle: 'Modules consolidate into shared components',
      elements: [
        // Unified Frontend on top
        { type: 'box', content: 'Unified Frontend', x: 2.5, y: 0.6, w: 5.5, h: 1, options: { fill: { color: '10B98130' }, line: { color: THEME.emerald, pt: 2 } } },
        { type: 'text', content: '🔄 Unified Frontend - Unified Entry Point', x: 2.5, y: 0.75, w: 5.5, h: 0.5, options: { fontSize: 14, bold: true, color: THEME.emerald } },
        // Connection lines
        { type: 'text', content: '↓        ↓        ↓', x: 3.5, y: 1.5, w: 3.5, h: 0.5, options: { fontSize: 20, color: THEME.emerald } },
        // Platforms side by side (compact)
        { type: 'box', content: 'Platform A', x: 1.2, y: 2, w: 2.8, h: 1.5, options: { fill: { color: THEME.bgSecondary }, line: { color: THEME.green, pt: 2 } } },
        { type: 'text', content: '🏦 Platform A', x: 1.2, y: 2.1, w: 2.8, h: 0.4, options: { fontSize: 14, bold: true, color: THEME.accentCyan } },
        { type: 'text', content: '✓ Using Shared', x: 1.3, y: 2.6, w: 2.6, h: 0.4, options: { fontSize: 11, color: THEME.green } },
        { type: 'text', content: 'Core: Trade Exec, LC', x: 1.3, y: 3, w: 2.6, h: 0.3, options: { fontSize: 9, color: THEME.textMuted } },
        { type: 'box', content: 'Platform B', x: 6.5, y: 2, w: 2.8, h: 1.5, options: { fill: { color: THEME.bgSecondary }, line: { color: THEME.green, pt: 2 } } },
        { type: 'text', content: '💳 Platform B', x: 6.5, y: 2.1, w: 2.8, h: 0.4, options: { fontSize: 14, bold: true, color: THEME.accentGold } },
        { type: 'text', content: '✓ Using Shared', x: 6.6, y: 2.6, w: 2.6, h: 0.4, options: { fontSize: 11, color: THEME.green } },
        { type: 'text', content: 'Core: Invoice, Payment', x: 6.6, y: 3, w: 2.6, h: 0.3, options: { fontSize: 9, color: THEME.textMuted } },
        // Shared modules in center
        { type: 'box', content: 'Shared', x: 2, y: 3.8, w: 6.5, h: 1.8, options: { fill: { color: 'C9A22730' }, line: { color: THEME.accentGold, pt: 2 } } },
        { type: 'text', content: '🔧 SHARED MODULAR COMPONENTS', x: 2, y: 3.9, w: 6.5, h: 0.4, options: { fontSize: 12, bold: true, color: THEME.accentGold } },
        { type: 'text', content: 'Single Source of Truth • Used by Platform A, Platform B & Frontend', x: 2, y: 4.3, w: 6.5, h: 0.3, options: { fontSize: 9, color: THEME.textMuted } },
        { type: 'text', content: '🧾 Billing    🤝 Module P    👥 Module C    💰 Pricing', x: 2.2, y: 4.8, w: 6, h: 0.5, options: { fontSize: 12, color: THEME.textPrimary } },
      ],
    },
    {
      title: 'Consolidation Complete',
      subtitle: 'Single codebase • Reduced maintenance • Direct integration',
      elements: [
        // Unified Frontend on top
        { type: 'box', content: 'Unified Frontend', x: 2.5, y: 0.5, w: 5.5, h: 0.9, options: { fill: { color: '10B98130' }, line: { color: THEME.emerald, pt: 2 } } },
        { type: 'text', content: '🔄 Unified Frontend - Unified Entry Point', x: 2.5, y: 0.65, w: 5.5, h: 0.5, options: { fontSize: 13, bold: true, color: THEME.emerald } },
        // Platforms with metrics
        { type: 'box', content: 'Platform A', x: 0.8, y: 1.6, w: 2.5, h: 1.3, options: { fill: { color: THEME.bgSecondary }, line: { color: THEME.green, pt: 2 } } },
        { type: 'text', content: '🏦 Platform A', x: 0.8, y: 1.7, w: 2.5, h: 0.4, options: { fontSize: 13, bold: true, color: THEME.accentCyan } },
        { type: 'text', content: '✓ Using Shared', x: 0.9, y: 2.1, w: 2.3, h: 0.3, options: { fontSize: 10, color: THEME.green } },
        // Platform A Metrics
        { type: 'box', content: '', x: 0.8, y: 3, w: 2.5, h: 0.7, options: { fill: { color: '22C55E20' }, line: { color: THEME.green, pt: 1 } } },
        { type: 'text', content: '-50% Codebase', x: 0.8, y: 3.1, w: 2.5, h: 0.5, options: { fontSize: 14, bold: true, color: THEME.green } },
        { type: 'box', content: 'Platform B', x: 7.2, y: 1.6, w: 2.5, h: 1.3, options: { fill: { color: THEME.bgSecondary }, line: { color: THEME.green, pt: 2 } } },
        { type: 'text', content: '💳 Platform B', x: 7.2, y: 1.7, w: 2.5, h: 0.4, options: { fontSize: 13, bold: true, color: THEME.accentGold } },
        { type: 'text', content: '✓ Using Shared', x: 7.3, y: 2.1, w: 2.3, h: 0.3, options: { fontSize: 10, color: THEME.green } },
        // Platform B Metrics
        { type: 'box', content: '', x: 7.2, y: 3, w: 2.5, h: 0.7, options: { fill: { color: '22C55E20' }, line: { color: THEME.green, pt: 1 } } },
        { type: 'text', content: '-50% Codebase', x: 7.2, y: 3.1, w: 2.5, h: 0.5, options: { fontSize: 14, bold: true, color: THEME.green } },
        // Shared modules
        { type: 'box', content: 'Shared', x: 1.8, y: 4, w: 4.5, h: 1.5, options: { fill: { color: 'C9A22730' }, line: { color: THEME.accentGold, pt: 2 } } },
        { type: 'text', content: '🔧 SHARED COMPONENTS', x: 1.8, y: 4.1, w: 4.5, h: 0.4, options: { fontSize: 11, bold: true, color: THEME.accentGold } },
        { type: 'text', content: '🧾 Billing  🤝 Module P  👥 Module C  💰 Pricing', x: 1.9, y: 4.6, w: 4.3, h: 0.4, options: { fontSize: 10, color: THEME.textPrimary } },
        { type: 'text', content: '✓ ✓ ✓ ✓', x: 1.9, y: 5, w: 4.3, h: 0.4, options: { fontSize: 14, color: THEME.green } },
        // Business Benefits panel
        { type: 'box', content: '', x: 6.8, y: 4, w: 3, h: 1.5, options: { fill: { color: '22C55E20' }, line: { color: THEME.green, pt: 1 } } },
        { type: 'text', content: '🚀 Business Benefits', x: 6.8, y: 4.1, w: 3, h: 0.4, options: { fontSize: 11, bold: true, color: THEME.green } },
        { type: 'text', content: '👨‍💻 Free Dev Resources', x: 6.9, y: 4.5, w: 2.8, h: 0.25, options: { fontSize: 9, color: THEME.textSecondary } },
        { type: 'text', content: '⚡ 3x Faster Releases', x: 6.9, y: 4.75, w: 2.8, h: 0.25, options: { fontSize: 9, color: THEME.textSecondary } },
        { type: 'text', content: '💰 50% Less Infra Cost', x: 6.9, y: 5, w: 2.8, h: 0.25, options: { fontSize: 9, color: THEME.textSecondary } },
        { type: 'text', content: '🎯 Better Quality', x: 6.9, y: 5.25, w: 2.8, h: 0.25, options: { fontSize: 9, color: THEME.textSecondary } },
      ],
    },
  ],
  'legacy-problems': [
    {
      title: 'The Legacy Challenge',
      subtitle: 'Understanding the current state',
      elements: [
        { type: 'text', content: '📊 Current Pain Points', x: 1, y: 2, w: 8, h: 0.5, options: { fontSize: 18, bold: true, color: THEME.textPrimary } },
        { type: 'text', content: '• Fragmented systems across regions', x: 1.5, y: 2.8, w: 7, h: 0.4, options: { fontSize: 14, color: THEME.textSecondary } },
        { type: 'text', content: '• Manual processes causing delays', x: 1.5, y: 3.3, w: 7, h: 0.4, options: { fontSize: 14, color: THEME.textSecondary } },
        { type: 'text', content: '• Limited visibility into operations', x: 1.5, y: 3.8, w: 7, h: 0.4, options: { fontSize: 14, color: THEME.textSecondary } },
        { type: 'text', content: '• Compliance challenges', x: 1.5, y: 4.3, w: 7, h: 0.4, options: { fontSize: 14, color: THEME.textSecondary } },
      ],
    },
  ],
  'technical-challenges': [
    {
      title: 'Technical Debt',
      subtitle: 'What holds us back',
      elements: [
        { type: 'text', content: '🔧 Technical Challenges', x: 1, y: 2, w: 8, h: 0.5, options: { fontSize: 18, bold: true, color: THEME.textPrimary } },
        { type: 'text', content: '• Aging infrastructure', x: 1.5, y: 2.8, w: 7, h: 0.4, options: { fontSize: 14, color: THEME.textSecondary } },
        { type: 'text', content: '• Integration complexity', x: 1.5, y: 3.3, w: 7, h: 0.4, options: { fontSize: 14, color: THEME.textSecondary } },
        { type: 'text', content: '• Data silos', x: 1.5, y: 3.8, w: 7, h: 0.4, options: { fontSize: 14, color: THEME.textSecondary } },
        { type: 'text', content: '• Scalability limitations', x: 1.5, y: 4.3, w: 7, h: 0.4, options: { fontSize: 14, color: THEME.textSecondary } },
      ],
    },
  ],
  'product-opportunities': [
    {
      title: 'Product Opportunities',
      subtitle: 'Where we can innovate',
      elements: [
        { type: 'text', content: '🚀 Opportunities for Innovation', x: 1, y: 1.5, w: 8, h: 0.5, options: { fontSize: 18, bold: true, color: THEME.textPrimary } },
        { type: 'box', content: '', x: 0.8, y: 2.2, w: 4, h: 1.2, options: { fill: { color: THEME.bgSecondary }, line: { color: THEME.accentCyan, pt: 1 } } },
        { type: 'text', content: '⚡ Real-time Processing', x: 0.9, y: 2.3, w: 3.8, h: 0.4, options: { fontSize: 14, bold: true, color: THEME.accentCyan } },
        { type: 'text', content: 'Instant trade validation', x: 0.9, y: 2.7, w: 3.8, h: 0.4, options: { fontSize: 11, color: THEME.textSecondary } },
        { type: 'box', content: '', x: 5.2, y: 2.2, w: 4, h: 1.2, options: { fill: { color: THEME.bgSecondary }, line: { color: THEME.accentGold, pt: 1 } } },
        { type: 'text', content: '🤖 AI-Powered Analytics', x: 5.3, y: 2.3, w: 3.8, h: 0.4, options: { fontSize: 14, bold: true, color: THEME.accentGold } },
        { type: 'text', content: 'Smart risk assessment', x: 5.3, y: 2.7, w: 3.8, h: 0.4, options: { fontSize: 11, color: THEME.textSecondary } },
        { type: 'box', content: '', x: 0.8, y: 3.6, w: 4, h: 1.2, options: { fill: { color: THEME.bgSecondary }, line: { color: THEME.green, pt: 1 } } },
        { type: 'text', content: '🔗 Seamless Integration', x: 0.9, y: 3.7, w: 3.8, h: 0.4, options: { fontSize: 14, bold: true, color: THEME.green } },
        { type: 'text', content: 'Connect all systems', x: 0.9, y: 4.1, w: 3.8, h: 0.4, options: { fontSize: 11, color: THEME.textSecondary } },
        { type: 'box', content: '', x: 5.2, y: 3.6, w: 4, h: 1.2, options: { fill: { color: THEME.bgSecondary }, line: { color: THEME.emerald, pt: 1 } } },
        { type: 'text', content: '📊 Enhanced Reporting', x: 5.3, y: 3.7, w: 3.8, h: 0.4, options: { fontSize: 14, bold: true, color: THEME.emerald } },
        { type: 'text', content: 'Real-time dashboards', x: 5.3, y: 4.1, w: 3.8, h: 0.4, options: { fontSize: 11, color: THEME.textSecondary } },
      ],
    },
  ],
  'transformation-goals': [
    {
      title: 'Transformation Goals',
      subtitle: 'Our strategic objectives',
      elements: [
        { type: 'text', content: '🎯 Strategic Objectives', x: 1, y: 1.5, w: 8, h: 0.5, options: { fontSize: 18, bold: true, color: THEME.textPrimary } },
        { type: 'text', content: '1. Modernize Infrastructure', x: 1.2, y: 2.2, w: 7, h: 0.4, options: { fontSize: 14, color: THEME.accentCyan } },
        { type: 'text', content: '   Cloud-native architecture with microservices', x: 1.2, y: 2.6, w: 7, h: 0.3, options: { fontSize: 11, color: THEME.textSecondary } },
        { type: 'text', content: '2. Eliminate Duplication', x: 1.2, y: 3.1, w: 7, h: 0.4, options: { fontSize: 14, color: THEME.accentGold } },
        { type: 'text', content: '   Shared modular components across platforms', x: 1.2, y: 3.5, w: 7, h: 0.3, options: { fontSize: 11, color: THEME.textSecondary } },
        { type: 'text', content: '3. Accelerate Delivery', x: 1.2, y: 4.0, w: 7, h: 0.4, options: { fontSize: 14, color: THEME.green } },
        { type: 'text', content: '   CI/CD pipelines and automated testing', x: 1.2, y: 4.4, w: 7, h: 0.3, options: { fontSize: 11, color: THEME.textSecondary } },
        { type: 'text', content: '4. Enhance Experience', x: 1.2, y: 4.9, w: 7, h: 0.4, options: { fontSize: 14, color: THEME.emerald } },
        { type: 'text', content: '   Modern UI/UX with real-time updates', x: 1.2, y: 5.3, w: 7, h: 0.3, options: { fontSize: 11, color: THEME.textSecondary } },
      ],
    },
  ],
  'elc-reimagination': [
    {
      title: 'ELC Reimagination',
      subtitle: 'Transforming Electronic Letter of Credit',
      elements: [
        { type: 'text', content: '📄 Electronic Letter of Credit - Reimagined', x: 0.5, y: 1.5, w: 9, h: 0.5, options: { fontSize: 18, bold: true, color: THEME.textPrimary } },
        { type: 'box', content: '', x: 0.5, y: 2.1, w: 4.3, h: 2, options: { fill: { color: 'EF444420' }, line: { color: THEME.red, pt: 1 } } },
        { type: 'text', content: '❌ Before', x: 0.6, y: 2.2, w: 4, h: 0.4, options: { fontSize: 14, bold: true, color: THEME.red } },
        { type: 'text', content: '• Manual document handling', x: 0.7, y: 2.7, w: 4, h: 0.3, options: { fontSize: 11, color: THEME.textSecondary } },
        { type: 'text', content: '• Paper-based workflows', x: 0.7, y: 3.0, w: 4, h: 0.3, options: { fontSize: 11, color: THEME.textSecondary } },
        { type: 'text', content: '• Days for processing', x: 0.7, y: 3.3, w: 4, h: 0.3, options: { fontSize: 11, color: THEME.textSecondary } },
        { type: 'text', content: '• High error rates', x: 0.7, y: 3.6, w: 4, h: 0.3, options: { fontSize: 11, color: THEME.textSecondary } },
        { type: 'text', content: '→', x: 4.6, y: 2.8, w: 0.8, h: 0.5, options: { fontSize: 28, color: THEME.accentGold } },
        { type: 'box', content: '', x: 5.2, y: 2.1, w: 4.3, h: 2, options: { fill: { color: '22C55E20' }, line: { color: THEME.green, pt: 1 } } },
        { type: 'text', content: '✓ After', x: 5.3, y: 2.2, w: 4, h: 0.4, options: { fontSize: 14, bold: true, color: THEME.green } },
        { type: 'text', content: '• Digital document flow', x: 5.4, y: 2.7, w: 4, h: 0.3, options: { fontSize: 11, color: THEME.textSecondary } },
        { type: 'text', content: '• Automated workflows', x: 5.4, y: 3.0, w: 4, h: 0.3, options: { fontSize: 11, color: THEME.textSecondary } },
        { type: 'text', content: '• Minutes for processing', x: 5.4, y: 3.3, w: 4, h: 0.3, options: { fontSize: 11, color: THEME.textSecondary } },
        { type: 'text', content: '• AI-driven validation', x: 5.4, y: 3.6, w: 4, h: 0.3, options: { fontSize: 11, color: THEME.textSecondary } },
        { type: 'box', content: '', x: 2, y: 4.4, w: 6, h: 0.8, options: { fill: { color: THEME.bgSecondary }, line: { color: THEME.accentCyan, pt: 1 } } },
        { type: 'text', content: '⚡ 90% faster • 99% accuracy • 50% cost reduction', x: 2, y: 4.55, w: 6, h: 0.5, options: { fontSize: 13, bold: true, color: THEME.accentCyan } },
      ],
    },
  ],
  'transformation-metrics': [
    {
      title: 'Transformation Metrics',
      subtitle: 'Measuring our success',
      elements: [
        { type: 'text', content: '📈 Key Performance Indicators', x: 1, y: 1.3, w: 8, h: 0.5, options: { fontSize: 18, bold: true, color: THEME.textPrimary } },
        { type: 'box', content: '', x: 0.5, y: 1.9, w: 2.2, h: 1.5, options: { fill: { color: '00D4FF20' }, line: { color: THEME.accentCyan, pt: 1 } } },
        { type: 'text', content: '3x', x: 0.5, y: 2.1, w: 2.2, h: 0.6, options: { fontSize: 32, bold: true, color: THEME.accentCyan } },
        { type: 'text', content: 'Faster Delivery', x: 0.5, y: 2.8, w: 2.2, h: 0.4, options: { fontSize: 11, color: THEME.textSecondary } },
        { type: 'box', content: '', x: 2.9, y: 1.9, w: 2.2, h: 1.5, options: { fill: { color: 'C9A22720' }, line: { color: THEME.accentGold, pt: 1 } } },
        { type: 'text', content: '50%', x: 2.9, y: 2.1, w: 2.2, h: 0.6, options: { fontSize: 32, bold: true, color: THEME.accentGold } },
        { type: 'text', content: 'Cost Reduction', x: 2.9, y: 2.8, w: 2.2, h: 0.4, options: { fontSize: 11, color: THEME.textSecondary } },
        { type: 'box', content: '', x: 5.3, y: 1.9, w: 2.2, h: 1.5, options: { fill: { color: '22C55E20' }, line: { color: THEME.green, pt: 1 } } },
        { type: 'text', content: '99%', x: 5.3, y: 2.1, w: 2.2, h: 0.6, options: { fontSize: 32, bold: true, color: THEME.green } },
        { type: 'text', content: 'Accuracy', x: 5.3, y: 2.8, w: 2.2, h: 0.4, options: { fontSize: 11, color: THEME.textSecondary } },
        { type: 'box', content: '', x: 7.7, y: 1.9, w: 2.2, h: 1.5, options: { fill: { color: '10B98120' }, line: { color: THEME.emerald, pt: 1 } } },
        { type: 'text', content: '24/7', x: 7.7, y: 2.1, w: 2.2, h: 0.6, options: { fontSize: 32, bold: true, color: THEME.emerald } },
        { type: 'text', content: 'Availability', x: 7.7, y: 2.8, w: 2.2, h: 0.4, options: { fontSize: 11, color: THEME.textSecondary } },
        { type: 'text', content: '🎯 Target Outcomes', x: 1, y: 3.7, w: 8, h: 0.4, options: { fontSize: 14, bold: true, color: THEME.textPrimary } },
        { type: 'text', content: '• Unified platform serving all trade finance needs', x: 1.2, y: 4.2, w: 7, h: 0.3, options: { fontSize: 12, color: THEME.textSecondary } },
        { type: 'text', content: '• Automated compliance and risk management', x: 1.2, y: 4.5, w: 7, h: 0.3, options: { fontSize: 12, color: THEME.textSecondary } },
        { type: 'text', content: '• Real-time visibility across all operations', x: 1.2, y: 4.8, w: 7, h: 0.3, options: { fontSize: 12, color: THEME.textSecondary } },
      ],
    },
  ],
  'trade-architecture': [
    {
      title: 'Modern Trade Architecture',
      subtitle: 'Our target state architecture',
      elements: [
        { type: 'text', content: '🏗️ Target Architecture', x: 1, y: 1.3, w: 8, h: 0.5, options: { fontSize: 18, bold: true, color: THEME.textPrimary } },
        // API Gateway layer
        { type: 'box', content: '', x: 1, y: 1.9, w: 8, h: 0.7, options: { fill: { color: '10B98130' }, line: { color: THEME.emerald, pt: 1 } } },
        { type: 'text', content: '🌐 API Gateway / Frontend', x: 1, y: 2, w: 8, h: 0.5, options: { fontSize: 12, bold: true, color: THEME.emerald } },
        // Microservices layer
        { type: 'box', content: '', x: 1, y: 2.8, w: 2.5, h: 0.9, options: { fill: { color: THEME.bgSecondary }, line: { color: THEME.accentCyan, pt: 1 } } },
        { type: 'text', content: '📄 Trade Service', x: 1, y: 2.95, w: 2.5, h: 0.5, options: { fontSize: 10, color: THEME.accentCyan } },
        { type: 'box', content: '', x: 3.75, y: 2.8, w: 2.5, h: 0.9, options: { fill: { color: THEME.bgSecondary }, line: { color: THEME.accentGold, pt: 1 } } },
        { type: 'text', content: '💳 Payment Service', x: 3.75, y: 2.95, w: 2.5, h: 0.5, options: { fontSize: 10, color: THEME.accentGold } },
        { type: 'box', content: '', x: 6.5, y: 2.8, w: 2.5, h: 0.9, options: { fill: { color: THEME.bgSecondary }, line: { color: THEME.green, pt: 1 } } },
        { type: 'text', content: '📊 Analytics Service', x: 6.5, y: 2.95, w: 2.5, h: 0.5, options: { fontSize: 10, color: THEME.green } },
        // Shared components layer
        { type: 'box', content: '', x: 1, y: 4, w: 8, h: 0.9, options: { fill: { color: 'C9A22720' }, line: { color: THEME.accentGold, pt: 1 } } },
        { type: 'text', content: '🔧 Shared Components: Billing • Module C • Pricing • Module P', x: 1, y: 4.2, w: 8, h: 0.5, options: { fontSize: 11, color: THEME.accentGold } },
        // Data layer
        { type: 'box', content: '', x: 1, y: 5.1, w: 8, h: 0.5, options: { fill: { color: THEME.bgSecondary }, line: { color: THEME.textMuted, pt: 1 } } },
        { type: 'text', content: '💾 Data Layer: PostgreSQL • Redis • Elasticsearch', x: 1, y: 5.2, w: 8, h: 0.3, options: { fontSize: 10, color: THEME.textMuted } },
      ],
    },
  ],
};

// Get animation phases for a visualization type
function getVisualizationPhases(vizType: VisualizationType): AnimationPhase[] {
  return VISUALIZATION_PHASES[vizType] || [{
    title: vizType.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    subtitle: 'Visualization content',
    elements: [],
  }];
}

// Add a phase to the presentation
function addPhaseSlide(
  pres: PptxGenJS,
  phase: AnimationPhase,
  slideIndex: number,
  totalSlides: number,
  useMorph: boolean = true
): void {
  const slide = pres.addSlide();

  // Set background
  slide.background = { color: THEME.bgPrimary };

  // Set Morph transition for smooth animations between phases
  // Note: Morph transition requires PowerPoint 2019+ to display correctly
  if (useMorph && slideIndex > 0) {
    // Use type assertion as pptxgenjs types don't include transition property
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (slide as any).transition = { type: 'morph', morphOption: 'byObject' };
  }

  // Add title
  slide.addText(phase.title, {
    x: 0.5,
    y: 0.2,
    w: 9.5,
    h: 0.6,
    fontSize: 28,
    bold: true,
    color: THEME.textPrimary,
    fontFace: 'Arial',
  });

  // Add subtitle
  slide.addText(phase.subtitle, {
    x: 0.5,
    y: 0.75,
    w: 9.5,
    h: 0.4,
    fontSize: 14,
    color: THEME.textSecondary,
    fontFace: 'Arial',
  });

  // Add elements
  phase.elements.forEach((element, i) => {
    const baseOptions = {
      x: element.x,
      y: element.y,
      w: element.w,
      h: element.h,
      fontFace: 'Arial',
      align: 'center' as const,
      valign: 'middle' as const,
      ...element.options,
    };

    if (element.type === 'box') {
      slide.addShape('rect', {
        x: element.x,
        y: element.y,
        w: element.w,
        h: element.h,
        fill: (element.options?.fill as { color: string }) || { color: THEME.bgSecondary },
        line: (element.options?.line as { color: string; pt: number }) || { color: THEME.accentCyan, pt: 1 },
        rectRadius: 0.1,
      });
    } else if (element.type === 'text') {
      slide.addText(element.content, {
        ...baseOptions,
        align: element.options?.align as 'left' | 'center' | 'right' || 'center',
      });
    }
  });

  // Add slide number
  slide.addText(`${slideIndex + 1}`, {
    x: 9,
    y: 5.3,
    w: 0.5,
    h: 0.3,
    fontSize: 10,
    color: THEME.textMuted,
    fontFace: 'Arial',
  });
}

// Add title slide
function addTitleSlide(pres: PptxGenJS, slide: Slide): void {
  const pptSlide = pres.addSlide();
  pptSlide.background = { color: THEME.bgPrimary };

  // Main title
  pptSlide.addText(slide.content.title || '', {
    x: 0.5,
    y: 2,
    w: 9.5,
    h: 1,
    fontSize: 44,
    bold: true,
    color: THEME.textPrimary,
    fontFace: 'Arial',
    align: 'center',
  });

  // Subtitle
  if (slide.content.subtitle) {
    pptSlide.addText(slide.content.subtitle, {
      x: 0.5,
      y: 3,
      w: 9.5,
      h: 0.6,
      fontSize: 24,
      color: THEME.accentGold,
      fontFace: 'Arial',
      align: 'center',
    });
  }

  // Description text
  if (slide.content.text) {
    pptSlide.addText(slide.content.text, {
      x: 0.5,
      y: 3.8,
      w: 9.5,
      h: 0.5,
      fontSize: 16,
      color: THEME.textSecondary,
      fontFace: 'Arial',
      align: 'center',
    });
  }
}

// Add content slide
function addContentSlide(pres: PptxGenJS, slide: Slide): void {
  const pptSlide = pres.addSlide();
  pptSlide.background = { color: THEME.bgPrimary };

  // Title
  if (slide.content.title) {
    pptSlide.addText(slide.content.title, {
      x: 0.5,
      y: 0.3,
      w: 9.5,
      h: 0.7,
      fontSize: 28,
      bold: true,
      color: THEME.textPrimary,
      fontFace: 'Arial',
    });
  }

  // Bullets
  if (slide.content.bullets && slide.content.bullets.length > 0) {
    const bulletText = slide.content.bullets.map(b => ({ text: b, options: { bullet: true } }));
    pptSlide.addText(bulletText, {
      x: 0.5,
      y: 1.2,
      w: 9,
      h: 4,
      fontSize: 18,
      color: THEME.textSecondary,
      fontFace: 'Arial',
      paraSpaceAfter: 12,
    });
  }
}

// Main export function
export async function exportDemoToPptx(demo: Demo): Promise<Blob> {
  const pres = new PptxGenJS();

  // Set presentation properties
  pres.author = 'SWIFT Demo Platform';
  pres.title = demo.title;
  pres.subject = demo.description || 'Presentation export';
  pres.company = 'SWIFT';

  // Set slide size (16:9)
  pres.defineLayout({ name: 'WIDE', width: 10, height: 5.625 });
  pres.layout = 'WIDE';

  let slideCounter = 0;

  // Process each slide
  for (const slide of demo.slides) {
    if (slide.type === 'title') {
      addTitleSlide(pres, slide);
      slideCounter++;
    } else if (slide.type === 'interactive' && slide.content.visualization) {
      // Get animation phases for this visualization
      const phases = getVisualizationPhases(slide.content.visualization);

      // Add each phase as a separate slide with Morph transition
      phases.forEach((phase, phaseIndex) => {
        addPhaseSlide(pres, phase, slideCounter, phases.length, phaseIndex > 0);
        slideCounter++;
      });
    } else if (slide.type === 'content') {
      addContentSlide(pres, slide);
      slideCounter++;
    } else {
      // Generic slide for other types
      const pptSlide = pres.addSlide();
      pptSlide.background = { color: THEME.bgPrimary };

      if (slide.content.title) {
        pptSlide.addText(slide.content.title, {
          x: 0.5,
          y: 2,
          w: 9.5,
          h: 1,
          fontSize: 32,
          bold: true,
          color: THEME.textPrimary,
          fontFace: 'Arial',
          align: 'center',
        });
      }
      slideCounter++;
    }
  }

  // Generate and return blob
  const blob = await pres.write({ outputType: 'blob' }) as Blob;
  return blob;
}

// Helper to trigger download
export function downloadPptx(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
