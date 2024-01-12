import { Rules } from './rules';

export class ElementaryAutomaton {
  private _state: Array<number>;
  private readonly _rules: Rules;

  get state(): ReadonlyArray<number> {
    return this._state;
  }

  constructor(state: Array<number>, rules: Rules) {
    this._state = state;
    this._rules = rules;
  }

  evolve = (): this => {
    const state: Array<number> = [];
    for (let c = 1 - this._rules.length; c < this._state.length; c++) {
      const pattern: Array<number> = [];
      for (let i = c; i < c + this._rules.length; i++) {
        pattern.push(this._state[i] ?? 0);
      }

      const hasMatch = this._rules.hasMatch(pattern);
      state.push(hasMatch ? 1 : 0);
    }

    this._state = state;

    return this;
  };
}
