import { describe, expect, it } from 'vitest';

import { Rule } from './rule';

describe('Rule', () => {
  it('Should match when patterns match', () => {
    const rule = new Rule([0, 0, 1]);
    expect(rule.matches([0, 0, 1])).toBe(true);
  });

  it('Should not match when patterns do not match', () => {
    const rule = new Rule([0, 0, 1]);
    expect(rule.matches([0, 1, 0])).toBe(false);
  });

  it('Should throw when pattern lengths differ', () => {
    const rule = new Rule([0, 0, 1]);
    expect(() => rule.matches([0, 0, 1, 0])).toThrowError('Pattern length mismatch');
  });
});
