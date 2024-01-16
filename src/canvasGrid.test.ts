import { describe, expect, it, vi } from 'vitest';

import CanvasGrid from './canvasGrid';

describe('CanvasGrid', () => {
  it('Should create a 1x1 grid', () => {
    const drawCallback = vi.fn();

    const grid = new CanvasGrid({
      rows: 1,
      columns: 1,
      drawCallback,
    });

    expect(grid.rows).toBe(1);
    expect(grid.columns).toBe(1);

    expect(grid.getValueOrThrow(0, 0)).toBe(0);

    expect(drawCallback).not.toHaveBeenCalled();
  });

  it('Should increment a value', () => {
    const drawCallback = vi.fn();

    const grid = new CanvasGrid({
      rows: 1,
      columns: 1,
      drawCallback,
    });

    expect(grid.getValueOrThrow(0, 0)).toBe(0);
    expect(grid.incrementOrThrow(0, 0)).toBe(1);
    expect(grid.getValueOrThrow(0, 0)).toBe(1);

    expect(drawCallback).toHaveBeenCalledOnce();
    expect(drawCallback).toHaveBeenNthCalledWith(1, 0, 0, 1);
  });

  it('Should decrement a value', () => {
    const drawCallback = vi.fn();

    const grid = new CanvasGrid({
      rows: 1,
      columns: 1,
      drawCallback,
    });

    expect(grid.getValueOrThrow(0, 0)).toBe(0);
    expect(grid.incrementOrThrow(0, 0)).toBe(1);
    expect(grid.getValueOrThrow(0, 0)).toBe(1);
    expect(grid.decrementOrThrow(0, 0)).toBe(0);
    expect(grid.getValueOrThrow(0, 0)).toBe(0);

    expect(drawCallback).toHaveBeenCalledTimes(2);
    expect(drawCallback).toHaveBeenNthCalledWith(1, 0, 0, 1);
    expect(drawCallback).toHaveBeenNthCalledWith(2, 0, 0, 0);
  });

  it('Should reset a value', () => {
    const drawCallback = vi.fn();

    const grid = new CanvasGrid({
      rows: 1,
      columns: 1,
      drawCallback,
    });

    expect(grid.getValueOrThrow(0, 0)).toBe(0);
    expect(grid.incrementOrThrow(0, 0)).toBe(1);
    expect(grid.getValueOrThrow(0, 0)).toBe(1);

    grid.reset(0, 0);
    expect(grid.getValueOrThrow(0, 0)).toBe(0);

    expect(drawCallback).toHaveBeenCalledTimes(2);
    expect(drawCallback).toHaveBeenNthCalledWith(1, 0, 0, 1);
    expect(drawCallback).toHaveBeenNthCalledWith(2, 0, 0, 0);
  });
});
