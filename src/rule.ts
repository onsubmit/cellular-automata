export class Rule {
  private _pattern: Array<number>;

  constructor(pattern: Array<number>) {
    this._pattern = pattern;
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
