type Input<T> = {
  rows: number;
  columns: number;
  defaultValue: T;
};

export default class MapGrid<T> {
  private _grid: Map<number, Map<number, T>>;
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

    this._grid = new Map();
    for (let r = 0; r < this._rows; r++) {
      const gridRow = new Map<number, T>();
      for (let c = 0; c < this._columns; c++) {
        gridRow.set(c, this._defaultValue);
      }

      this._grid.set(r, gridRow);
    }
  }

  get rows(): number {
    return this._rows;
  }

  get columns(): number {
    return this._columns;
  }

  get = (row: number, column: number): T | undefined => this._grid.get(row)?.get(column);
  getOrThrow = (row: number, column: number): T => {
    const gridRow = this._grid.get(row);
    if (!gridRow) {
      throw new Error(`Invalid row: ${row}`);
    }

    const element = gridRow.get(column);
    if (element === undefined) {
      throw new Error(`Invalid column: ${column}`);
    }

    return element;
  };

  maybeResize = (newRows: number, newColumns: number): boolean => {
    if (newRows !== this._rows && newColumns !== this._columns) {
      this._resizeGrid(newRows, newColumns);
      return true;
    }

    return false;
  };

  set = (row: number, column: number, value: T): void => {
    // Can't add new rows.
    // Can add new columns.
    this._grid.get(row)?.set(column, value);
  };

  setOrThrow = (row: number, column: number, value: T): void => {
    const gridRow = this._grid.get(row);
    if (!gridRow) {
      throw new Error(`Invalid row: ${row}`);
    }

    const element = gridRow.get(column);
    if (element === undefined) {
      throw new Error(`Invalid column: ${column}`);
    }

    gridRow.set(column, value);
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
      for (let r = oldRows + 1; r < newRows; r++) {
        const gridRow = new Map<number, T>();
        for (let c = 0; c < newColumns; c++) {
          gridRow.set(c, this._defaultValue);
        }

        this._grid.set(r, gridRow);
      }
    } else {
      for (let r = newRows; r < oldRows; r++) {
        this._grid.delete(r);
      }
    }

    if (newColumns > oldColumns) {
      for (let r = 0; r < newRows; r++) {
        for (let c = oldColumns; c < newColumns; c++) {
          this.set(r, c, this._defaultValue);
        }
      }
    } else {
      for (let r = 0; r < newRows; r++) {
        for (let c = newColumns; c < oldColumns; c++) {
          this._grid.get(r)?.delete(c);
        }
      }
    }
  };
}
