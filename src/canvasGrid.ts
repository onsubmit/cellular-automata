import MapGrid from './mapGrid';

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
  resizeCallback: ResizeCallback;
};

export default class CanvasGrid {
  private _grid: MapGrid<number>;
  private _drawCallback: DrawCallback;
  private _resizeCallback: ResizeCallback;

  constructor({ rows, columns, drawCallback, resizeCallback }: Input) {
    this._grid = new MapGrid<number>({ rows, columns, defaultValue: 0 });
    this._drawCallback = drawCallback;
    this._resizeCallback = resizeCallback;
  }

  get rows(): number {
    return this._grid.rows;
  }

  get columns(): number {
    return this._grid.columns;
  }

  redraw = () => {
    for (let row = 0; row <= this.rows; row++) {
      for (let column = 0; column <= this.columns; column++) {
        const value = this._grid.getOrThrow(row, column);
        this._drawCallback(row, column, value);
      }
    }
  };

  decrementOrThrow = (row: number, column: number, amount = 1): number => {
    const element = this.getValueOrThrow(row, column);
    const newValue = Math.max(0, element - amount);
    this._grid.setOrThrow(row, column, newValue);
    this._drawCallback(row, column, newValue);

    return newValue;
  };

  incrementMaybeResize = (row: number, column: number): number | undefined => {
    const didResize = this.maybeResize(Math.max(this.rows, row), Math.max(this.columns, column));
    const value = this.getValueOrThrow(row, column);

    const newValue = value + 1;
    this._setValueOrThrow(row, column, newValue);

    if (didResize) {
      this._resizeCallback(this.rows, this.columns);
    }

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
    this._setValueOrThrow(row, column, 0);
  };

  maybeResize = (newRows: number, newColumns: number) =>
    this._grid.maybeResize(newRows, newColumns);

  getValueOrThrow = (row: number, column: number): number => this._grid.getOrThrow(row, column);

  private _setValueOrThrow = (row: number, column: number, value: number): void => {
    this._grid.setOrThrow(row, column, value);
    this._drawCallback(row, column, value);
  };
}
