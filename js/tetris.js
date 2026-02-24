import { KEYBOARD_KEYS, TETRIMINOS, TETRIS_CONFIG } from './constants.js';

class Tetris {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.blockSize = TETRIS_CONFIG.BLOCK_SIZE;
    this.rows = this.canvas.height / this.blockSize;
    this.cols = this.canvas.width / this.blockSize;
    this.score = 0;
    this.board = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
    this.tetriminos = TETRIMINOS;

    this.controlItems = [
      { name: 'icons/arrow_left.png', action: () => this.move(-1), holdable: true },
      { name: 'icons/arrow_right.png', action: () => this.move(1), holdable: true },
      { name: 'icons/rotate_left.png', action: () => this.rotateLeft(), holdable: false },
      { name: 'icons/rotate_right.png', action: () => this.rotateRight(), holdable: false },
      { name: 'icons/home.png', action: () => this.goHome(), holdable: false },
    ];
    this.holdDelayMs = 180;
    this.holdRepeatMs = 70;
    this.holdTimeout = null;
    this.holdInterval = null;

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.init();
  }

  init() {
    this.applyStyles();
    this.createControlsBar();
    this.reset();
    this.bindEvents();
    this.draw();
    this.startGame();
  }

  applyStyles() {
    this.canvas.style.border = '1px solid black';
    this.canvas.style.display = 'block';
    this.canvas.style.margin = '16px auto 0';

    const html = document.querySelector('html');
    Object.assign(html.style, {
      overflow: 'hidden',
      height: '100%',
      width: '100%',
      background: '#c3c3c3',
      userSelect: 'none',
    });

    Object.assign(document.body.style, {
      margin: '0',
      overflow: 'hidden',
      height: '100%',
      width: '100%',
      background: '#c3c3c3',
      userSelect: 'none',
    });
  }

  createControlsBar() {
    const existingBar = document.getElementById('tetris-controls-bar');
    if (existingBar) {
      existingBar.remove();
    }

    const bar = document.createElement('div');
    bar.id = 'tetris-controls-bar';
    Object.assign(bar.style, {
      position: 'fixed',
      left: '50%',
      bottom: '16px',
      transform: 'translateX(-50%)',
      zIndex: '1200',
      display: 'flex',
      gap: '8px',
      padding: '8px',
      border: '1px solid #2f4f4f',
      borderRadius: '10px',
      background: 'rgba(230, 242, 242, 0.92)',
      touchAction: 'manipulation',
    });

    this.controlItems.forEach((item) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', item.name);
      Object.assign(button.style, {
        width: 'clamp(34px, 10vw, 56px)',
        height: 'clamp(34px, 10vw, 56px)',
        padding: '0',
        border: '1px solid #2f4f4f',
        borderRadius: '8px',
        background: '#b8dede',
        display: 'grid',
        placeItems: 'center',
        cursor: 'pointer',
      });

      const image = document.createElement('img');
      image.src = `./assets/${item.name}`;
      image.alt = item.name;
      image.style.width = '80%';
      image.style.height = '80%';
      image.style.objectFit = 'contain';
      image.onerror = () => {
        image.remove();
        button.textContent = this.getFallbackLabel(item.name);
        button.style.fontFamily = 'Pixellari, sans-serif';
        button.style.fontSize = '12px';
        button.style.color = '#2f4f4f';
      };

      button.appendChild(image);
      this.bindControlButtonEvents(button, item);
      bar.appendChild(button);
    });

    document.body.appendChild(bar);
  }

  bindControlButtonEvents(button, item) {
    const pressStart = (e) => {
      if (e.cancelable) {
        e.preventDefault();
      }
      this.runControlAction(item);
      if (!item.holdable) {
        return;
      }
      this.clearControlHold();
      this.holdTimeout = setTimeout(() => {
        this.holdInterval = setInterval(() => {
          this.runControlAction(item);
        }, this.holdRepeatMs);
      }, this.holdDelayMs);
    };

    const pressEnd = () => {
      this.clearControlHold();
    };

    button.addEventListener('pointerdown', pressStart);
    button.addEventListener('pointerup', pressEnd);
    button.addEventListener('pointercancel', pressEnd);
    button.addEventListener('pointerleave', pressEnd);
    button.addEventListener('touchstart', pressStart, { passive: false });
    button.addEventListener('touchend', pressEnd);
    button.addEventListener('touchcancel', pressEnd);
    button.addEventListener('click', (e) => e.preventDefault());
  }

  runControlAction(item) {
    item.action();
    if (this.gameInterval) {
      this.draw();
    }
  }

  clearControlHold() {
    if (this.holdTimeout) {
      clearTimeout(this.holdTimeout);
      this.holdTimeout = null;
    }
    if (this.holdInterval) {
      clearInterval(this.holdInterval);
      this.holdInterval = null;
    }
  }

  getFallbackLabel(iconName) {
    switch (iconName) {
      case 'icons/arrow_left.png':
        return 'L';
      case 'icons/arrow_right.png':
        return 'R';
      case 'icons/rotate_left.png':
        return 'RL';
      case 'icons/rotate_right.png':
        return 'RR';
      case 'icons/home.png':
        return 'H';
      default:
        return '?';
    }
  }

  reset() {
    this.x = Math.floor(this.cols / 2) - 2;
    this.y = 0;
    this.currentTetrimino = this.getRandomTetrimino();
    if (this.collides()) {
      alert(`Game Over, you have ${this.score} points!`);
      this.board = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
      this.score = 0;
    }
  }

  collides() {
    if (!this.currentTetrimino || !this.currentTetrimino.shape) {
      return false;
    }

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
    if (!this.currentTetrimino || !this.currentTetrimino.shape) {
      return;
    }

    for (let row = 0; row < this.currentTetrimino.shape.length; row++) {
      for (let col = 0; col < this.currentTetrimino.shape[row].length; col++) {
        if (this.currentTetrimino.shape[row][col]) {
          this.drawBlock(this.x + col, this.y + row, this.currentTetrimino.color);
        }
      }
    }
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

  handleKeyDown(e) {
    if (e.key === KEYBOARD_KEYS.ARROW_LEFT) {
      this.move(-1);
    } else if (e.key === KEYBOARD_KEYS.ARROW_RIGHT) {
      this.move(1);
    } else if (e.key === KEYBOARD_KEYS.ARROW_DOWN) {
      this.drop();
    } else if (e.key === KEYBOARD_KEYS.ARROW_UP) {
      this.rotateRight();
    } else {
      return;
    }
    this.draw();
  }

  bindEvents() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBoard();
    this.drawTetrimino();
    this.ctx.fillText('Score: ' + this.score, 10, 20);
  }

  startGame() {
    if (this.gameInterval) {
      return;
    }
    this.gameInterval = setInterval(() => {
      this.drop();
      this.draw();
    }, TETRIS_CONFIG.DROP_INTERVAL_MS);
    this.draw();
  }

  stopGame() {
    this.clearControlHold();
    clearInterval(this.gameInterval);
    this.gameInterval = null;
    document.removeEventListener('keydown', this.handleKeyDown);
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

  goHome() {
    this.stopGame();

    const controlsBar = document.getElementById('tetris-controls-bar');
    if (controlsBar) {
      controlsBar.remove();
    }

    const homeButton = document.getElementById('tetris-home-button');
    if (homeButton) {
      homeButton.remove();
    }

    window.location.reload();
  }
}

export function startTetris() {
  new Tetris('canvas');
}
