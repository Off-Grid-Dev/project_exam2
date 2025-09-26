import { describe, it, expect } from 'vitest';
import { expandRangeToISODates, isoDateAtUtcMidnight } from '../dates';

describe('date utils', () => {
  it('expands a short range inclusive', () => {
    const from = '2025-09-10T00:00:00.000Z';
    const to = '2025-09-12T00:00:00.000Z';
    const result = expandRangeToISODates(from, to);
    expect(result).toEqual([
      '2025-09-10T00:00:00.000Z',
      '2025-09-11T00:00:00.000Z',
      '2025-09-12T00:00:00.000Z',
    ]);
  });

  it('normalizes times to UTC-midnight', () => {
    const d = '2025-09-10T13:45:00.000Z';
    expect(isoDateAtUtcMidnight(d)).toBe('2025-09-10T00:00:00.000Z');
  });
});
