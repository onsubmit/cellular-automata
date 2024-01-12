export class Rule {
  private readonly _pattern: ReadonlyArray<number>;

  constructor(pattern: Array<number>) {
    this._pattern = pattern;
  }

  get length(): number {
    return this._pattern.length;
  }

  matches = (pattern: Array<number>): boolean => {
    if (this._pattern.length !== pattern.length) {
      throw new Error('Pattern length mismatch');
    }

    for (let i = 0; i < this._pattern.length; i++) {
      if (this._pattern[i] !== pattern[i]) {
        return false;
      }
    }

    return true;
  };
}
