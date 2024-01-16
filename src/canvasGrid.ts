import { Automaton } from './automaton';

export type GridCoordinates = { row: number; column: number };

export type DrawCallback = (row: number, column: number, value: number) => void;
export type DrawExampleFn = (row: number, column: number, gridRadius: number) => number;

export type CartesianCoordinate = {
  x: number;
  y: number;
};

type Input = {
  rows: number;
  columns: number;
  drawCallback: DrawCallback;
  getCellInitialValue?: (row: number, column: number) => number;
};

const DEFAULT_VALUE = 0;

export default class CanvasGrid {
  private _automaton: Automaton;
  private _drawCallback: DrawCallback;

  constructor({
    rows,
    columns,
    drawCallback,
    getCellInitialValue = (_row, _column) => DEFAULT_VALUE,
  }: Input) {
    this._automaton = new Automaton({
      rows,
      columns,
      getCellInitialValue,
    });
    this._drawCallback = drawCallback;
  }

  get rows(): number {
    return this._automaton.rows;
  }

  get columns(): number {
    return this._automaton.columns;
  }

  decrementOrThrow = (row: number, column: number, amount = 1): number => {
    const element = this.getValueOrThrow(row, column);
    const newValue = Math.max(0, element - amount);
    this._automaton.setOrThrow(row, column, newValue);
    this._drawCallback(row, column, newValue);

    return newValue;
  };

  incrementOrThrow = (row: number, column: number, amount = 1): number => {
    const element = this.getValueOrThrow(row, column);

    const newValue = element + amount;
    this._automaton.setOrThrow(row, column, newValue);
    this._drawCallback(row, column, newValue);

    return newValue;
  };

  reset = (row: number, column: number) => {
    this._setValueOrThrow(row, column, DEFAULT_VALUE);
  };

  getValueOrThrow = (row: number, column: number): number =>
    this._automaton.getOrThrow(row, column);

  evolve = () => this._automaton.checkNeighbors();

  private _setValueOrThrow = (row: number, column: number, value: number): void => {
    this._automaton.setOrThrow(row, column, value);
    this._drawCallback(row, column, value);
  };

  draw = () => {
    for (let row = 0; row < this.rows; row++) {
      for (let column = 0; column < this.columns; column++) {
        this._drawCallback(row, column, this._automaton.getOrThrow(row, column));
      }
    }
  };
}
