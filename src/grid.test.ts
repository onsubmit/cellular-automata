import { describe, expect, it } from 'vitest';

import Grid from './grid';

describe('Grid', () => {
  it('Should create a 1x1 grid', () => {
    const grid = new Grid<number>({ rows: 1, columns: 1, defaultValue: 0 });
    expect(grid.rows).toBe(1);
    expect(grid.columns).toBe(1);

    expect(grid.get(0, 0)).toBe(0);

    expect(grid.get(0, 1)).toBeUndefined();
    expect(grid.get(1, 0)).toBeUndefined();
    expect(grid.get(1, 1)).toBeUndefined();
  });

  it('Should create a 2x2 grid', () => {
    const grid = new Grid<number>({ rows: 2, columns: 2, defaultValue: 0 });
    expect(grid.rows).toBe(2);
    expect(grid.columns).toBe(2);

    expect(grid.get(0, 0)).toBe(0);
    expect(grid.get(0, 1)).toBe(0);
    expect(grid.get(1, 0)).toBe(0);
    expect(grid.get(1, 1)).toBe(0);
  });

  it('Should throw when getting values for invalid coordinates', () => {
    const grid = new Grid<number>({ rows: 1, columns: 1, defaultValue: 0 });

    expect(() => grid.getOrThrow(0, 1)).toThrowError('Invalid column: 1');
    expect(() => grid.getOrThrow(1, 0)).toThrowError('Invalid row: 1');
    expect(() => grid.getOrThrow(-1, 0)).toThrowError('Invalid row: -1');
  });

  it('Should create new columns but not rows when setting values for invalid coordinates', () => {
    const grid = new Grid<number>({ rows: 1, columns: 1, defaultValue: 0 });

    grid.set(1, 1, 1);
    expect(grid.get(1, 1)).toBeUndefined();

    grid.set(0, 1, 1);
    expect(grid.get(0, 1)).toBe(1);
  });

  it('Should throw when setting values for invalid coordinates', () => {
    const grid = new Grid<number>({ rows: 1, columns: 1, defaultValue: 0 });

    expect(() => grid.setOrThrow(0, 1, 1)).toThrowError('Invalid column: 1');
    expect(() => grid.setOrThrow(1, 0, 1)).toThrowError('Invalid row: 1');
    expect(() => grid.setOrThrow(-1, 0, 1)).toThrowError('Invalid row: -1');
  });

  it('Should not resize if new dimensions are the same as the old ones', () => {
    const grid = new Grid<number>({ rows: 1, columns: 1, defaultValue: 0 });

    expect(grid.maybeExpand(1, 0)).toBe(false);
    expect(grid.rows).toBe(1);
    expect(grid.columns).toBe(1);
  });

  it('Should expand the rows', () => {
    const grid = new Grid<number>({ rows: 1, columns: 1, defaultValue: 0 });

    expect(grid.rows).toBe(1);
    expect(grid.columns).toBe(1);
    expect(grid.get(0, 0)).toBe(0);
    expect(grid.get(1, 0)).toBeUndefined();

    grid.setOrThrow(0, 0, 1);
    expect(grid.get(0, 0)).toBe(1);

    expect(grid.maybeExpand(2, 0)).toBe(true);
    expect(grid.rows).toBe(2);
    expect(grid.columns).toBe(1);

    expect(grid.get(0, 0)).toBe(1);
    expect(grid.get(1, 0)).toBe(0);
  });

  it('Should expand the columns', () => {
    const grid = new Grid<number>({ rows: 1, columns: 1, defaultValue: 0 });

    expect(grid.rows).toBe(1);
    expect(grid.columns).toBe(1);
    expect(grid.get(0, 0)).toBe(0);
    expect(grid.get(0, 1)).toBeUndefined();

    grid.setOrThrow(0, 0, 1);
    expect(grid.get(0, 0)).toBe(1);

    expect(grid.maybeExpand(1, 1)).toBe(true);
    expect(grid.rows).toBe(1);
    expect(grid.columns).toBe(3);

    expect(grid.get(0, 0)).toBe(0);
    expect(grid.get(0, 1)).toBe(1);
    expect(grid.get(0, 2)).toBe(0);
  });

  it('Should expand the rows and columns', () => {
    const grid = new Grid<number>({ rows: 1, columns: 1, defaultValue: 0 });

    expect(grid.rows).toBe(1);
    expect(grid.columns).toBe(1);
    expect(grid.get(0, 0)).toBe(0);
    expect(grid.get(0, 1)).toBeUndefined();
    expect(grid.get(1, 0)).toBeUndefined();
    expect(grid.get(1, 1)).toBeUndefined();

    grid.setOrThrow(0, 0, 1);
    expect(grid.get(0, 0)).toBe(1);

    expect(grid.maybeExpand(2, 1)).toBe(true);
    expect(grid.rows).toBe(2);
    expect(grid.columns).toBe(3);

    expect(grid.get(0, 0)).toBe(0);
    expect(grid.get(0, 1)).toBe(1);
    expect(grid.get(0, 2)).toBe(0);
    expect(grid.get(1, 0)).toBe(0);
    expect(grid.get(1, 1)).toBe(0);
    expect(grid.get(1, 2)).toBe(0);
  });
});
