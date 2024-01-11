import Grid from './grid';

export type GridCoordinates = { row: number; column: number };

export type DrawCallback = (row: number, column: number, value: number) => void;
export type ResizeCallback = (newRows: number, newColumns: number) => void;
export type DrawExampleFn = (row: number, column: number, gridRadius: number) => number;

export type CartesianCoordinate = {
  x: number;
  y: number;
};

type Input = {
  rows: number;
  columns: number;
  drawCallback: DrawCallback;
};

const DEFAULT_VALUE = 0;

export default class CanvasGrid {
  private _grid: Grid<number>;
  private _drawCallback: DrawCallback;

  constructor({ rows, columns, drawCallback }: Input) {
    this._grid = new Grid<number>({ rows, columns, defaultValue: DEFAULT_VALUE });
    this._drawCallback = drawCallback;
  }

  get rows(): number {
    return this._grid.rows;
  }

  get columns(): number {
    return this._grid.columns;
  }

  decrementOrThrow = (row: number, column: number, amount = 1): number => {
    const element = this.getValueOrThrow(row, column);
    const newValue = Math.max(0, element - amount);
    this._grid.setOrThrow(row, column, newValue);
    this._drawCallback(row, column, newValue);

    return newValue;
  };

  incrementOrThrow = (row: number, column: number, amount = 1): number => {
    const element = this.getValueOrThrow(row, column);

    const newValue = element + amount;
    this._grid.setOrThrow(row, column, newValue);
    this._drawCallback(row, column, newValue);

    return newValue;
  };

  reset = (row: number, column: number) => {
    this._setValueOrThrow(row, column, DEFAULT_VALUE);
  };

  getValueOrThrow = (row: number, column: number): number => this._grid.getOrThrow(row, column);

  private _setValueOrThrow = (row: number, column: number, value: number): void => {
    this._grid.setOrThrow(row, column, value);
    this._drawCallback(row, column, value);
  };
}
