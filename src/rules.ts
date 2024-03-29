import memoizee from 'memoizee';

import { Rule } from './rule';

export class Rules {
  private readonly _rules: ReadonlyArray<Rule>;
  private readonly _length: number;

  get rules(): ReadonlyArray<Rule> {
    return this._rules;
  }

  get length(): number {
    return this._length;
  }

  private static _hasMatch = memoizee(
    (rules: ReadonlyArray<Rule>, pattern: Array<number>) =>
      rules.some((rule) => rule.matches(pattern)),
    { primitive: true }
  );

  static from = (ruleNumber: number): Rules => {
    const rules: Array<Rule> = [];

    const binary = [...ruleNumber.toString(2).padStart(8, '0')].reverse();
    for (let i = 0; i < binary.length; i++) {
      if (binary[i] === '1') {
        rules.push(Rule.from(i));
      }
    }

    return new Rules(...rules);
  };

  constructor(...rules: Array<Rule>) {
    if (rules.length === 0) {
      throw new Error('Empty ruleset');
    }

    const length = rules[0]!.length;
    if (rules.some((rule) => rule.length !== length)) {
      throw new Error('All rules must have the same length');
    }

    this._rules = rules;
    this._length = length;
  }

  hasMatch = (pattern: Array<number>): boolean => Rules._hasMatch(this._rules, pattern);

  [Symbol.iterator]() {
    let index = -1;

    return {
      next: () => ({ value: this._rules[++index]!, done: index >= this._rules.length }),
    };
  }
}
