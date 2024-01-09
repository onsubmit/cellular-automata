import { describe, expect, it } from 'vitest';

import MapGrid from './mapGrid';

describe('MapGrid', () => {
  it('Should create a 1x1 grid ', () => {
    const grid = new MapGrid<number>({ rows: 1, columns: 1, defaultValue: 0 });
    expect(grid.rows).toBe(1);
    expect(grid.columns).toBe(1);

    expect(grid.get(0, 0)).toBe(0);

    expect(grid.get(0, 1)).toBeUndefined();
    expect(grid.get(1, 0)).toBeUndefined();
    expect(grid.get(1, 1)).toBeUndefined();
  });

  it('Should create a 2x2 grid ', () => {
    const grid = new MapGrid<number>({ rows: 2, columns: 2, defaultValue: 0 });
    expect(grid.rows).toBe(2);
    expect(grid.columns).toBe(2);

    expect(grid.get(0, 0)).toBe(0);
    expect(grid.get(0, 1)).toBe(0);
    expect(grid.get(1, 0)).toBe(0);
    expect(grid.get(1, 1)).toBe(0);
  });

  it('Should throw for getting values for invalid coordinates', () => {
    const grid = new MapGrid<number>({ rows: 1, columns: 1, defaultValue: 0 });

    expect(() => grid.getOrThrow(0, 1)).toThrowError('Invalid column: 1');
    expect(() => grid.getOrThrow(1, 0)).toThrowError('Invalid row: 1');
    expect(() => grid.getOrThrow(-1, 0)).toThrowError('Invalid row: -1');
  });

  it('Should create new columns but not rows when setting values for invalid coordinates', () => {
    const grid = new MapGrid<number>({ rows: 1, columns: 1, defaultValue: 0 });

    grid.set(1, 1, 1);
    expect(grid.get(1, 1)).toBeUndefined();

    grid.set(0, 1, 1);
    expect(grid.get(0, 1)).toBe(1);
  });

  it('Should throw for setting values for invalid coordinates', () => {
    const grid = new MapGrid<number>({ rows: 1, columns: 1, defaultValue: 0 });

    expect(() => grid.setOrThrow(0, 1, 1)).toThrowError('Invalid column: 1');
    expect(() => grid.setOrThrow(1, 0, 1)).toThrowError('Invalid row: 1');
    expect(() => grid.setOrThrow(-1, 0, 1)).toThrowError('Invalid row: -1');
  });

  it('Should not resize if new radius is the same as the old one', () => {
    const grid = new MapGrid<number>({ rows: 1, columns: 1, defaultValue: 0 });
    expect(grid.maybeResize(1, 1)).toBe(false);
    expect(grid.rows).toBe(1);
    expect(grid.columns).toBe(1);
  });

  it('Should expand the the number of rows', () => {});
  it('Should expand the the number of columns ', () => {});
  it('Should expand the the number of rows and columns', () => {});
  it('Should expand the the number of rows and shrink the columns', () => {});

  it('Should shrink the the number of rows', () => {});
  it('Should shrink the the number of columns ', () => {});
  it('Should shrink the the number of rows and columns', () => {});
  it('Should shrink the the number of rows and expand the columns', () => {});
});
