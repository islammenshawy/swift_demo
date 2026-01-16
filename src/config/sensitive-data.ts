/**
 * Sensitive Data Configuration
 *
 * This file provides access to configuration data that is resolved at build time.
 * Real values are stored in data.secret.yaml (gitignored, local only).
 * Sanitized placeholders are used when no valid passphrase is provided.
 *
 * Usage:
 *   import { getData, systems, metrics } from '@/config/sensitive-data';
 *
 *   // Get any value by key
 *   const system = getData('systems_TRADE_SYSTEM');
 *
 *   // Or use category objects directly
 *   const system = systems.TRADE_SYSTEM;
 *
 * Build with real data:
 *   BUILD_DATA_KEY=your-passphrase npm run build
 */

import {
  data,
  isRealData,
  systems,
  standards,
  organizations,
  people,
  metrics,
  amounts,
  timeframes,
  percentages,
  scale,
  type DataKey,
} from './resolved-data';

// Re-export everything for convenience
export {
  data,
  isRealData,
  systems,
  standards,
  organizations,
  people,
  metrics,
  amounts,
  timeframes,
  percentages,
  scale,
  type DataKey,
};

/**
 * Get a data value by its full key (e.g., "systems_TRADE_SYSTEM")
 */
export function getData(key: DataKey): string {
  return data[key] as string;
}

/**
 * Check if the app is using real (non-sanitized) data
 */
export function isUsingRealData(): boolean {
  return isRealData;
}

/**
 * Legacy class-based API for backwards compatibility
 */
class SensitiveDataStore {
  get(key: string): string {
    return (data as Record<string, string>)[key] || `[${key}]`;
  }

  app(name: string): string {
    return this.get(`systems_${name}`);
  }

  company(name: string): string {
    return this.get(`organizations_${name}`);
  }

  bank(name: string): string {
    return this.get(`organizations_${name}`);
  }

  person(name: string): string {
    return this.get(`people_${name}`);
  }

  metric(name: string): string {
    return this.get(`metrics_${name}`);
  }

  amount(name: string): string {
    return this.get(`amounts_${name}`);
  }

  time(name: string): string {
    return this.get(`timeframes_${name}`);
  }

  pct(name: string): string {
    return this.get(`percentages_${name}`);
  }

  isUsingRealData(): boolean {
    return isRealData;
  }
}

// Export singleton instance for legacy usage
export const sensitiveData = new SensitiveDataStore();
