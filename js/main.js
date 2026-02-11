import { startTetris } from './tetris.js';
import { Polyomino } from './polyomino.js';
import { POLYOMINO_CONFIG, POLYOMINO_TYPES, TETRIS_CONFIG } from './constants.js';

class MainApp {
  constructor() {
    this.canvas = document.getElementById('myCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.buttons = [
      {
        text: '2D Version',
        onClick: () => {
          window.location.href = './2D/index.html';
        },
      },
      {
        text: '3D Version',
        onClick: () => {
          window.location.href = './3D/index.html';
        },
      },
      {
        text: '2D Tetris',
        isMiniGame: true,
        onClick: () => {
          this.switchToTetris();
        },
      },
    ];
    this.polyominoes = [];
    this.colors = [
      '#FF5733',
      '#33FF57',
      '#3357FF',
      '#F1C40F',
      '#9B59B6',
      '#3498DB',
      '#E74C3C',
      '#2ECC71',
    ];
    this.usedColors = [];
    this.iconImage = new Image();
    this.iconImage.src = './assets/ic_arrow_right.png';
    this.targetFps = 60;
    this.frameDurationMs = 1000 / this.targetFps;
    this.maxDeltaMs = 100;
    this.lastFrameTimeMs = 0;
    this.isRunning = true;
    this.animate = this.animate.bind(this);
    this.initialize();
    this.addEventListeners();
    requestAnimationFrame(this.animate);
  }

  initialize() {
    this.resizeCanvas();
    this.updateButtonLayout();
    this.drawContent();
    this.hideScrollbars();
    this.createPolyominoes();
  }

  hideScrollbars() {
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

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  updateButtonLayout() {
    const centerX = this.canvas.width / 2;
    const startY = 350;
    const gapY = 100;
    this.miniGamesLabelY = Math.min(this.canvas.height - 220, 650);
    const width = 200;
    const height = 50;
    let primaryIndex = 0;

    this.buttons.forEach((button) => {
      button.x = centerX;
      button.y = button.isMiniGame ? this.miniGamesLabelY + 70 : startY + primaryIndex++ * gapY;
      button.width = width;
      button.height = height;
      button.iconVisible = true;
      this.ctx.font = '20px Pixellari';
      button.textWidth = this.ctx.measureText(button.text).width;
    });
  }

  drawContent() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.polyominoes.forEach((polyomino) => polyomino.draw());

    this.ctx.font = '32px Pixellari';
    this.ctx.fillStyle = 'rgba(0, 100, 255, 1)';
    this.ctx.textBaseline = 'middle';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Polyominoes Tiling', this.canvas.width / 2, 50);
    this.ctx.fillText('(Pavages de Polyominos)', this.canvas.width / 2, 100);

    this.ctx.font = '24px Pixellari';
    this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    this.ctx.textBaseline = 'middle';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Research polyominoes &', this.canvas.width / 2, 200);
    this.ctx.fillText('Propose solving solutions.', this.canvas.width / 2, 230);
    this.ctx.fillText('Mini Polyominoes Games :', this.canvas.width / 2, this.miniGamesLabelY);

    this.buttons.forEach((button) => this.drawButton(button));
  }

  drawButton(button) {
    const { text, x, y, width, height, iconVisible } = button;

    this.ctx.fillStyle = '#4CAF50';
    this.ctx.fillRect(x - width / 2, y - height / 2, width, height);

    this.ctx.fillStyle = '#fff';
    this.ctx.font = '20px Pixellari';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(text, x, y);

    const iconSize = 32;
    const textWidth = button.textWidth ?? this.ctx.measureText(text).width;
    const iconX = x + textWidth / 2 + 10;
    const iconY = y - iconSize / 2;

    if (iconVisible) {
      this.ctx.drawImage(this.iconImage, iconX, iconY, iconSize, iconSize);
    }
  }

