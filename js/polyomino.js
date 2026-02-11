const SHAPES = {
  domino: [[[1, 1]], [[1], [1]]],
  tromino: [
    [[1, 1, 1]], // I
    [[1], [1], [1]], // I
    [
      [1, 1],
      [1, 0],
    ], // L
    [
      [1, 1],
      [0, 1],
    ], // J
  ],
  tetromino: [
    [[1, 1, 1, 1]], // I
    [
      [1, 1],
      [1, 1],
    ], // O
    [
      [1, 1, 1],
      [0, 1, 0],
    ], // T
    [
      [1, 1, 0],
      [0, 1, 1],
    ], // S
    [
      [0, 1, 1],
      [1, 1, 0],
    ], // Z
    [
      [1, 1, 1],
      [1, 0, 0],
    ], // L
    [
      [1, 1, 1],
      [0, 0, 1],
    ], // J
  ],
  pentomino: [
    [[1, 1, 1, 1, 1]], // I
    [
      [1, 1, 1],
      [1, 0, 0],
      [1, 0, 0],
    ], // L
    [
      [1, 1, 1],
      [0, 1, 0],
      [0, 1, 0],
    ], // T
    [
      [1, 1, 1],
      [1, 1, 0],
    ], // P
    [
      [1, 1, 1],
      [0, 1, 1],
    ], // F
    [
      [1, 1, 1, 1],
      [0, 0, 1, 0],
    ], // T
    [
      [1, 1, 0],
      [0, 1, 1],
      [0, 1, 0],
    ], // Y
    [
      [0, 1, 1],
      [1, 1, 0],
      [1, 0, 0],
    ], // S
    [
      [1, 1],
      [1, 1],
      [1, 0],
    ], // U
    [
      [1, 0, 1],
      [1, 1, 1],
    ], // X
    [
      [1, 1, 1],
      [0, 1, 0],
      [0, 1, 0],
    ], // T
    [
      [1, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ], // W
  ],
};

export class Polyomino {
  constructor(ctx, type, x, y, dx, dy, color) {
    this.ctx = ctx;
    this.type = type;
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.size = 30;
    this.color = color;
    this.grid = Polyomino.getRandomGrid(type);
  }

  static getRandomGrid(type) {
    const shapeVariations = SHAPES[type] || SHAPES.tetromino;
    const shape = shapeVariations[Math.floor(Math.random() * shapeVariations.length)];
    return shape.map((row) => [...row]);
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

  update() {
    this.x += this.dx;
    this.y += this.dy;

    if (this.x <= 0 || this.x + this.grid[0].length * this.size >= this.ctx.canvas.width) {
      this.dx = -this.dx;
    }
    if (this.y <= 0 || this.y + this.grid.length * this.size >= this.ctx.canvas.height) {
      this.dy = -this.dy;
    }
  }
}
