#!/usr/bin/env node
/**
 * Build script that replaces sanitized values with real values during build
 *
 * Usage:
 *   node scripts/build-with-data.mjs              # Build with sanitized values
 *   BUILD_DATA_KEY=xxx node scripts/build-with-data.mjs  # Build with real values
 *   node scripts/build-with-data.mjs sanitize    # Sanitize source files
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Files that contain sensitive values to replace
const TARGET_FILES = [
  'src/components/presentation/slides/InteractiveSlide.tsx',
  'src/lib/pptx-export.ts',
  'scripts/build-standalone.ts',
  'src/app/api/export-static/route.ts',
  'src/standalone/StandaloneApp.tsx',
];

// Comprehensive mappings - real values to sanitized
// Order matters - longer strings first to avoid partial replacements
const REPLACEMENTS = [
  // Full phrases first
  ['Trade Processing System', 'Trade System'],
  ['Accounts Payable/Receivable', 'Accounts Platform'],
  ['Trade Conversion Front-End', 'Unified Entry Point'],
  ['Trade Conversion Frontend', 'Unified Entry Point'],
  ['Trade Conversion', 'Data Conversion'],

  // Combined system references
  ['TPS & APAR', 'Platform A & Platform B'],
  ['TPS, APAR', 'Platform A, Platform B'],
  ['TPS vs APAR', 'Platform A vs Platform B'],
  ['TPS or APAR', 'Platform A or Platform B'],
  ['APAR/SCF', 'Platform B/SCF'],
  ['& TCFE', '& Frontend'],

  // In sentences/labels
  ['TPS Core', 'Platform A Core'],
  ['TPS System', 'Platform A System'],
  ['TPS Platform', 'Platform A'],
  ['APAR System', 'Platform B System'],
  ['APAR Platform', 'Platform B'],
  ['TCFE -', 'Unified Frontend -'],

  // Variable names
  ['showTCFE', 'showFrontend'],

  // Quoted strings
  ["'TPS'", "'Platform A'"],
  ['"TPS"', '"Platform A"'],
  ["'APAR'", "'Platform B'"],
  ['"APAR"', '"Platform B"'],
  ["'TCFE'", "'Unified Frontend'"],
  ['"TCFE"', '"Unified Frontend"'],

  // In JSX - various patterns
  ['>TPS<', '>Platform A<'],
  ['>APAR<', '>Platform B<'],
  ['>TCFE<', '>Unified Frontend<'],
  ['>\n              TPS\n', '>\n              Platform A\n'],
  ['>\n              APAR\n', '>\n              Platform B\n'],

  // With emoji labels
  ['🏦 TPS', '🏦 Platform A'],
  ['💳 APAR', '💳 Platform B'],
  ['🔄 TCFE', '🔄 Unified Frontend'],

  // API Gateway
  ['API Gateway / TCFE', 'API Gateway / Frontend'],

  // Comments
  ['// TPS Platform', '// Platform A'],
  ['// APAR Platform', '// Platform B'],
  ['// TCFE', '// Unified Frontend'],
  ['// 0: Initial - TPS & APAR', '// 0: Initial - Platforms'],
  ['// 1: Highlight duplication in TPS & APAR', '// 1: Highlight duplication'],
  ['// 2: TCFE appears', '// 2: Frontend appears'],
  ['/* TPS', '/* Platform A'],
  ['/* APAR', '/* Platform B'],
  ['// TPS Metrics', '// Platform A Metrics'],
  ['// APAR Metrics', '// Platform B Metrics'],
  ['// Line to TPS', '// Line to Platform A'],
  ['// Line to APAR', '// Line to Platform B'],
  ['// From TPS', '// From Platform A'],
  ['// From APAR', '// From Platform B'],
  ['// TPS &', '// Platform A &'],

  // Text content patterns
  ['Introducing TCFE', 'Introducing Unified Frontend'],
  ['TCFE connects', 'Frontend connects'],
  ['Direct TCFE', 'Direct Frontend'],
  ['Used by TPS, APAR & TCFE', 'Used by Platform A, Platform B & Frontend'],

  // Standalone in text with spaces
  [' TPS ', ' Platform A '],
  [' APAR ', ' Platform B '],
  [' TCFE ', ' Unified Frontend '],
  ['(TPS)', '(Platform A)'],
  ['(APAR)', '(Platform B)'],
  ['(TCFE)', '(Unified Frontend)'],
];

// Store original file contents for restoration
const originalContents = new Map();

function readConfig() {
  const configPath = path.join(projectRoot, 'src', 'config', 'resolved-data.ts');
  if (!fs.existsSync(configPath)) {
    console.error('[build-with-data] resolved-data.ts not found. Run resolve-data.mjs first.');
    process.exit(1);
  }
  const content = fs.readFileSync(configPath, 'utf8');
  return {
    isRealData: content.includes('isRealData = true'),
  };
}

function backupFile(filePath) {
  const fullPath = path.join(projectRoot, filePath);
  if (fs.existsSync(fullPath)) {
    originalContents.set(filePath, fs.readFileSync(fullPath, 'utf8'));
  }
}

function restoreFile(filePath) {
  const fullPath = path.join(projectRoot, filePath);
  if (originalContents.has(filePath)) {
    fs.writeFileSync(fullPath, originalContents.get(filePath));
    console.log(`[build-with-data] Restored: ${filePath}`);
  }
}

function sanitizeFile(filePath) {
  const fullPath = path.join(projectRoot, filePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`[build-with-data] File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;

  for (const [realValue, sanitizedValue] of REPLACEMENTS) {
    if (content.includes(realValue)) {
      content = content.split(realValue).join(sanitizedValue);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(fullPath, content);
    console.log(`[build-with-data] Sanitized: ${filePath}`);
  } else {
    console.log(`[build-with-data] No changes: ${filePath}`);
  }
}

function replaceWithRealValues(filePath) {
  const fullPath = path.join(projectRoot, filePath);
  if (!fs.existsSync(fullPath)) return;

  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;

  // Reverse the replacements - sanitized → real
  for (const [realValue, sanitizedValue] of REPLACEMENTS) {
    if (content.includes(sanitizedValue)) {
      content = content.split(sanitizedValue).join(realValue);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(fullPath, content);
    console.log(`[build-with-data] Replaced with real values: ${filePath}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'build';

  console.log('[build-with-data] Starting build process...');

  // Step 1: Run resolve-data to generate config
  console.log('[build-with-data] Resolving data configuration...');
  execSync('node scripts/resolve-data.mjs', { cwd: projectRoot, stdio: 'inherit' });

  // Step 2: Read the config
  const config = readConfig();
  console.log(`[build-with-data] Using ${config.isRealData ? 'REAL' : 'SANITIZED'} data`);

  if (command === 'sanitize') {
    // Just sanitize files and exit
    console.log('[build-with-data] Sanitizing source files...');
    for (const file of TARGET_FILES) {
      sanitizeFile(file);
    }
    console.log('[build-with-data] Sanitization complete!');
    return;
  }

  if (command === 'restore') {
    // Restore to real values (for local development)
    console.log('[build-with-data] Restoring real values...');
    for (const file of TARGET_FILES) {
      replaceWithRealValues(file);
    }
    console.log('[build-with-data] Restoration complete!');
    return;
  }

  // Step 3: If using real data, backup and replace values
  if (config.isRealData) {
    console.log('[build-with-data] Backing up source files...');
    for (const file of TARGET_FILES) {
      backupFile(file);
    }

    console.log('[build-with-data] Replacing with real values...');
    for (const file of TARGET_FILES) {
      replaceWithRealValues(file);
    }
  }

  // Step 4: Run the actual build
  try {
    console.log('[build-with-data] Running build...');
    execSync('npm run build:standalone && next build', { cwd: projectRoot, stdio: 'inherit' });
    console.log('[build-with-data] Build completed successfully!');
  } catch (error) {
    console.error('[build-with-data] Build failed:', error.message);
    process.exit(1);
  } finally {
    // Step 5: Restore original files (if we modified them)
    if (config.isRealData) {
      console.log('[build-with-data] Restoring source files...');
      for (const file of TARGET_FILES) {
        restoreFile(file);
      }
    }
  }
}

main().catch(console.error);
