import { describe, expect, it } from 'vitest';

import { ElementaryAutomaton } from './elementaryAutomaton';
import { Rule } from './rule';
import { Rules } from './rules';

describe('ElementaryAutomaton', () => {
  it('Should evolve', () => {
    const rules = new Rules(
      new Rule([1, 0, 0]),
      new Rule([0, 1, 1]),
      new Rule([0, 1, 0]),
      new Rule([0, 0, 1])
    );

    const automaton = new ElementaryAutomaton([0, 1, 0], rules);
    expect(automaton.state).toEqual([0, 1, 0]);

    expect(automaton.evolve().state).toEqual([0, 1, 1, 1, 0]);
    expect(automaton.evolve().state).toEqual([0, 1, 1, 0, 0, 1, 0]);
    expect(automaton.evolve().state).toEqual([0, 1, 1, 0, 1, 1, 1, 1, 0]);
  });
});
