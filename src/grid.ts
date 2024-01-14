type Input<T> = {
  rows: number;
  columns: number;
  defaultValue: T;
  getCellInitialValue?: (row: number, column: number) => T;
};

export default class Grid<T> {
  private _grid: Array<Array<T>>;
  private _defaultValue: T;
  private _rows: number;
  private _columns: number;

  constructor({
    rows,
    columns,
    defaultValue,
    getCellInitialValue = (_row, _column) => defaultValue,
  }: Input<T>) {
    if (rows < 0) {
      throw new Error('Rows must be a positive integer.');
    }

    if (columns < 0) {
      throw new Error('Columns must be a positive integer.');
    }

    this._defaultValue = defaultValue;
    this._rows = Math.floor(rows);
    this._columns = Math.floor(columns);

    this._grid = Array.from({ length: this._rows }, (_, row) =>
      Array.from({ length: this._columns }, (_, column) => getCellInitialValue(row, column))
    );
  }

  get rows(): number {
    return this._rows;
  }

  get columns(): number {
    return this._columns;
  }

  get = (row: number, column: number): T | undefined => this._grid[row]?.[column];
  getOrThrow = (row: number, column: number): T => {
    const element = this.getRowOrThrow(row)[column];
    if (element === undefined) {
      throw new Error(`Invalid column: ${column}`);
    }

    return element;
  };

  getRowOrThrow = (row: number): Array<T> => {
    const gridRow = this._grid[row];
    if (!gridRow) {
      throw new Error(`Invalid row: ${row}`);
    }

    return gridRow;
  };

  setRowOrThrow = (index: number, row: Array<T>): void => {
    if (!this._grid[index]) {
      throw new Error(`Invalid row: ${index}`);
    }

    this._grid[index] = row;
  };

  maybeExpand = (newRows: number, numColumnsToExpandBy: number): boolean => {
    if (newRows === this._rows && numColumnsToExpandBy === 0) {
      return false;
    }

    this._expandGrid(newRows, numColumnsToExpandBy);
    return true;
  };

  set = (row: number, column: number, value: T): void => {
    // Can't add new rows.
    // Can add new columns.
    const gridRow = this._grid[row];
    if (gridRow) {
      gridRow[column] = value;
    }
  };

  setOrThrow = (row: number, column: number, value: T): void => {
    const gridRow = this.getRowOrThrow(row);
    const element = gridRow[column];
    if (element === undefined) {
      throw new Error(`Invalid column: ${column}`);
    }

    gridRow[column] = value;
  };

  private _expandGrid = (newRows: number, numColumnsToExpandBy: number): void => {
    const oldRows = this._rows;

    if (newRows === oldRows && numColumnsToExpandBy === 0) {
      return;
    }

    if (newRows < oldRows || numColumnsToExpandBy < 0) {
      throw new Error('Can only expand');
    }

    this._rows = newRows;
    this._columns = this._columns + 2 * numColumnsToExpandBy;

    const newRow = Array.from({ length: this._columns }, () => this._defaultValue);
    for (let r = oldRows; r < newRows; r++) {
      this._grid[r] = [...newRow];
    }

    if (numColumnsToExpandBy === 0) {
      return;
    }

    const pad = Array.from({ length: numColumnsToExpandBy }, () => this._defaultValue);
    for (let r = 0; r < newRows; r++) {
      this._grid[r] = [...pad, ...this._grid[r]!, ...pad];
    }
  };
}
