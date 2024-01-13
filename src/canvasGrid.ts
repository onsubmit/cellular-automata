import Grid from './grid';

export type GridCoordinates = { row: number; column: number };

export type DrawCallback = (row: number, column: number, value: number) => void;
export type ResizeCallback = () => void;
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
  getCellInitialValue?: (row: number, column: number) => number;
};

const DEFAULT_VALUE = 0;

export default class CanvasGrid {
  private _grid: Grid<number>;
  private _drawCallback: DrawCallback;
  private _resizeCallback: ResizeCallback;

  constructor({
    rows,
    columns,
    drawCallback,
    resizeCallback,
    getCellInitialValue = (_row, _column) => DEFAULT_VALUE,
  }: Input) {
    this._grid = new Grid<number>({
      rows,
      columns,
      defaultValue: DEFAULT_VALUE,
      getCellInitialValue,
    });
    this._drawCallback = drawCallback;
    this._resizeCallback = resizeCallback;
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
  getRowOrThrow = (row: number): Array<number> => this._grid.getRowOrThrow(row);
  setRowOrThrow = (index: number, row: Array<number>): void => {
    let didExpand = false;
    if (index >= this._grid.rows) {
      didExpand = this._grid.maybeExpand(index + 1, 0);
    }

    if (row.length >= this._grid.columns) {
      const delta = Math.ceil((row.length - this._grid.columns) / 2);
      didExpand = this._grid.maybeExpand(this._grid.rows, delta) || didExpand;
    }

    for (let c = 0; c < this._grid.columns; c++) {
      this._setValueOrThrow(index, c, row[c] ?? DEFAULT_VALUE);
    }

    if (didExpand) {
      this._resizeCallback();
    }
  };

  private _setValueOrThrow = (row: number, column: number, value: number): void => {
    this._grid.setOrThrow(row, column, value);
    this._drawCallback(row, column, value);
  };
}
