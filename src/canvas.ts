export type CartesianCoordinate = { x: number; y: number };

export default class Canvas {
  private _canvas: HTMLCanvasElement;
  private _context: CanvasRenderingContext2D;
  private _size: number;

  constructor(canvasSelector: string, size: number) {
    this._canvas = this._getCanvas(canvasSelector);
    this._context = this._getContext();
    this._size = size;
    this._resizeCanvas();
  }

  get size() {
    return this._size;
  }

  set size(value: number) {
    this._size = value;
    this._resizeCanvas();
  }

  get element(): HTMLCanvasElement {
    return this._canvas;
  }

  get context(): CanvasRenderingContext2D {
    return this._context;
  }

  private _getCanvas(canvasSelector: string) {
    const canvas = document.querySelector<HTMLCanvasElement>(canvasSelector);
    if (!canvas) {
      throw new Error(`Canvas with selector <${canvasSelector}> not found.`);
    }

    return canvas;
  }

  private _getContext() {
    const context = this._canvas.getContext('2d');
    if (!context) {
      throw 'Could not get rendering context';
    }

    return context;
  }

  private _resizeCanvas() {
    this._canvas.width = this._size;
    this._canvas.height = this._size;
    this._canvas.style.width = `${this._size}px`;
    this._canvas.style.height = `${this._size}px`;
  }
}
