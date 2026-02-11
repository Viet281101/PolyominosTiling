import { startTetris } from './tetris.js';
import { Polyomino } from './polyomino.js';

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
    this.initialize();
    this.addEventListeners();
    this.animate();
  }

  initialize() {
    this.loadIconPage();
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
  }

  loadIconPage() {
    let icon_page = document.createElement('link');
    icon_page.rel = 'shortcut icon';
    icon_page.href = './assets/icon.png';
    document.head.appendChild(icon_page);
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  updateButtonLayout() {
    const centerX = this.canvas.width / 2;
    const startY = 350;
    const gapY = 100;
    const width = 200;
    const height = 50;

    this.buttons.forEach((button, index) => {
      button.x = centerX;
      button.y = startY + index * gapY;
      button.width = width;
      button.height = height;
      button.iconVisible = true;
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
    // this.ctx.fillText('Mini Polyominoes Games :', this.canvas.width / 2, 650);

    this.buttons.forEach((button) => this.drawButton(button));
    // this.drawButton('2D Tetris', (this.canvas.width / 2), 710, this.switchToTetris.bind(this), false);
    // this.drawButton('2D Pentominos', (this.canvas.width / 2), 780, () => {}, false);
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
    const textWidth = this.ctx.measureText(text).width;
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
    const types = ['domino', 'tromino', 'tetromino', 'pentomino'];
    const minSpeed = 1;
    const maxSpeed = 1.5;

    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const startX = centerX - this.canvas.width / 4;
    const startY = centerY - this.canvas.height / 4;
    const endX = centerX + this.canvas.width / 4;
    const endY = centerY + this.canvas.height / 4;

    for (let i = 0; i < 10; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const size = 30;
      const shape = Polyomino.getRandomGrid(type);

      let x, y;
      let isOverlap;
      let attempts = 0;
      const maxAttempts = 200;
      do {
        isOverlap = false;
        x = startX + Math.random() * (endX - startX - shape[0].length * size);
        y = startY + Math.random() * (endY - startY - shape.length * size);

        for (const polyomino of this.polyominoes) {
          if (this.isOverlap(x, y, shape, polyomino)) {
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

  isOverlap(x, y, shape, polyomino) {
    const size = 30;

    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const px = x + col * size;
          const py = y + row * size;

          for (let prow = 0; prow < polyomino.grid.length; prow++) {
            for (let pcol = 0; pcol < polyomino.grid[prow].length; pcol++) {
              if (polyomino.grid[prow][pcol]) {
                const ppx = polyomino.x + pcol * size;
                const ppy = polyomino.y + prow * size;
                if (px < ppx + size && px + size > ppx && py < ppy + size && py + size > ppy) {
                  return true;
                }
              }
            }
          }
        }
      }
    }
    return false;
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.polyominoes.forEach((polyomino) => polyomino.update());
    this.drawContent();
  }

  switchToTetris() {
    document.body.innerHTML = '';
    const canvas = document.createElement('canvas');
    canvas.id = 'canvas';
    canvas.width = 300;
    canvas.height = 600;
    document.body.appendChild(canvas);

    const control = document.createElement('canvas');
    control.id = 'controls';
    control.width = 300;
    control.height = 100;
    document.body.appendChild(control);

    const script = document.createElement('script');
    script.type = 'module';
    script.src = './js/tetris.js';
    document.body.appendChild(script);

    script.onload = () => {
      startTetris();
    };
  }
}

const main_app = new MainApp();
