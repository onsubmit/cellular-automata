import { Rule } from './rule';

export class ElementaryAutomaton {
  private _state: Array<number>;
  private _rules: Array<Rule>;

  constructor(state: Array<number>, rules: Array<Rule>) {
    this._state = state;
    this._rules = rules;
  }

  evolve = (): void => {
    const state = Array.from({ length: this._state.length }, () => 0);
    for (let c = 0; c < this._state.length; c++) {
      const pattern: Array<number> = [];
      for (let i = c - 1; i <= c + 1; i++) {
        pattern.push(this._state.at(i)!);
      }

      for (const rule of this._rules) {
        if (rule.matches(pattern)) {
          state[c] = 1;
          break;
        }
      }
    }
  };
}
