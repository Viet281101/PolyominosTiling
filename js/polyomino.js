import { POLYOMINO_CONFIG, POLYOMINO_SHAPES } from './constants.js';

export class Polyomino {
  constructor(ctx, type, x, y, dx, dy, color) {
    this.ctx = ctx;
    this.type = type;
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.size = POLYOMINO_CONFIG.CELL_SIZE;
    this.color = color;
    this.grid = Polyomino.getRandomGrid(type);
    this.occupiedCells = Polyomino.getOccupiedCells(this.grid);
    this.widthInCells = Math.max(...this.grid.map((row) => row.length));
    this.heightInCells = this.grid.length;
    this.minSpeed = POLYOMINO_CONFIG.MIN_SPEED;
    this.maxSpeed = POLYOMINO_CONFIG.MAX_SPEED;
    this.outOfBoundsFrames = 0;
    this.maxOutOfBoundsFrames = POLYOMINO_CONFIG.MAX_OUT_OF_BOUNDS_FRAMES;
    this.outOfBoundsMargin = this.size * POLYOMINO_CONFIG.OUT_OF_BOUNDS_MARGIN_MULTIPLIER;
  }

  static getRandomGrid(type) {
    const shapeVariations = POLYOMINO_SHAPES[type] || POLYOMINO_SHAPES.tetromino;
    const shape = shapeVariations[Math.floor(Math.random() * shapeVariations.length)];
    return shape.map((row) => [...row]);
  }

  static getOccupiedCells(grid) {
    const occupiedCells = [];
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (grid[row][col]) {
          occupiedCells.push([row, col]);
        }
      }
    }
    return occupiedCells;
  }

  static getRandomSpeed(minSpeed, maxSpeed) {
    return Math.random() * (maxSpeed - minSpeed) + minSpeed;
  }

  setSafeVelocity() {
    const speedX = Polyomino.getRandomSpeed(this.minSpeed, this.maxSpeed);
    const speedY = Polyomino.getRandomSpeed(this.minSpeed, this.maxSpeed);
    this.dx = speedX * (Math.random() < 0.5 ? -1 : 1);
    this.dy = speedY * (Math.random() < 0.5 ? -1 : 1);
  }

  hasInvalidState(deltaScale) {
    return !(
      Number.isFinite(this.x) &&
      Number.isFinite(this.y) &&
      Number.isFinite(this.dx) &&
      Number.isFinite(this.dy) &&
      Number.isFinite(deltaScale)
    );
  }

  respawnSafely(maxX, maxY) {
    this.x = Math.random() * maxX;
    this.y = Math.random() * maxY;
    this.setSafeVelocity();
    this.outOfBoundsFrames = 0;
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 2;

    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[row].length; col++) {
        if (this.grid[row][col]) {
          this.ctx.fillRect(
            this.x + col * this.size,
            this.y + row * this.size,
            this.size,
            this.size
          );
          this.ctx.strokeRect(
            this.x + col * this.size,
            this.y + row * this.size,
            this.size,
            this.size
          );
        }
      }
    }
  }

  update(deltaScale = 1) {
    const maxX = Math.max(0, this.ctx.canvas.width - this.widthInCells * this.size);
    const maxY = Math.max(0, this.ctx.canvas.height - this.heightInCells * this.size);
    const safeDeltaScale = Number.isFinite(deltaScale) ? deltaScale : 1;

    if (this.hasInvalidState(safeDeltaScale)) {
      this.respawnSafely(maxX, maxY);
      return;
    }

    this.x += this.dx * safeDeltaScale;
    this.y += this.dy * safeDeltaScale;

    const isOutOfBoundsLong =
      this.x < -this.outOfBoundsMargin ||
      this.x > maxX + this.outOfBoundsMargin ||
      this.y < -this.outOfBoundsMargin ||
      this.y > maxY + this.outOfBoundsMargin;
    this.outOfBoundsFrames = isOutOfBoundsLong ? this.outOfBoundsFrames + 1 : 0;
    if (this.outOfBoundsFrames > this.maxOutOfBoundsFrames) {
      this.respawnSafely(maxX, maxY);
      return;
    }

    if (this.x < 0) {
      this.x = 0;
      this.dx = Math.abs(this.dx);
    } else if (this.x > maxX) {
      this.x = maxX;
      this.dx = -Math.abs(this.dx);
    }

    if (this.y < 0) {
      this.y = 0;
      this.dy = Math.abs(this.dy);
    } else if (this.y > maxY) {
      this.y = maxY;
      this.dy = -Math.abs(this.dy);
    }
  }
}
