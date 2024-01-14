import memoize from 'memoizee';

export class Rule {
  private readonly _pattern: ReadonlyArray<number>;

  constructor(pattern: Array<number>) {
    this._pattern = pattern;
  }

  get length(): number {
    return this._pattern.length;
  }

  private static _matches = memoize(
    (pattern1: ReadonlyArray<number>, pattern2: Array<number>) => {
      if (pattern1.length !== pattern2.length) {
        throw new Error('Pattern length mismatch');
      }

      for (let i = 0; i < pattern1.length; i++) {
        if (pattern1[i] !== pattern2[i]) {
          return false;
        }
      }

      return true;
    },
    { primitive: true }
  );

  matches = (pattern: Array<number>): boolean => Rule._matches(this._pattern, pattern);
}
