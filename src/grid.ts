type Input<T> = {
  rows: number;
  columns: number;
  defaultValue: T;
};

export default class Grid<T> {
  private _grid: Array<Array<T>>;
  private _defaultValue: T;
  private _rows: number;
  private _columns: number;

  constructor({ rows, columns, defaultValue }: Input<T>) {
    if (rows < 0) {
      throw new Error('Rows must be a positive integer.');
    }

    if (columns < 0) {
      throw new Error('Columns must be a positive integer.');
    }

    this._defaultValue = defaultValue;
    this._rows = Math.floor(rows);
    this._columns = Math.floor(columns);

    this._grid = Array.from({ length: this._rows }, () =>
      Array.from({ length: this._columns }, () => this._defaultValue)
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

  maybeResize = (newRows: number, newColumns: number): boolean => {
    if (newRows === this._rows && newColumns === this._columns) {
      return false;
    }

    this._resizeGrid(newRows, newColumns);
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

  private _resizeGrid = (newRows: number, newColumns: number): void => {
    const oldRows = this._rows;
    const oldColumns = this._columns;

    this._rows = newRows;
    this._columns = newColumns;

    if (newRows === oldRows && newColumns === oldColumns) {
      return;
    }

    if (newRows > oldRows) {
      for (let r = oldRows; r < newRows; r++) {
        this._grid[r] = Array.from({ length: newColumns }, () => this._defaultValue);
      }
    } else {
      this._grid.length = newRows;
    }

    if (newColumns > oldColumns) {
      for (let r = 0; r < newRows; r++) {
        for (let c = oldColumns; c < newColumns; c++) {
          this._grid[r]![c] = this._defaultValue;
        }
      }
    } else {
      for (let r = 0; r < newRows; r++) {
        this._grid[r]!.length = newColumns;
      }
    }
  };
}
