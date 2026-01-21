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
        { type: 'text', content: '🧾 Billing    🤝 Module P    👥 Module C', x: 2.2, y: 4.8, w: 6, h: 0.5, options: { fontSize: 12, color: THEME.textPrimary } },
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
        { type: 'text', content: '🧾 Billing  🤝 Module P  👥 Module C', x: 1.9, y: 4.6, w: 4.3, h: 0.4, options: { fontSize: 10, color: THEME.textPrimary } },
        { type: 'text', content: '✓ ✓ ✓', x: 1.9, y: 5, w: 4.3, h: 0.4, options: { fontSize: 14, color: THEME.green } },
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
  // Evalio Visualizations
  'engineering-score-journey': [
    // Phase 0: Opening Question
    {
      title: 'How do we score',
      subtitle: 'engineering performance?',
      elements: [
        { type: 'text', content: 'How do we score', x: 1, y: 2, w: 8, h: 0.8, options: { fontSize: 36, color: THEME.textPrimary } },
        { type: 'text', content: 'engineering performance?', x: 1, y: 2.7, w: 8, h: 0.8, options: { fontSize: 40, bold: true, color: THEME.accentCyan } },
      ],
    },
    // Phase 1: Too Many Metrics
    {
      title: 'Too Many Metrics...',
      subtitle: '5 metric groups with 22+ individual metrics',
      elements: [
        { type: 'box', content: '', x: 0.3, y: 1.5, w: 1.8, h: 2.5, options: { fill: { color: '4ECDC420' }, line: { color: '4ECDC4', pt: 1 } } },
        { type: 'text', content: '🚀 Delivery', x: 0.3, y: 1.6, w: 1.8, h: 0.4, options: { fontSize: 11, bold: true, color: '4ECDC4' } },
        { type: 'text', content: '• Story Points\n• Churn\n• Say/Do Ratio\n• Change Failure Rate\n• Time to Prod\n• Wall-building', x: 0.35, y: 2.0, w: 1.7, h: 1.8, options: { fontSize: 8, color: THEME.textSecondary } },
        { type: 'box', content: '', x: 2.2, y: 1.5, w: 1.8, h: 2.5, options: { fill: { color: '6495ED20' }, line: { color: '6495ED', pt: 1 } } },
        { type: 'text', content: '🛡️ Reliability', x: 2.2, y: 1.6, w: 1.8, h: 0.4, options: { fontSize: 11, bold: true, color: '6495ED' } },
        { type: 'text', content: '• Defect Closure\n• Commitment Index\n• Timely Escalation\n• Incidents Resolved', x: 2.25, y: 2.0, w: 1.7, h: 1.5, options: { fontSize: 8, color: THEME.textSecondary } },
        { type: 'box', content: '', x: 4.1, y: 1.5, w: 1.8, h: 2.5, options: { fill: { color: 'C9A22720' }, line: { color: THEME.accentGold, pt: 1 } } },
        { type: 'text', content: '✨ Quality', x: 4.1, y: 1.6, w: 1.8, h: 0.4, options: { fontSize: 11, bold: true, color: THEME.accentGold } },
        { type: 'text', content: '• Defect Rate\n• Defect Leakage\n• Code Grade\n• Test Coverage', x: 4.15, y: 2.0, w: 1.7, h: 1.5, options: { fontSize: 8, color: THEME.textSecondary } },
        { type: 'box', content: '', x: 6, y: 1.5, w: 1.8, h: 2.5, options: { fill: { color: 'A855F720' }, line: { color: 'A855F7', pt: 1 } } },
        { type: 'text', content: '🤝 Collaboration', x: 6, y: 1.6, w: 1.8, h: 0.4, options: { fontSize: 11, bold: true, color: 'A855F7' } },
        { type: 'text', content: '• PR Reviews\n• Unplanned Work\n• Cross-team Help\n• Knowledge Sharing', x: 6.05, y: 2.0, w: 1.7, h: 1.5, options: { fontSize: 8, color: THEME.textSecondary } },
        { type: 'box', content: '', x: 7.9, y: 1.5, w: 1.8, h: 2.5, options: { fill: { color: 'F59E0B20' }, line: { color: 'F59E0B', pt: 1 } } },
        { type: 'text', content: '⚡ Efficiency', x: 7.9, y: 1.6, w: 1.8, h: 0.4, options: { fontSize: 11, bold: true, color: 'F59E0B' } },
        { type: 'text', content: '• AI Usage Score\n• Automation Index\n• Commit Frequency\n• Tool Adoption', x: 7.95, y: 2.0, w: 1.7, h: 1.5, options: { fontSize: 8, color: THEME.textSecondary } },
        { type: 'text', content: 'Delivery + Reliability + Quality + Collaboration + Efficiency → Weighted Score', x: 0.5, y: 4.3, w: 9, h: 0.4, options: { fontSize: 11, color: THEME.textMuted } },
      ],
    },
    // Phase 2: Different Types of Data
    {
      title: 'Different Types of Data',
      subtitle: 'Quantitative metrics + Objective feedback',
      elements: [
        { type: 'box', content: '', x: 1.5, y: 1.3, w: 3, h: 0.6, options: { fill: { color: '4ECDC420' }, line: { color: '4ECDC4', pt: 1 } } },
        { type: 'text', content: '📊 Quantitative · data', x: 1.5, y: 1.4, w: 3, h: 0.4, options: { fontSize: 12, bold: true, color: '4ECDC4' } },
        { type: 'box', content: '', x: 5.5, y: 1.3, w: 3, h: 0.6, options: { fill: { color: 'F59E0B20' }, line: { color: 'F59E0B', pt: 1 } } },
        { type: 'text', content: '💬 Objective · feedback', x: 5.5, y: 1.4, w: 3, h: 0.4, options: { fontSize: 12, bold: true, color: 'F59E0B' } },
        { type: 'text', content: 'Each metric is classified as either Quantitative (Q) or Objective (O)', x: 1, y: 2.1, w: 8, h: 0.4, options: { fontSize: 11, color: THEME.textSecondary } },
        { type: 'text', content: '📊 Q: Story Points, Code Grade, Test Coverage, PR Reviews, Commit Frequency', x: 1, y: 2.7, w: 8, h: 0.35, options: { fontSize: 10, color: '4ECDC4' } },
        { type: 'text', content: '💬 O: Wall-building, Timely Escalation, Cross-team Help, Knowledge Sharing', x: 1, y: 3.1, w: 8, h: 0.35, options: { fontSize: 10, color: 'F59E0B' } },
        { type: 'box', content: '', x: 2, y: 3.7, w: 6, h: 0.8, options: { fill: { color: THEME.bgSecondary }, line: { color: THEME.accentCyan, pt: 1 } } },
        { type: 'text', content: 'Combining hard data with contextual feedback for holistic evaluation', x: 2, y: 3.9, w: 6, h: 0.4, options: { fontSize: 11, color: THEME.textSecondary } },
      ],
    },
    // Phase 3: Different Levels, Different Averages
    {
      title: 'Different Levels, Different Averages',
      subtitle: 'Average metrics vary significantly by level',
      elements: [
        { type: 'box', content: '', x: 0.3, y: 1.2, w: 1.2, h: 0.4, options: { fill: { color: '22C55E30' }, line: { color: '22C55E', pt: 1 } } },
        { type: 'text', content: 'Junior', x: 0.3, y: 1.25, w: 1.2, h: 0.3, options: { fontSize: 10, bold: true, color: '22C55E' } },
        { type: 'box', content: '', x: 1.6, y: 1.2, w: 1.2, h: 0.4, options: { fill: { color: '3B82F630' }, line: { color: '3B82F6', pt: 1 } } },
        { type: 'text', content: 'Mid', x: 1.6, y: 1.25, w: 1.2, h: 0.3, options: { fontSize: 10, bold: true, color: '3B82F6' } },
        { type: 'box', content: '', x: 2.9, y: 1.2, w: 1.2, h: 0.4, options: { fill: { color: 'A855F730' }, line: { color: 'A855F7', pt: 1 } } },
        { type: 'text', content: 'Senior', x: 2.9, y: 1.25, w: 1.2, h: 0.3, options: { fontSize: 10, bold: true, color: 'A855F7' } },
        { type: 'box', content: '', x: 4.2, y: 1.2, w: 1.2, h: 0.4, options: { fill: { color: 'F59E0B30' }, line: { color: 'F59E0B', pt: 1 } } },
        { type: 'text', content: 'Lead', x: 4.2, y: 1.25, w: 1.2, h: 0.3, options: { fontSize: 10, bold: true, color: 'F59E0B' } },
        { type: 'text', content: 'Code Commits/week', x: 0.5, y: 1.9, w: 2.5, h: 0.3, options: { fontSize: 10, color: THEME.textSecondary } },
        { type: 'text', content: 'Jr: 12  |  Mid: 18  |  Sr: 8  |  Lead: 4', x: 0.5, y: 2.2, w: 3.5, h: 0.3, options: { fontSize: 9, color: THEME.textMuted } },
        { type: 'text', content: 'PR Reviews/week', x: 0.5, y: 2.7, w: 2.5, h: 0.3, options: { fontSize: 10, color: THEME.textSecondary } },
        { type: 'text', content: 'Jr: 3  |  Mid: 8  |  Sr: 15  |  Lead: 20', x: 0.5, y: 3.0, w: 3.5, h: 0.3, options: { fontSize: 9, color: THEME.textMuted } },
        { type: 'text', content: 'Story Points/sprint', x: 0.5, y: 3.5, w: 2.5, h: 0.3, options: { fontSize: 10, color: THEME.textSecondary } },
        { type: 'text', content: 'Jr: 8  |  Mid: 13  |  Sr: 10  |  Lead: 5', x: 0.5, y: 3.8, w: 3.5, h: 0.3, options: { fontSize: 9, color: THEME.textMuted } },
        { type: 'box', content: '', x: 5.5, y: 1.9, w: 4, h: 2.4, options: { fill: { color: THEME.bgSecondary }, line: { color: THEME.accentGold, pt: 1 } } },
        { type: 'text', content: '💡 Key Insights', x: 5.5, y: 2, w: 4, h: 0.4, options: { fontSize: 11, bold: true, color: THEME.accentGold } },
        { type: 'text', content: '• Juniors: High commits, fewer reviews\n• Mid: Balance coding + collaboration\n• Seniors: More PR reviews, less code\n• Leads: Lowest output, highest impact', x: 5.6, y: 2.5, w: 3.8, h: 1.6, options: { fontSize: 9, color: THEME.textSecondary } },
      ],
    },
    // Phase 4: Fair = Same Level Comparison
    {
      title: 'Fair = Same Level Comparison',
      subtitle: 'Compare peers within the same level for fairness',
      elements: [
        { type: 'text', content: '⚖️', x: 1, y: 1.5, w: 2, h: 1, options: { fontSize: 48, color: THEME.textPrimary } },
        { type: 'box', content: '', x: 3.5, y: 1.5, w: 1.5, h: 0.8, options: { fill: { color: 'A855F720' }, line: { color: 'A855F7', pt: 2 } } },
        { type: 'text', content: 'Senior', x: 3.5, y: 1.7, w: 1.5, h: 0.4, options: { fontSize: 12, bold: true, color: 'A855F7' } },
        { type: 'text', content: 'vs', x: 5.1, y: 1.7, w: 0.5, h: 0.4, options: { fontSize: 14, bold: true, color: THEME.green } },
        { type: 'box', content: '', x: 5.7, y: 1.5, w: 1.5, h: 0.8, options: { fill: { color: 'A855F720' }, line: { color: 'A855F7', pt: 2 } } },
        { type: 'text', content: 'Senior', x: 5.7, y: 1.7, w: 1.5, h: 0.4, options: { fontSize: 12, bold: true, color: 'A855F7' } },
        { type: 'text', content: '✓', x: 7.3, y: 1.6, w: 0.5, h: 0.5, options: { fontSize: 24, bold: true, color: THEME.green } },
        { type: 'text', content: 'Junior vs Senior  ✗', x: 3.5, y: 2.5, w: 4, h: 0.4, options: { fontSize: 10, color: THEME.red } },
        { type: 'box', content: '', x: 0.5, y: 3.2, w: 4.5, h: 2, options: { fill: { color: THEME.bgSecondary }, line: { color: 'A855F7', pt: 1 } } },
        { type: 'text', content: 'Percentile within Senior peers', x: 0.5, y: 3.3, w: 4.5, h: 0.35, options: { fontSize: 10, color: THEME.textMuted } },
        { type: 'text', content: 'Alice    ████████████  92%', x: 0.6, y: 3.7, w: 4.3, h: 0.3, options: { fontSize: 10, color: THEME.green } },
        { type: 'text', content: 'Bob      ████████      78%', x: 0.6, y: 4.0, w: 4.3, h: 0.3, options: { fontSize: 10, color: 'A855F7' } },
        { type: 'text', content: 'Carol    ██████        65%', x: 0.6, y: 4.3, w: 4.3, h: 0.3, options: { fontSize: 10, color: 'A855F7' } },
        { type: 'text', content: 'Dave     ████          45%', x: 0.6, y: 4.6, w: 4.3, h: 0.3, options: { fontSize: 10, color: 'A855F7' } },
        { type: 'box', content: '', x: 5.5, y: 3.2, w: 4, h: 2, options: { fill: { color: '22C55E15' }, line: { color: THEME.green, pt: 1 } } },
        { type: 'text', content: '✨ Top 10% among Senior engineers', x: 5.5, y: 3.8, w: 4, h: 0.4, options: { fontSize: 12, bold: true, color: THEME.green } },
        { type: 'text', content: 'Fair comparison within the same level ensures accurate performance evaluation', x: 5.6, y: 4.4, w: 3.8, h: 0.6, options: { fontSize: 9, color: THEME.textSecondary } },
      ],
    },
  ],
  'problem-visual': [
    {
      title: 'The Problem',
      subtitle: 'Performance reviews lack objectivity and consistency',
      elements: [
        { type: 'text', content: '😤 74% of employees believe 360-degree reviews are unfair, biased, or inaccurate', x: 0.5, y: 1.5, w: 9, h: 0.45, options: { fontSize: 12, color: THEME.textSecondary } },
        { type: 'text', content: '🎭 Promotions based on perception, not actual contribution', x: 0.5, y: 2.0, w: 9, h: 0.45, options: { fontSize: 12, color: THEME.textSecondary } },
        { type: 'text', content: '📋 Managers lack data and recommendations to navigate performance discussions', x: 0.5, y: 2.5, w: 9, h: 0.45, options: { fontSize: 12, color: THEME.textSecondary } },
        { type: 'text', content: '❓ No visibility into how scores are calculated', x: 0.5, y: 3.0, w: 9, h: 0.45, options: { fontSize: 12, color: THEME.textSecondary } },
        { type: 'text', content: '🚪 High performers leave when passed over unfairly', x: 0.5, y: 3.5, w: 9, h: 0.45, options: { fontSize: 12, color: THEME.textSecondary } },
        { type: 'box', content: '', x: 3, y: 4.2, w: 4, h: 0.6, options: { fill: { color: 'EF444420' }, line: { color: THEME.red, pt: 1 } } },
        { type: 'text', content: '⚠️ Broken System', x: 3, y: 4.35, w: 4, h: 0.3, options: { fontSize: 12, bold: true, color: THEME.red } },
      ],
    },
  ],
  'solution-visual': [
    {
      title: 'The Solution',
      subtitle: 'Evalio: Quantitative data fused with 360-degree reviews and Objective data',
      elements: [
        { type: 'text', content: '🔗 Quantitative data from JIRA, GitHub, and Confluence', x: 0.5, y: 1.5, w: 9, h: 0.45, options: { fontSize: 12, color: THEME.textSecondary } },
        { type: 'text', content: '🔄 360-degree feedback enriched with real work metrics', x: 0.5, y: 2.0, w: 9, h: 0.45, options: { fontSize: 12, color: THEME.textSecondary } },
        { type: 'text', content: '📊 Managers get data-driven talking points and recommendations', x: 0.5, y: 2.5, w: 9, h: 0.45, options: { fontSize: 12, color: THEME.textSecondary } },
        { type: 'text', content: '⚖️ Fair comparison within same level peers', x: 0.5, y: 3.0, w: 9, h: 0.45, options: { fontSize: 12, color: THEME.textSecondary } },
        { type: 'text', content: '🔍 Transparent methodology based on real contributions', x: 0.5, y: 3.5, w: 9, h: 0.45, options: { fontSize: 12, color: THEME.textSecondary } },
        { type: 'box', content: '', x: 2.5, y: 4.2, w: 5, h: 0.6, options: { fill: { color: '22C55E20' }, line: { color: THEME.green, pt: 1 } } },
        { type: 'text', content: '✓ Data-Driven Fairness', x: 2.5, y: 4.35, w: 5, h: 0.3, options: { fontSize: 12, bold: true, color: THEME.green } },
      ],
    },
  ],
  'score-calculation': [
    {
      title: 'Multi-Framework Scoring',
      subtitle: 'Weighted combination for objective evaluation',
      elements: [
        { type: 'box', content: '', x: 0.5, y: 1.5, w: 5.5, h: 0.8, options: { fill: { color: THEME.bgSecondary }, line: { color: '4ECDC4', pt: 1 } } },
        { type: 'text', content: '📋 JIRA — 30% weight — Task completion, velocity', x: 0.6, y: 1.6, w: 5.3, h: 0.6, options: { fontSize: 11, color: THEME.textSecondary } },
        { type: 'box', content: '', x: 0.5, y: 2.4, w: 5.5, h: 0.8, options: { fill: { color: THEME.bgSecondary }, line: { color: '6495ED', pt: 1 } } },
        { type: 'text', content: '💻 GitHub — 35% weight — Code quality, PRs', x: 0.6, y: 2.5, w: 5.3, h: 0.6, options: { fontSize: 11, color: THEME.textSecondary } },
        { type: 'box', content: '', x: 0.5, y: 3.3, w: 5.5, h: 0.8, options: { fill: { color: THEME.bgSecondary }, line: { color: 'FFD700', pt: 1 } } },
        { type: 'text', content: '📝 Confluence — 15% weight — Documentation', x: 0.6, y: 3.4, w: 5.3, h: 0.6, options: { fontSize: 11, color: THEME.textSecondary } },
        { type: 'box', content: '', x: 0.5, y: 4.2, w: 5.5, h: 0.8, options: { fill: { color: THEME.bgSecondary }, line: { color: THEME.accentGold, pt: 1 } } },
        { type: 'text', content: '📈 DORA — 20% weight — DevOps metrics', x: 0.6, y: 4.3, w: 5.3, h: 0.6, options: { fontSize: 11, color: THEME.textSecondary } },
        { type: 'text', content: '=', x: 6.2, y: 2.8, w: 0.5, h: 0.6, options: { fontSize: 32, color: THEME.textPrimary } },
        { type: 'box', content: '', x: 7, y: 2.2, w: 2.5, h: 2, options: { fill: { color: '4ECDC420' }, line: { color: '4ECDC4', pt: 2 } } },
        { type: 'text', content: '4.2', x: 7, y: 2.5, w: 2.5, h: 0.8, options: { fontSize: 36, bold: true, color: '4ECDC4' } },
        { type: 'text', content: 'Final Score', x: 7, y: 3.4, w: 2.5, h: 0.4, options: { fontSize: 11, color: THEME.textMuted } },
        { type: 'text', content: 'High Performer', x: 7, y: 3.8, w: 2.5, h: 0.3, options: { fontSize: 10, color: '4ECDC4' } },
      ],
    },
  ],
  'level-weights': [
    {
      title: 'Level-Adjusted Weights',
      subtitle: 'Different expectations for different seniority levels',
      elements: [
        { type: 'box', content: '', x: 0.3, y: 1.5, w: 2.2, h: 1.8, options: { fill: { color: '4ECDC420' }, line: { color: '4ECDC4', pt: 1 } } },
        { type: 'text', content: 'Analyst', x: 0.3, y: 1.6, w: 2.2, h: 0.4, options: { fontSize: 14, bold: true, color: '4ECDC4' } },
        { type: 'text', content: '0-2 years', x: 0.3, y: 2.0, w: 2.2, h: 0.3, options: { fontSize: 9, color: THEME.textMuted } },
        { type: 'text', content: 'Focus: Execution', x: 0.3, y: 2.4, w: 2.2, h: 0.3, options: { fontSize: 9, color: THEME.textSecondary } },
        { type: 'text', content: 'GitHub: 40%', x: 0.3, y: 2.8, w: 2.2, h: 0.25, options: { fontSize: 9, color: THEME.textSecondary } },
        { type: 'box', content: '', x: 2.7, y: 1.5, w: 2.2, h: 1.8, options: { fill: { color: '6495ED20' }, line: { color: '6495ED', pt: 1 } } },
        { type: 'text', content: 'Associate', x: 2.7, y: 1.6, w: 2.2, h: 0.4, options: { fontSize: 14, bold: true, color: '6495ED' } },
        { type: 'text', content: '2-4 years', x: 2.7, y: 2.0, w: 2.2, h: 0.3, options: { fontSize: 9, color: THEME.textMuted } },
        { type: 'text', content: 'Focus: Autonomy', x: 2.7, y: 2.4, w: 2.2, h: 0.3, options: { fontSize: 9, color: THEME.textSecondary } },
        { type: 'text', content: 'GitHub: 35%', x: 2.7, y: 2.8, w: 2.2, h: 0.25, options: { fontSize: 9, color: THEME.textSecondary } },
        { type: 'box', content: '', x: 5.1, y: 1.5, w: 2.2, h: 1.8, options: { fill: { color: 'FFD70020' }, line: { color: 'FFD700', pt: 1 } } },
        { type: 'text', content: 'VP', x: 5.1, y: 1.6, w: 2.2, h: 0.4, options: { fontSize: 14, bold: true, color: 'FFD700' } },
        { type: 'text', content: '4-7 years', x: 5.1, y: 2.0, w: 2.2, h: 0.3, options: { fontSize: 9, color: THEME.textMuted } },
        { type: 'text', content: 'Focus: Leadership', x: 5.1, y: 2.4, w: 2.2, h: 0.3, options: { fontSize: 9, color: THEME.textSecondary } },
        { type: 'text', content: 'Confluence: 20%', x: 5.1, y: 2.8, w: 2.2, h: 0.25, options: { fontSize: 9, color: THEME.textSecondary } },
        { type: 'box', content: '', x: 7.5, y: 1.5, w: 2.2, h: 1.8, options: { fill: { color: 'C9A22720' }, line: { color: THEME.accentGold, pt: 1 } } },
        { type: 'text', content: 'Director', x: 7.5, y: 1.6, w: 2.2, h: 0.4, options: { fontSize: 14, bold: true, color: THEME.accentGold } },
        { type: 'text', content: '7+ years', x: 7.5, y: 2.0, w: 2.2, h: 0.3, options: { fontSize: 9, color: THEME.textMuted } },
        { type: 'text', content: 'Focus: Strategy', x: 7.5, y: 2.4, w: 2.2, h: 0.3, options: { fontSize: 9, color: THEME.textSecondary } },
        { type: 'text', content: 'DORA: 35%', x: 7.5, y: 2.8, w: 2.2, h: 0.25, options: { fontSize: 9, color: THEME.textSecondary } },
        { type: 'box', content: '', x: 1.5, y: 3.6, w: 7, h: 0.7, options: { fill: { color: THEME.bgSecondary }, line: { color: THEME.accentCyan, pt: 1 } } },
        { type: 'text', content: '⚖️ Fair comparison: Analysts compared to Analysts, Directors to Directors', x: 1.5, y: 3.75, w: 7, h: 0.4, options: { fontSize: 11, color: THEME.accentCyan } },
      ],
    },
  ],
  'team-benchmarking': [
    {
      title: 'Team Benchmarking',
      subtitle: 'Fair comparison within peer groups',
      elements: [
        { type: 'text', content: '📊 Team Performance Distribution', x: 1, y: 1.5, w: 8, h: 0.4, options: { fontSize: 14, bold: true, color: THEME.textPrimary } },
        { type: 'box', content: '', x: 0.5, y: 2, w: 2.8, h: 1.5, options: { fill: { color: '4ECDC420' }, line: { color: '4ECDC4', pt: 1 } } },
        { type: 'text', content: 'Alice Chen', x: 0.5, y: 2.1, w: 2.8, h: 0.4, options: { fontSize: 12, bold: true, color: '4ECDC4' } },
        { type: 'text', content: 'Score: 4.5 / 5.0', x: 0.5, y: 2.5, w: 2.8, h: 0.3, options: { fontSize: 11, color: THEME.textSecondary } },
        { type: 'text', content: '🏆 Top 10%', x: 0.5, y: 2.9, w: 2.8, h: 0.3, options: { fontSize: 10, color: THEME.green } },
        { type: 'box', content: '', x: 3.6, y: 2, w: 2.8, h: 1.5, options: { fill: { color: '6495ED20' }, line: { color: '6495ED', pt: 1 } } },
        { type: 'text', content: 'Bob Smith', x: 3.6, y: 2.1, w: 2.8, h: 0.4, options: { fontSize: 12, bold: true, color: '6495ED' } },
        { type: 'text', content: 'Score: 4.1 / 5.0', x: 3.6, y: 2.5, w: 2.8, h: 0.3, options: { fontSize: 11, color: THEME.textSecondary } },
        { type: 'text', content: '📈 Top 25%', x: 3.6, y: 2.9, w: 2.8, h: 0.3, options: { fontSize: 10, color: THEME.accentCyan } },
        { type: 'box', content: '', x: 6.7, y: 2, w: 2.8, h: 1.5, options: { fill: { color: 'FFD70020' }, line: { color: 'FFD700', pt: 1 } } },
        { type: 'text', content: 'Carol Davis', x: 6.7, y: 2.1, w: 2.8, h: 0.4, options: { fontSize: 12, bold: true, color: 'FFD700' } },
        { type: 'text', content: 'Score: 3.8 / 5.0', x: 6.7, y: 2.5, w: 2.8, h: 0.3, options: { fontSize: 11, color: THEME.textSecondary } },
        { type: 'text', content: '📊 Median', x: 6.7, y: 2.9, w: 2.8, h: 0.3, options: { fontSize: 10, color: THEME.accentGold } },
        { type: 'box', content: '', x: 1.5, y: 3.8, w: 7, h: 0.8, options: { fill: { color: THEME.bgSecondary }, line: { color: THEME.accentGold, pt: 1 } } },
        { type: 'text', content: '✓ Same level peers • Same team • Same evaluation period', x: 1.5, y: 4, w: 7, h: 0.4, options: { fontSize: 11, color: THEME.textSecondary } },
      ],
    },
  ],
  'ai-capabilities': [
    {
      title: 'AI-Powered Intelligence',
      subtitle: 'LLM analyzes what humans miss',
      elements: [
        { type: 'text', content: '✅ Narrative validation: AI checks manager stories against actual data', x: 0.5, y: 1.4, w: 9, h: 0.4, options: { fontSize: 11, color: THEME.textSecondary } },
        { type: 'text', content: '🎯 Bias detection: Flags inconsistencies between feedback and metrics', x: 0.5, y: 1.85, w: 9, h: 0.4, options: { fontSize: 11, color: THEME.textSecondary } },
        { type: 'text', content: '📈 Promotion readiness: Objective assessment with development recommendations', x: 0.5, y: 2.3, w: 9, h: 0.4, options: { fontSize: 11, color: THEME.textSecondary } },
        { type: 'text', content: '💬 Conversational insights: Ask questions in natural language', x: 0.5, y: 2.75, w: 9, h: 0.4, options: { fontSize: 11, color: THEME.textSecondary } },
        { type: 'text', content: '👥 Comparative analysis: How does Employee A compare to their peers?', x: 0.5, y: 3.2, w: 9, h: 0.4, options: { fontSize: 11, color: THEME.textSecondary } },
        { type: 'box', content: '', x: 3, y: 3.8, w: 4, h: 1.2, options: { fill: { color: '4ECDC420' }, line: { color: '4ECDC4', pt: 2 } } },
        { type: 'text', content: '🧠', x: 3, y: 3.9, w: 4, h: 0.5, options: { fontSize: 28, color: THEME.textPrimary } },
        { type: 'text', content: 'Powered by LLM', x: 3, y: 4.5, w: 4, h: 0.3, options: { fontSize: 11, bold: true, color: '4ECDC4' } },
      ],
    },
  ],
  'promotion-pipeline': [
    {
      title: 'Promotion Pipeline',
      subtitle: 'Data-driven promotion decisions',
      elements: [
        { type: 'box', content: '', x: 0.5, y: 1.8, w: 2, h: 1.2, options: { fill: { color: THEME.bgSecondary }, line: { color: THEME.accentCyan, pt: 1 } } },
        { type: 'text', content: '📊', x: 0.5, y: 1.9, w: 2, h: 0.5, options: { fontSize: 24, color: THEME.textPrimary } },
        { type: 'text', content: 'Identify', x: 0.5, y: 2.5, w: 2, h: 0.3, options: { fontSize: 10, bold: true, color: THEME.accentCyan } },
        { type: 'text', content: '→', x: 2.6, y: 2.2, w: 0.5, h: 0.5, options: { fontSize: 18, color: THEME.accentGold } },
        { type: 'box', content: '', x: 3.2, y: 1.8, w: 2, h: 1.2, options: { fill: { color: THEME.bgSecondary }, line: { color: THEME.accentGold, pt: 1 } } },
        { type: 'text', content: '📋', x: 3.2, y: 1.9, w: 2, h: 0.5, options: { fontSize: 24, color: THEME.textPrimary } },
        { type: 'text', content: 'Assess', x: 3.2, y: 2.5, w: 2, h: 0.3, options: { fontSize: 10, bold: true, color: THEME.accentGold } },
        { type: 'text', content: '→', x: 5.3, y: 2.2, w: 0.5, h: 0.5, options: { fontSize: 18, color: THEME.accentGold } },
        { type: 'box', content: '', x: 5.9, y: 1.8, w: 2, h: 1.2, options: { fill: { color: THEME.bgSecondary }, line: { color: 'FFD700', pt: 1 } } },
        { type: 'text', content: '💬', x: 5.9, y: 1.9, w: 2, h: 0.5, options: { fontSize: 24, color: THEME.textPrimary } },
        { type: 'text', content: 'Discuss', x: 5.9, y: 2.5, w: 2, h: 0.3, options: { fontSize: 10, bold: true, color: 'FFD700' } },
        { type: 'text', content: '→', x: 8, y: 2.2, w: 0.5, h: 0.5, options: { fontSize: 18, color: THEME.accentGold } },
        { type: 'box', content: '', x: 8.5, y: 1.8, w: 1.3, h: 1.2, options: { fill: { color: '22C55E20' }, line: { color: THEME.green, pt: 1 } } },
        { type: 'text', content: '🎉', x: 8.5, y: 1.9, w: 1.3, h: 0.5, options: { fontSize: 24, color: THEME.textPrimary } },
        { type: 'text', content: 'Promote', x: 8.5, y: 2.5, w: 1.3, h: 0.3, options: { fontSize: 10, bold: true, color: THEME.green } },
        { type: 'box', content: '', x: 1.5, y: 3.3, w: 7, h: 1.5, options: { fill: { color: THEME.bgSecondary }, line: { color: THEME.accentCyan, pt: 1 } } },
        { type: 'text', content: 'Current Pipeline', x: 1.5, y: 3.4, w: 7, h: 0.4, options: { fontSize: 12, bold: true, color: THEME.accentCyan } },
        { type: 'text', content: '12 candidates identified • 8 in assessment • 5 ready for discussion', x: 1.5, y: 3.9, w: 7, h: 0.3, options: { fontSize: 11, color: THEME.textSecondary } },
        { type: 'text', content: '🎯 AI Recommendation: 3 high-confidence promotions', x: 1.5, y: 4.4, w: 7, h: 0.3, options: { fontSize: 11, color: THEME.green } },
      ],
    },
  ],
  'feature-showcase': [
    {
      title: 'Evalio Features',
      subtitle: 'Comprehensive performance management',
      elements: [
        { type: 'box', content: '', x: 0.5, y: 1.5, w: 2.8, h: 1.5, options: { fill: { color: '4ECDC420' }, line: { color: '4ECDC4', pt: 1 } } },
        { type: 'text', content: '📊 Dashboards', x: 0.5, y: 1.6, w: 2.8, h: 0.4, options: { fontSize: 12, bold: true, color: '4ECDC4' } },
        { type: 'text', content: 'Real-time metrics visualization', x: 0.5, y: 2.1, w: 2.8, h: 0.4, options: { fontSize: 9, color: THEME.textSecondary } },
        { type: 'box', content: '', x: 3.6, y: 1.5, w: 2.8, h: 1.5, options: { fill: { color: '6495ED20' }, line: { color: '6495ED', pt: 1 } } },
        { type: 'text', content: '🔗 Integrations', x: 3.6, y: 1.6, w: 2.8, h: 0.4, options: { fontSize: 12, bold: true, color: '6495ED' } },
        { type: 'text', content: 'JIRA, GitHub, Confluence', x: 3.6, y: 2.1, w: 2.8, h: 0.4, options: { fontSize: 9, color: THEME.textSecondary } },
        { type: 'box', content: '', x: 6.7, y: 1.5, w: 2.8, h: 1.5, options: { fill: { color: 'FFD70020' }, line: { color: 'FFD700', pt: 1 } } },
        { type: 'text', content: '🤖 AI Analysis', x: 6.7, y: 1.6, w: 2.8, h: 0.4, options: { fontSize: 12, bold: true, color: 'FFD700' } },
        { type: 'text', content: 'Smart recommendations', x: 6.7, y: 2.1, w: 2.8, h: 0.4, options: { fontSize: 9, color: THEME.textSecondary } },
        { type: 'box', content: '', x: 0.5, y: 3.2, w: 2.8, h: 1.5, options: { fill: { color: 'C9A22720' }, line: { color: THEME.accentGold, pt: 1 } } },
        { type: 'text', content: '📈 Reports', x: 0.5, y: 3.3, w: 2.8, h: 0.4, options: { fontSize: 12, bold: true, color: THEME.accentGold } },
        { type: 'text', content: 'Exportable analytics', x: 0.5, y: 3.8, w: 2.8, h: 0.4, options: { fontSize: 9, color: THEME.textSecondary } },
        { type: 'box', content: '', x: 3.6, y: 3.2, w: 2.8, h: 1.5, options: { fill: { color: '22C55E20' }, line: { color: THEME.green, pt: 1 } } },
        { type: 'text', content: '👥 Teams', x: 3.6, y: 3.3, w: 2.8, h: 0.4, options: { fontSize: 12, bold: true, color: THEME.green } },
        { type: 'text', content: 'Org hierarchy support', x: 3.6, y: 3.8, w: 2.8, h: 0.4, options: { fontSize: 9, color: THEME.textSecondary } },
        { type: 'box', content: '', x: 6.7, y: 3.2, w: 2.8, h: 1.5, options: { fill: { color: 'EF444420' }, line: { color: THEME.red, pt: 1 } } },
        { type: 'text', content: '🔒 Security', x: 6.7, y: 3.3, w: 2.8, h: 0.4, options: { fontSize: 12, bold: true, color: THEME.red } },
        { type: 'text', content: 'Role-based access', x: 6.7, y: 3.8, w: 2.8, h: 0.4, options: { fontSize: 9, color: THEME.textSecondary } },
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

// Add a multi-phase visualization slide with click-to-advance animations
function addAnimatedVisualizationSlide(
  pres: PptxGenJS,
  phases: AnimationPhase[],
  slideIndex: number
): void {
  const slide = pres.addSlide();
  slide.background = { color: THEME.bgPrimary };

  // Track animation sequence - each phase appears on click
  let animationIndex = 0;

  phases.forEach((phase, phaseIndex) => {
    const isFirstPhase = phaseIndex === 0;

    // Add title for this phase (changes on click for subsequent phases)
    slide.addText(phase.title, {
      x: 0.5,
      y: 0.2,
      w: 9.5,
      h: 0.6,
      fontSize: 28,
      bold: true,
      color: THEME.textPrimary,
      fontFace: 'Arial',
      // First phase visible immediately, others appear on click
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(isFirstPhase ? {} : { animate: { type: 'appear', delay: 0 } as any }),
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(isFirstPhase ? {} : { animate: { type: 'appear', delay: 0 } as any }),
    });

    // Add elements for this phase
    phase.elements.forEach((element) => {
      const baseOptions = {
        x: element.x,
        y: element.y,
        w: element.w,
        h: element.h,
        fontFace: 'Arial',
        align: 'center' as const,
        valign: 'middle' as const,
        ...element.options,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(isFirstPhase ? {} : { animate: { type: 'appear', delay: 0 } as any }),
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(isFirstPhase ? {} : { animate: { type: 'appear', delay: 0 } as any }),
        });
      } else if (element.type === 'text') {
        slide.addText(element.content, {
          ...baseOptions,
          align: element.options?.align as 'left' | 'center' | 'right' || 'center',
        });
      }
    });

    animationIndex++;
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

// Add a single phase slide (for visualizations with only 1 phase)
function addPhaseSlide(
  pres: PptxGenJS,
  phase: AnimationPhase,
  slideIndex: number
): void {
  const slide = pres.addSlide();

  // Set background
  slide.background = { color: THEME.bgPrimary };

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
  phase.elements.forEach((element) => {
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

// Add timeline slide
function addTimelineSlide(pres: PptxGenJS, slide: Slide): void {
  const pptSlide = pres.addSlide();
  pptSlide.background = { color: THEME.bgPrimary };

  // Title
  if (slide.content.title) {
    pptSlide.addText(slide.content.title, {
      x: 0.5,
      y: 0.3,
      w: 9.5,
      h: 0.6,
      fontSize: 28,
      bold: true,
      color: THEME.textPrimary,
      fontFace: 'Arial',
    });
  }

  // Timeline items
  if (slide.content.timeline && slide.content.timeline.length > 0) {
    const timeline = slide.content.timeline;
    const itemWidth = 9 / timeline.length;

    timeline.forEach((item, i) => {
      const x = 0.5 + i * itemWidth;

      // Year/Stage box
      pptSlide.addShape('rect', {
        x: x + 0.1,
        y: 1.2,
        w: itemWidth - 0.2,
        h: 0.6,
        fill: { color: THEME.accentCyan + '30' },
        line: { color: THEME.accentCyan, pt: 1 },
        rectRadius: 0.05,
      });

      pptSlide.addText(item.year || '', {
        x: x + 0.1,
        y: 1.25,
        w: itemWidth - 0.2,
        h: 0.5,
        fontSize: 12,
        bold: true,
        color: THEME.accentCyan,
        fontFace: 'Arial',
        align: 'center',
      });

      // Title
      pptSlide.addText(item.title || '', {
        x: x + 0.1,
        y: 2,
        w: itemWidth - 0.2,
        h: 0.5,
        fontSize: 14,
        bold: true,
        color: THEME.textPrimary,
        fontFace: 'Arial',
        align: 'center',
      });

      // Description
      pptSlide.addText(item.description || '', {
        x: x + 0.1,
        y: 2.5,
        w: itemWidth - 0.2,
        h: 1.5,
        fontSize: 10,
        color: THEME.textSecondary,
        fontFace: 'Arial',
        align: 'center',
        valign: 'top',
      });

      // Connector line (except for last item)
      if (i < timeline.length - 1) {
        pptSlide.addShape('rect', {
          x: x + itemWidth - 0.1,
          y: 1.45,
          w: 0.2,
          h: 0.1,
          fill: { color: THEME.accentGold },
          line: { pt: 0, color: 'transparent' },
        });
      }
    });
  }
}

// Add chart slide
function addChartSlide(pres: PptxGenJS, slide: Slide): void {
  const pptSlide = pres.addSlide();
  pptSlide.background = { color: THEME.bgPrimary };

  // Title
  if (slide.content.title) {
    pptSlide.addText(slide.content.title, {
      x: 0.5,
      y: 0.3,
      w: 9.5,
      h: 0.6,
      fontSize: 28,
      bold: true,
      color: THEME.textPrimary,
      fontFace: 'Arial',
    });
  }

  // Subtitle
  if (slide.content.subtitle) {
    pptSlide.addText(slide.content.subtitle, {
      x: 0.5,
      y: 0.85,
      w: 9.5,
      h: 0.4,
      fontSize: 14,
      color: THEME.textSecondary,
      fontFace: 'Arial',
    });
  }

  // Chart data as bar visualization
  if (slide.content.chartData && slide.content.chartData.length > 0) {
    const chartData = slide.content.chartData;
    const barWidth = 8 / chartData.length;
    const maxValue = Math.max(...chartData.map(d => d.value));

    chartData.forEach((item, i) => {
      const x = 1 + i * barWidth;
      const barHeight = (item.value / maxValue) * 2.5;

      // Bar
      pptSlide.addShape('rect', {
        x: x + 0.2,
        y: 4.2 - barHeight,
        w: barWidth - 0.4,
        h: barHeight,
        fill: { color: (item.color || THEME.accentCyan).replace('#', '') },
        line: { pt: 0, color: 'transparent' },
        rectRadius: 0.05,
      });

      // Value label
      pptSlide.addText(`${item.value}%`, {
        x: x + 0.2,
        y: 4.2 - barHeight - 0.4,
        w: barWidth - 0.4,
        h: 0.4,
        fontSize: 14,
        bold: true,
        color: (item.color || THEME.accentCyan).replace('#', ''),
        fontFace: 'Arial',
        align: 'center',
      });

      // Label
      pptSlide.addText(item.label || '', {
        x: x + 0.1,
        y: 4.4,
        w: barWidth - 0.2,
        h: 0.8,
        fontSize: 9,
        color: THEME.textSecondary,
        fontFace: 'Arial',
        align: 'center',
        valign: 'top',
      });
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

      // Debug logging
      console.log(`[PPTX Export] Visualization: ${slide.content.visualization}`);
      console.log(`[PPTX Export] Number of phases: ${phases.length}`);
      console.log(`[PPTX Export] Phase titles: ${phases.map(p => p.title).join(' | ')}`);

      // Export the FINAL phase (complete state) as one slide
      // This mirrors the web demo's final state for each visualization
      // Note: PowerPoint doesn't support web-like phase transitions within a slide
      const finalPhase = phases[phases.length - 1];
      console.log(`[PPTX Export] Selected final phase: ${finalPhase.title}`);
      addPhaseSlide(pres, finalPhase, slideCounter);
      slideCounter++;
    } else if (slide.type === 'content') {
      addContentSlide(pres, slide);
      slideCounter++;
    } else if (slide.type === 'timeline') {
      addTimelineSlide(pres, slide);
      slideCounter++;
    } else if (slide.type === 'chart') {
      addChartSlide(pres, slide);
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
