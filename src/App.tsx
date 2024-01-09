import { useEffect, useRef, useState } from 'react';

import styles from './App.module.css';
import { CartesianCoordinate } from './canvas';
import CanvasGrid, { GridCoordinates } from './canvasGrid';
import { Canvas } from './components/canvas';

type CanvasMouseEvent = React.MouseEvent<HTMLCanvasElement, MouseEvent>;

function App() {
  const cellSize = 10;
  let canvasSize = 800;
  const penSize = 1;
  const penWeight = 1;
  const maxValue = 1;

  const lastDrawnCell: Partial<CartesianCoordinate> = {};
  const mouseState = {
    isMouseDown: false,
    isMiddleClick: false,
    isRightClick: false,
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  const grid = new CanvasGrid({
    radius: 20,
    drawCallback: drawAtCoordinate,
    resizeCallback: redraw,
  });

  useEffect(() => {
    if (!context && canvasRef.current) {
      setContext(canvasRef.current.getContext('2d'));
    }
  }, [context]);

  const getContext = () => {
    if (!context) {
      throw new Error('No context');
    }

    return context;
  };

  function drawAtCoordinate(row: number, column: number, value: number) {
    getContext().fillStyle = value === 1 ? '#ffffff' : '#242424';

    const { x, y } = mapGridCoordinatesToCanvasCoordinates({ row, column });
    getContext().fillRect(x, y, cellSize, cellSize);
  }

  function redraw(newRadius: number) {
    canvasSize = cellSize * (1 + 2 * newRadius);
    getContext().clearRect(0, 0, canvasSize, canvasSize);

    for (let r = -newRadius; r <= newRadius; r++) {
      for (let c = -newRadius; c <= newRadius; c++) {
        drawAtCoordinate(r, c, grid.getValueOrThrow(r, c));
      }
    }
  }

  function getRangesForPenSize(gridCoordinates: GridCoordinates): {
    min: GridCoordinates;
    max: GridCoordinates;
  } {
    const { row, column } = gridCoordinates;
    const penAdjustFloor = Math.floor((penSize - 1) / 2);
    const penAdjustCeil = Math.ceil((penSize - 1) / 2);
    const minRow = Math.max(-grid.radius, row - penAdjustFloor);
    const minColumn = Math.max(-grid.radius, column - penAdjustFloor);
    const maxRow = Math.min(row + penAdjustCeil, grid.radius);
    const maxColumn = Math.min(column + penAdjustCeil, grid.radius);

    return {
      min: { row: minRow, column: minColumn },
      max: { row: maxRow, column: maxColumn },
    };
  }

  function drawAtMouse(input: {
    canvasCoordinates: CartesianCoordinate;
    increment: boolean;
    force: boolean;
  }) {
    const { canvasCoordinates, increment, force } = input;
    const { x, y } = constrainCanvasCoordinates(canvasCoordinates);

    if (!force && x === lastDrawnCell.x && y === lastDrawnCell.y) {
      return;
    }

    lastDrawnCell.x = x;
    lastDrawnCell.y = y;

    const { row, column } = mapCanvasCoordinatesToGridCoordinates({ x, y });
    const { min, max } = getRangesForPenSize({ row, column });

    for (let r = min.row; r <= max.row; r++) {
      for (let c = min.column; c <= max.column; c++) {
        if (increment) {
          const value = grid.getValueOrThrow(r, c);
          const amount = value + penWeight > maxValue ? maxValue - value : penWeight;

          if (amount === 0) {
            continue;
          }

          grid.incrementOrThrow(r, c, amount);
        } else {
          grid.decrementOrThrow(r, c, penWeight);
        }
      }
    }
  }

  function clearAtMouse(canvasCoordinates: CartesianCoordinate) {
    const { x, y } = constrainCanvasCoordinates(canvasCoordinates);
    const { row, column } = mapCanvasCoordinatesToGridCoordinates({ x, y });
    const { min, max } = getRangesForPenSize({ row, column });

    for (let r = min.row; r <= max.row; r++) {
      for (let c = min.column; c <= max.column; c++) {
        grid.reset(r, c);
      }
    }
  }

  function mapCanvasCoordinatesToGridCoordinates(
    canvasCoordinates: CartesianCoordinate
  ): GridCoordinates {
    const row = -grid.radius + canvasCoordinates.y / cellSize;
    const column = -grid.radius + canvasCoordinates.x / cellSize;

    return { row, column };
  }

  function mapGridCoordinatesToCanvasCoordinates(
    gridCoordinates: GridCoordinates
  ): CartesianCoordinate {
    const x = (grid.radius + gridCoordinates.column) * cellSize;
    const y = (grid.radius + gridCoordinates.row) * cellSize;

    return { x, y };
  }

  function constrainCanvasCoordinates(canvasCoordinates: CartesianCoordinate): CartesianCoordinate {
    const canvas = canvasRef.current;
    if (!canvas) {
      throw new Error('Canvas not rendered');
    }

    let { x, y } = canvasCoordinates;

    x = Math.max(x, 0);
    y = Math.max(y, 0);

    x = Math.min(x, canvasSize - 1);
    y = Math.min(y, canvasSize - 1);

    x = Math.floor(x / cellSize) * cellSize;
    y = Math.floor(y / cellSize) * cellSize;

    return { x, y };
  }

  function getGridSizeInNumCells(): number {
    return 1 + 2 * grid.radius;
  }

  const size = cellSize * getGridSizeInNumCells();

  return (
    <div className={styles.app}>
      <h1>Hello World</h1>
      <Canvas
        ref={canvasRef}
        width={size}
        height={size}
        style={{ border: '1px solid white', width: `${size}px`, height: `${size}px` }}
        onMouseDown={(e: CanvasMouseEvent) => {
          mouseState.isMouseDown = true;
          mouseState.isMiddleClick = e.button === 1;
          mouseState.isRightClick = e.button === 2;

          const { offsetX: x, offsetY: y } = e.nativeEvent;
          if (mouseState.isRightClick) {
            clearAtMouse({ x, y });
          } else {
            drawAtMouse({
              canvasCoordinates: { x, y },
              increment: true,
              force: true,
            });
          }
        }}
        onMouseUp={() => {
          mouseState.isMouseDown = false;
        }}
        onMouseMove={(e: CanvasMouseEvent) => {
          if (mouseState.isMouseDown) {
            const { offsetX: x, offsetY: y } = e.nativeEvent;

            if (mouseState.isRightClick) {
              clearAtMouse({ x, y });
            } else {
              drawAtMouse({
                canvasCoordinates: { x, y },
                increment: !mouseState.isMiddleClick,
                force: false,
              });
            }
          }
        }}
        onContextMenu={(e: CanvasMouseEvent) => {
          e.preventDefault();
        }}
      ></Canvas>
    </div>
  );
}

export default App;