  addEventListeners() {
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      this.buttons.forEach((button) => {
        if (
          mouseX > button.x - button.width / 2 &&
          mouseX < button.x + button.width / 2 &&
          mouseY > button.y - button.height / 2 &&
          mouseY < button.y + button.height / 2
        ) {
          button.onClick();
        }
      });
    });
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      let cursor = 'default';
      this.buttons.forEach((button) => {
        if (
          mouseX > button.x - button.width / 2 &&
          mouseX < button.x + button.width / 2 &&
          mouseY > button.y - button.height / 2 &&
          mouseY < button.y + button.height / 2
        ) {
          cursor = 'pointer';
        }
      });
      this.canvas.style.cursor = cursor;
    });
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.updateButtonLayout();
    });
  }

  createPolyominoes() {
    const types = POLYOMINO_TYPES;
    const minSpeed = POLYOMINO_CONFIG.MIN_SPEED;
    const maxSpeed = POLYOMINO_CONFIG.MAX_SPEED;

    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const startX = centerX - this.canvas.width / 4;
    const startY = centerY - this.canvas.height / 4;
    const endX = centerX + this.canvas.width / 4;
    const endY = centerY + this.canvas.height / 4;

    for (let i = 0; i < 10; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const size = POLYOMINO_CONFIG.CELL_SIZE;
      const shape = Polyomino.getRandomGrid(type);
      const shapeCells = Polyomino.getOccupiedCells(shape);

      let x, y;
      let isOverlap;
      let attempts = 0;
      const maxAttempts = 200;
      do {
        isOverlap = false;
        x = startX + Math.random() * (endX - startX - shape[0].length * size);
        y = startY + Math.random() * (endY - startY - shape.length * size);

        for (const polyomino of this.polyominoes) {
          if (this.isOverlap(x, y, shapeCells, polyomino)) {
            isOverlap = true;
            break;
          }
        }
        attempts++;
      } while (isOverlap && attempts < maxAttempts);

      if (isOverlap) {
        continue;
      }

      const dx =
        (Math.random() * (maxSpeed - minSpeed) + minSpeed) * (Math.random() < 0.5 ? -1 : 1);
      const dy =
        (Math.random() * (maxSpeed - minSpeed) + minSpeed) * (Math.random() < 0.5 ? -1 : 1);
      const color = this.getRandomColor();
      this.polyominoes.push(new Polyomino(this.ctx, type, x, y, dx, dy, color));
    }
  }

  getRandomColor() {
    if (this.colors.length === 0) {
      this.colors = this.usedColors;
      this.usedColors = [];
    }
    const color = this.colors.splice(Math.floor(Math.random() * this.colors.length), 1)[0];
    this.usedColors.push(color);
    return color;
  }

  isOverlap(x, y, shapeCells, polyomino) {
    const size = POLYOMINO_CONFIG.CELL_SIZE;

    for (const [row, col] of shapeCells) {
      const px = x + col * size;
      const py = y + row * size;

      for (const [polyRow, polyCol] of polyomino.occupiedCells) {
        const ppx = polyomino.x + polyCol * size;
        const ppy = polyomino.y + polyRow * size;
        if (px < ppx + size && px + size > ppx && py < ppy + size && py + size > ppy) {
          return true;
        }
      }
    }
    return false;
  }

  animate(timestampMs) {
    if (!this.isRunning) {
      return;
    }
    requestAnimationFrame(this.animate);

    if (!this.lastFrameTimeMs) {
      this.lastFrameTimeMs = timestampMs;
      this.drawContent();
      return;
    }

    const elapsedMs = timestampMs - this.lastFrameTimeMs;
    if (elapsedMs < this.frameDurationMs) {
      return;
    }

    this.lastFrameTimeMs = timestampMs - (elapsedMs % this.frameDurationMs);
    const deltaMs = Math.min(elapsedMs, this.maxDeltaMs);
    const deltaScale = deltaMs / (1000 / 60);

    this.polyominoes.forEach((polyomino) => polyomino.update(deltaScale));
    this.drawContent();
  }

  switchToTetris() {
    this.isRunning = false;
    document.body.innerHTML = '';
    const canvas = document.createElement('canvas');
    canvas.id = 'canvas';
    canvas.width = TETRIS_CONFIG.CANVAS_WIDTH;
    canvas.height = TETRIS_CONFIG.CANVAS_HEIGHT;
    document.body.appendChild(canvas);
    startTetris();
  }
}

const main_app = new MainApp();
