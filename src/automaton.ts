import { GridCoordinates } from './canvasGrid';
import Grid from './grid';

type Input = {
  rows: number;
  columns: number;
  getCellInitialValue?: (row: number, column: number) => number;
};

const DEAD = 0;
const ALIVE = 1;

const DIRECTIONS: GridCoordinates[] = [
  { row: -1, column: -1 },
  { row: 0, column: -1 },
  { row: 1, column: -1 },
  { row: -1, column: 0 },
  { row: 1, column: 0 },
  { row: -1, column: 1 },
  { row: 0, column: 1 },
  { row: 1, column: 1 },
];

export class Automaton {
  private readonly _grid: Grid<number>;

  constructor({ rows, columns, getCellInitialValue = (_row, _column) => DEAD }: Input) {
    this._grid = new Grid<number>({
      rows,
      columns,
      defaultValue: DEAD,
      getCellInitialValue,
    });
  }

  get rows(): number {
    return this._grid.rows;
  }

  get columns(): number {
    return this._grid.columns;
  }

  getOrThrow = (row: number, column: number) => this._grid.getOrThrow(row, column);

  setOrThrow = (row: number, column: number, value: number): void =>
    this._grid.setOrThrow(row, column, value);

  checkNeighbors = (): number => {
    let numChangedCells = 0;
    const changingCells = new Map<GridCoordinates, boolean>();
    for (let row = 0; row < this.rows; row++) {
      for (let column = 0; column < this.columns; column++) {
        const numAlive = DIRECTIONS.reduce((total, direction) => {
          return total + (this.isCellAlive(row + direction.row, column + direction.column) ? 1 : 0);
        }, 0);

        if (numAlive === 2) {
          changingCells.set({ row, column }, this._grid.getOrThrow(row, column) === ALIVE);
        } else {
          changingCells.set({ row, column }, numAlive === 1 || numAlive === 3);
        }
      }
    }

    for (const [{ row, column }, isAlive] of changingCells) {
      const oldValue = this._grid.getOrThrow(row, column);
      const newValue = isAlive ? ALIVE : DEAD;
      if (oldValue !== newValue) {
        this._grid.setOrThrow(row, column, newValue);
        numChangedCells++;
      }
    }

    return numChangedCells;
  };

  isCellAlive = (row: number, column: number) => {
    return this._grid.get(row, column) === ALIVE;
  };
}
