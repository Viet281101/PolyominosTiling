class Tetris {
  constructor(canvasId, controlsId) {
    this.canvas = document.getElementById(canvasId);
    this.controlsCanvas = document.getElementById(controlsId);
    this.ctx = this.canvas.getContext('2d');
    this.controlsCtx = this.controlsCanvas.getContext('2d');
    this.blockSize = 30;
    this.rows = this.canvas.height / this.blockSize;
    this.cols = this.canvas.width / this.blockSize;
    this.score = 0;
    this.board = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
    this.tetriminos = [
      { shape: [[1, 1, 1, 1]], color: 'cyan' },
      {
        shape: [
          [1, 0, 0],
          [1, 1, 1],
        ],
        color: 'blue',
      },
      {
        shape: [
          [0, 0, 1],
          [1, 1, 1],
        ],
        color: 'orange',
      },
      {
        shape: [
          [1, 1],
          [1, 1],
        ],
        color: 'gold',
      },
      {
        shape: [
          [0, 1, 1],
          [1, 1, 0],
        ],
        color: 'green',
      },
      {
        shape: [
          [1, 1, 1],
          [0, 1, 0],
        ],
        color: 'purple',
      },
      {
        shape: [
          [1, 1, 0],
          [0, 1, 1],
        ],
        color: 'red',
      },
    ];
    this.iconSize = 48;
    this.iconPadding = 10;
    this.controlItems = [
      { name: 'ic_arrow_left.png', action: () => this.move(-1) },
      { name: 'ic_arrow_right.png', action: () => this.move(1) },
      { name: 'ic_rotate_left.png', action: () => this.rotateLeft() },
      { name: 'ic_rotate_right.png', action: () => this.rotateRight() },
      { name: 'ic_home.png', action: () => this.goHome() },
    ];
    this.icons = {};
    this.iconsLoaded = 0;
    this.loadIcons();
  }

  loadIcons() {
    const iconNames = this.controlItems.map((item) => item.name);
    iconNames.forEach((iconName) => {
      const img = new Image();
      img.src = `./assets/${iconName}`;
      img.onload = () => {
        this.iconsLoaded++;
        if (this.iconsLoaded === iconNames.length) {
          this.init();
        }
      };
      this.icons[iconName] = img;
    });
  }

  init() {
    this.applyStyles();
    this.reset();
    this.bindEvents();
    this.draw();
    this.drawControls();
  }

  applyStyles() {
    this.canvas.style.border = '1px solid black';
    this.canvas.style.display = 'block';
    this.canvas.style.margin = 'auto';
    this.controlsCanvas.style.display = 'block';
    this.controlsCanvas.style.margin = 'auto';
    const html = document.querySelector('html');
    Object.assign(html.style, {
      overflow: 'hidden',
      height: '100%',
      width: '100%',
      background: '#c3c3c3',
      userSelect: 'none',
    });
  }

  reset() {
    this.x = Math.floor(this.cols / 2) - 2;
    this.y = 0;
    this.currentTetrimino = this.getRandomTetrimino();
    if (this.collides()) {
      // game over
      alert(`Game Over, you have ${this.score} points!`);
      this.board = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
      this.score = 0;
    }
  }

  collides() {
    for (let row = 0; row < this.currentTetrimino.shape.length; row++) {
      for (let col = 0; col < this.currentTetrimino.shape[row].length; col++) {
        if (
          this.currentTetrimino.shape[row][col] &&
          (this.board[row + this.y] && this.board[row + this.y][col + this.x]) !== 0
        ) {
          return true;
        }
      }
    }
    return false;
  }

  rotate(matrix) {
    const height = matrix.length;
    const width = Math.max(...matrix.map((row) => row.length));
    const rotated = Array.from({ length: width }, () => Array(height).fill(0));

    for (let row = 0; row < height; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        rotated[col][height - 1 - row] = matrix[row][col];
      }
    }
    return rotated;
  }

  move(dir) {
    this.x += dir;
    if (this.collides()) {
      this.x -= dir;
    }
  }

  drop() {
    this.y++;
    if (this.collides()) {
      this.y--;
      this.merge();
      this.clearRows();
      this.reset();
    }
  }

  merge() {
    for (let row = 0; row < this.currentTetrimino.shape.length; row++) {
      for (let col = 0; col < this.currentTetrimino.shape[row].length; col++) {
        if (this.currentTetrimino.shape[row][col]) {
          this.board[row + this.y][col + this.x] = this.currentTetrimino.color;
        }
      }
    }
  }

  drawBlock(x, y, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x * this.blockSize, y * this.blockSize, this.blockSize, this.blockSize);
    this.ctx.strokeRect(x * this.blockSize, y * this.blockSize, this.blockSize, this.blockSize);
  }

  drawBoard() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (this.board[row][col]) {
          this.drawBlock(col, row, this.board[row][col]);
        }
      }
    }
  }

  drawTetrimino() {
    for (let row = 0; row < this.currentTetrimino.shape.length; row++) {
      for (let col = 0; col < this.currentTetrimino.shape[row].length; col++) {
        if (this.currentTetrimino.shape[row][col]) {
          this.drawBlock(this.x + col, this.y + row, this.currentTetrimino.color);
        }
      }
    }
  }

  drawControls() {
    const y = (this.controlsCanvas.height - this.iconSize) / 2;

    this.controlItems.forEach((icon, index) => {
      const x = this.iconPadding + index * (this.iconSize + this.iconPadding);
      this.controlsCtx.drawImage(this.icons[icon.name], x, y, this.iconSize, this.iconSize);
    });
  }

  handleIconClick(mouseX, mouseY) {
    const y = (this.controlsCanvas.height - this.iconSize) / 2;

    this.controlItems.forEach((icon, index) => {
      const x = this.iconPadding + index * (this.iconSize + this.iconPadding);
      if (
        mouseX >= x &&
        mouseX <= x + this.iconSize &&
        mouseY >= y &&
        mouseY <= y + this.iconSize
      ) {
        icon.action();
      }
    });
  }

  rotateLeft() {
    this.rotateCurrent(false);
  }

  rotateRight() {
    this.rotateCurrent(true);
  }

  rotateCurrent(clockwise) {
    const originalShape = this.currentTetrimino.shape;
    const turns = clockwise ? 1 : 3;
    let rotatedShape = originalShape;
    for (let i = 0; i < turns; i++) {
      rotatedShape = this.rotate(rotatedShape);
    }
    this.currentTetrimino.shape = rotatedShape;
    if (this.collides()) {
      this.currentTetrimino.shape = originalShape;
    }
  }

  goHome() {
    window.location.reload();
  }

  bindEvents() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.move(-1);
      } else if (e.key === 'ArrowRight') {
        this.move(1);
      } else if (e.key === 'ArrowDown') {
        this.drop();
      } else if (e.key === 'ArrowUp') {
        this.rotateRight();
      }
      this.draw();
    });

    this.controlsCanvas.addEventListener('click', (e) => {
      const rect = this.controlsCanvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      this.handleIconClick(mouseX, mouseY);
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBoard();
    this.drawTetrimino();
    this.ctx.fillText('Score: ' + this.score, 10, 20);
  }

  startGame() {
    this.gameInterval = setInterval(() => {
      this.drop();
      this.draw();
    }, 1000);
    this.draw();
  }

  stopGame() {
    clearInterval(this.gameInterval);
  }

  clearRows() {
    let clearedRows = 0;
    for (let row = this.rows - 1; row >= 0; row--) {
      if (this.board[row].every((cell) => cell !== 0)) {
        this.board.splice(row, 1);
        this.board.unshift(Array(this.cols).fill(0));
        clearedRows++;
        row++;
      }
    }
    this.score += clearedRows * 100;
  }

  getRandomTetrimino() {
    const random = this.tetriminos[Math.floor(Math.random() * this.tetriminos.length)];
    return {
      color: random.color,
      shape: random.shape.map((row) => [...row]),
    };
  }
}

export function startTetris() {
  const tetris = new Tetris('canvas', 'controls');
  tetris.startGame();
}
