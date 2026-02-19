/**
 * Code Validator for SlideForge Coding Agent
 *
 * Validates generated React components for security and correctness
 * before execution in Sandpack
 */

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
  sanitizedCode?: string
}

export interface ValidationError {
  type: 'security' | 'syntax' | 'structure'
  message: string
  line?: number
}

export interface ValidationWarning {
  type: 'performance' | 'best-practice'
  message: string
  line?: number
}

// Forbidden patterns that indicate potential security issues
const FORBIDDEN_PATTERNS = [
  { pattern: /\beval\s*\(/, message: 'eval() is not allowed' },
  { pattern: /\bFunction\s*\(/, message: 'Function constructor is not allowed' },
  { pattern: /\bfetch\s*\(/, message: 'fetch() is not allowed in slide components' },
  { pattern: /\bXMLHttpRequest\b/, message: 'XMLHttpRequest is not allowed' },
  { pattern: /\blocalStorage\b/, message: 'localStorage is not allowed' },
  { pattern: /\bsessionStorage\b/, message: 'sessionStorage is not allowed' },
  { pattern: /\bindexedDB\b/, message: 'indexedDB is not allowed' },
  { pattern: /\bdocument\.cookie\b/, message: 'document.cookie is not allowed' },
  { pattern: /\bwindow\.open\b/, message: 'window.open is not allowed' },
  { pattern: /\bwindow\.location\b/, message: 'window.location is not allowed' },
  { pattern: /\bnavigator\b/, message: 'navigator API is not allowed' },
  { pattern: /\bimport\s*\(/, message: 'Dynamic imports are not allowed' },
  { pattern: /\brequire\s*\(/, message: 'require() is not allowed' },
  { pattern: /\b__proto__\b/, message: '__proto__ access is not allowed' },
  { pattern: /\bconstructor\s*\[/, message: 'constructor access via bracket notation is not allowed' },
  { pattern: /dangerouslySetInnerHTML/, message: 'dangerouslySetInnerHTML is not allowed' },
  { pattern: /javascript:/, message: 'javascript: URLs are not allowed' },
  { pattern: /data:text\/html/, message: 'data: HTML URLs are not allowed' },
]

// Allowed imports
const ALLOWED_IMPORTS = [
  'react',
  'framer-motion',
  '@react-three/fiber',
  '@react-three/drei',
  'recharts',
  'lucide-react',
  'three',
]

// Required patterns for a valid component
const REQUIRED_PATTERNS = [
  { pattern: /export\s+default\s+function/, message: 'Must have a default export function' },
  { pattern: /\{\s*data\s*\}/, message: 'Component must accept a data prop' },
]

/**
 * Main validation function
 */
export function validateCode(code: string): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []

  // Check for forbidden patterns (security)
  for (const { pattern, message } of FORBIDDEN_PATTERNS) {
    if (pattern.test(code)) {
      const match = code.match(pattern)
      const line = match ? getLineNumber(code, match.index || 0) : undefined
      errors.push({ type: 'security', message, line })
    }
  }

  // Check for required patterns (structure)
  for (const { pattern, message } of REQUIRED_PATTERNS) {
    if (!pattern.test(code)) {
      errors.push({ type: 'structure', message })
    }
  }

  // Validate imports
  const importErrors = validateImports(code)
  errors.push(...importErrors)

  // Check file size (max 50KB)
  if (code.length > 50000) {
    errors.push({
      type: 'structure',
      message: `Code exceeds maximum size (${Math.round(code.length / 1000)}KB > 50KB)`,
    })
  }

  // Performance warnings
  if (code.includes('useEffect') && !code.includes('// eslint')) {
    const useEffectCount = (code.match(/useEffect/g) || []).length
    if (useEffectCount > 3) {
      warnings.push({
        type: 'performance',
        message: `Multiple useEffect hooks (${useEffectCount}) may impact performance`,
      })
    }
  }

  // Check for inline styles (prefer Tailwind)
  if (/style\s*=\s*\{\{/.test(code)) {
    warnings.push({
      type: 'best-practice',
      message: 'Consider using Tailwind classes instead of inline styles',
    })
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    sanitizedCode: errors.length === 0 ? code : undefined,
  }
}

/**
 * Validate import statements
 */
function validateImports(code: string): ValidationError[] {
  const errors: ValidationError[] = []

  // Find all import statements
  const importRegex = /import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)\s+from\s+)?['"]([^'"]+)['"]/g
  let match

  while ((match = importRegex.exec(code)) !== null) {
    const importPath = match[1]

    // Check if it's an allowed import
    const isAllowed = ALLOWED_IMPORTS.some(
      (allowed) => importPath === allowed || importPath.startsWith(allowed + '/')
    )

    // Allow relative imports within the component (like ./utils)
    const isRelative = importPath.startsWith('.') || importPath.startsWith('/')

    if (!isAllowed && !isRelative) {
      errors.push({
        type: 'security',
        message: `Import '${importPath}' is not in the allowed list`,
        line: getLineNumber(code, match.index),
      })
    }
  }

  return errors
}

/**
 * Get line number from character index
 */
function getLineNumber(code: string, index: number): number {
  const lines = code.substring(0, index).split('\n')
  return lines.length
}

/**
 * Sanitize code by removing potentially dangerous patterns
 * (Use with caution - may break functionality)
 */
export function sanitizeCode(code: string): string {
  let sanitized = code

  // Remove inline event handlers
  sanitized = sanitized.replace(/on\w+\s*=\s*\{[^}]*\}/g, '')

  // Remove any script tags (shouldn't be there, but just in case)
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

  return sanitized
}

/**
 * Quick check for obvious issues before full validation
 */
export function quickCheck(code: string): boolean {
  // Must have export default
  if (!/export\s+default/.test(code)) return false

  // Must not have obvious security issues
  if (/\beval\s*\(/.test(code)) return false
  if (/\bfetch\s*\(/.test(code)) return false

  return true
}

/**
 * Format validation result as human-readable string
 */
export function formatValidationResult(result: ValidationResult): string {
  const lines: string[] = []

  if (result.valid) {
    lines.push('✓ Code validation passed')
  } else {
    lines.push('✗ Code validation failed')
  }

  if (result.errors.length > 0) {
    lines.push('\nErrors:')
    for (const error of result.errors) {
      const lineInfo = error.line ? ` (line ${error.line})` : ''
      lines.push(`  • [${error.type}] ${error.message}${lineInfo}`)
    }
  }

  if (result.warnings.length > 0) {
    lines.push('\nWarnings:')
    for (const warning of result.warnings) {
      const lineInfo = warning.line ? ` (line ${warning.line})` : ''
      lines.push(`  • [${warning.type}] ${warning.message}${lineInfo}`)
    }
  }

  return lines.join('\n')
}
