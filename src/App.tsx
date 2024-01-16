import { useEffect, useRef, useState } from 'react';

import styles from './App.module.css';
import CanvasGrid, { CartesianCoordinate, GridCoordinates } from './canvasGrid';
import { Canvas } from './components/canvas';

type CanvasMouseEvent = React.MouseEvent<HTMLCanvasElement, MouseEvent>;

function App() {
  const cellSize = 12;
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
  const [iterations, setIterations] = useState(0);

  const grid = new CanvasGrid({
    rows: 64,
    columns: 64,
    getCellInitialValue: (_, __) => (Math.random() < 0.5 ? 1 : 0),
    drawCallback: drawAtCoordinate,
  });

  useEffect(() => {
    if (context) {
      redraw();
    } else if (canvasRef.current) {
      setContext(canvasRef.current.getContext('2d'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context]);

  const getContext = () => {
    if (!context) {
      throw new Error('No context');
    }

    return context;
  };

  function drawAtCoordinate(row: number, column: number, value: number) {
    getContext().fillStyle = value === 1 ? '#ffffff' : '#242424';
    getContext().strokeStyle = '#000000';

    const { x, y } = mapGridCoordinatesToCanvasCoordinates({ row, column });
    getContext().fillRect(x, y, cellSize, cellSize);

    if (value === 1 && cellSize > 3) {
      getContext().strokeRect(x, y, cellSize, cellSize);
    }
  }

  function redraw() {
    const canvas = canvasRef.current!;
    canvas.width = cellSize * grid.columns;
    canvas.height = cellSize * grid.rows;
    getContext().clearRect(0, 0, canvas.width, canvas.height);

    for (let r = 0; r < grid.rows; r++) {
      for (let c = 0; c < grid.columns; c++) {
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
    const minRow = Math.max(0, row - penAdjustFloor);
    const minColumn = Math.max(0, column - penAdjustFloor);
    const maxRow = Math.min(row + penAdjustCeil, grid.rows);
    const maxColumn = Math.min(column + penAdjustCeil, grid.columns);

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
    const row = canvasCoordinates.y / cellSize;
    const column = canvasCoordinates.x / cellSize;

    return { row, column };
  }

  function mapGridCoordinatesToCanvasCoordinates(
    gridCoordinates: GridCoordinates
  ): CartesianCoordinate {
    const x = gridCoordinates.column * cellSize;
    const y = gridCoordinates.row * cellSize;

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

    x = Math.min(x, cellSize * grid.columns - 1);
    y = Math.min(y, cellSize * grid.rows - 1);

    x = Math.floor(x / cellSize) * cellSize;
    y = Math.floor(y / cellSize) * cellSize;

    return { x, y };
  }

  let previousChangedCells = -1;
  let loopCount = 0;

  return (
    <div className={styles.app}>
      <button
        style={{ visibility: iterations ? 'hidden' : 'visible' }}
        onClick={() => {
          function loop() {
            const changedCells = grid.evolve();
            redraw();
            setIterations((s) => s + 1);

            if (changedCells > 0) {
              if (previousChangedCells === changedCells) {
                loopCount++;
              } else {
                loopCount = 0;
              }

              previousChangedCells = changedCells;

              if (loopCount < 10) {
                requestLoop();
              } else {
                console.log('loop found');
              }
            } else {
              console.log('done');
            }
          }

          function requestLoop() {
            window.requestAnimationFrame(loop);
          }

          requestLoop();
        }}
      >
        Evolve
      </button>
      <Canvas
        ref={canvasRef}
        className={styles.grid}
        width={cellSize * grid.columns}
        height={cellSize * grid.rows}
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
      <div>Iterations: {iterations}</div>
    </div>
  );
}

export default App;
