class Polyomino {
	constructor(ctx, type, x, y, dx, dy, color) {
		this.ctx = ctx;
		this.type = type;
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;
		this.size = 30;
		this.color = color;
		this.grid = this.createGrid(type);
	};

	createGrid(type) {
		const shapes = {
			domino: [[1, 1]],
			tromino: [
				[[1, 1, 1]], // I
				[[1], [1], [1]], // I
				[[1, 1], [1, 0]], // L
				[[1, 1], [0, 1]]  // J
			],
			tetromino: [
				[[1, 1, 1, 1]], // I
				[[1, 1], [1, 1]], // O
				[[1, 1, 1], [0, 1, 0]], // T
				[[1, 1, 0], [0, 1, 1]], // S
				[[0, 1, 1], [1, 1, 0]], // Z
				[[1, 1, 1], [1, 0, 0]], // L
				[[1, 1, 1], [0, 0, 1]]  // J
			],
			pentomino: [
				[[1, 1, 1, 1, 1]], // I
				[[1, 1, 1], [1, 0, 0], [1, 0, 0]], // L
				[[1, 1, 1], [0, 1, 0], [0, 1, 0]], // T
				[[1, 1, 1], [1, 1, 0]], // P
				[[1, 1, 1], [0, 1, 1]], // F
				[[1, 1, 1, 1], [0, 0, 1, 0]], // T
				[[1, 1, 0], [0, 1, 1], [0, 1, 0]], // Y
				[[0, 1, 1], [1, 1, 0], [1, 0, 0]], // S
				[[1, 1], [1, 1], [1, 0]], // U
				[[1, 0, 1], [1, 1, 1]], // X
				[[1, 1, 1], [0, 1, 0], [0, 1, 0]], // T
				[[1, 0, 0], [1, 1, 1], [0, 1, 0]]  // W
			]
		};
		const shapeVariations = shapes[type];
		const shape = shapeVariations[Math.floor(Math.random() * shapeVariations.length)];
		return shape;
	};

	draw() {
		this.ctx.fillStyle = this.color;
		this.ctx.strokeStyle = 'black';
		this.ctx.lineWidth = 2;

		for (let row = 0; row < this.grid.length; row++) {
			for (let col = 0; col < this.grid[row].length; col++) {
				if (this.grid[row][col]) {
					this.ctx.fillRect(this.x + col * this.size, this.y + row * this.size, this.size, this.size);
					this.ctx.strokeRect(this.x + col * this.size, this.y + row * this.size, this.size, this.size);
				}
			}
		}
	};

	update() {
		this.x += this.dx;
		this.y += this.dy;

		if (this.x <= 0 || this.x + this.grid[0].length * this.size >= this.ctx.canvas.width) {
			this.dx = -this.dx;
		}
		if (this.y <= 0 || this.y + this.grid.length * this.size >= this.ctx.canvas.height) {
			this.dy = -this.dy;
		}
	};
};

class MainApp {
	constructor() {
		this.canvas = document.getElementById('myCanvas');
		this.ctx = this.canvas.getContext('2d');
		this.buttons = [];
		this.polyominoes = [];
		this.colors = ['#FF5733', '#33FF57', '#3357FF', '#F1C40F', '#9B59B6', '#3498DB', '#E74C3C', '#2ECC71'];
		this.usedColors = [];

		this.initialize();
		this.addEventListeners();
		this.animate();
	};

	initialize() {
		this.loadIconPage();
		this.resizeCanvas();
		this.drawContent();
		this.hideScrollbars();
		this.createPolyominoes();
	};

	hideScrollbars() {
		const html = document.querySelector('html');
		Object.assign(html.style, { overflow: 'hidden', height: '100%', width: '100%', background: '#c3c3c3', userSelect: 'none' });
	};

	loadIconPage() {
		let icon_page = document.createElement('link');
		icon_page.rel = 'shortcut icon';
		icon_page.href = './assets/icon.png';
		document.head.appendChild(icon_page);
	};

	resizeCanvas() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	};

	drawContent() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.polyominoes.forEach(polyomino => polyomino.draw());

		this.ctx.font = '30px Helvetica';
		this.ctx.fillStyle = 'black';
		this.ctx.textAlign = 'center';
		this.ctx.fillText('Polyominoes Tiling', this.canvas.width / 2, 50);
		this.ctx.fillText('(Pavages de Polyominos)', this.canvas.width / 2, 100);

		this.buttons = [];
		this.drawButton('2D Version', this.canvas.width / 2, 200, () => { window.location.href = './2D/index.html'; });
		this.drawButton('3D Version', this.canvas.width / 2, 300, () => { window.location.href = './3D/index.html'; });
	};

	drawButton(text, x, y, onClick) {
		const buttonWidth = 200;
		const buttonHeight = 50;

		this.ctx.fillStyle = '#4CAF50';
		this.ctx.fillRect(x - buttonWidth / 2, y - buttonHeight / 2, buttonWidth, buttonHeight);

		this.ctx.fillStyle = '#fff';
		this.ctx.font = '20px Helvetica';
		this.ctx.textAlign = 'center';
		this.ctx.fillText(text, x, y);

		this.buttons.push({ text, x, y, width: buttonWidth, height: buttonHeight, onClick });
	};

	addEventListeners() {
		this.canvas.addEventListener('click', (e) => {
			const rect = this.canvas.getBoundingClientRect();
			const mouseX = e.clientX - rect.left;
			const mouseY = e.clientY - rect.top;

			this.buttons.forEach(button => {
				if (mouseX > button.x - button.width / 2 &&
					mouseX < button.x + button.width / 2 &&
					mouseY > button.y - button.height / 2 &&
					mouseY < button.y + button.height / 2) {
					button.onClick();
				}
			});
		});
		this.canvas.addEventListener('mousemove', (e) => {
			const rect = this.canvas.getBoundingClientRect();
			const mouseX = e.clientX - rect.left;
			const mouseY = e.clientY - rect.top;

			let cursor = 'default';
			this.buttons.forEach(button => {
				if (mouseX > button.x - button.width / 2 &&
					mouseX < button.x + button.width / 2 &&
					mouseY > button.y - button.height / 2 &&
					mouseY < button.y + button.height / 2) {
					cursor = 'pointer';
				}
			});
			this.canvas.style.cursor = cursor;
		});
	};

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
			const shape = (new Polyomino(this.ctx, type, 0, 0, 0, 0, this.colors[0])).grid;

			let x, y;
			let isOverlap;
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
			} while (isOverlap);

			const dx = (Math.random() * (maxSpeed - minSpeed) + minSpeed) * (Math.random() < 0.5 ? -1 : 1);
			const dy = (Math.random() * (maxSpeed - minSpeed) + minSpeed) * (Math.random() < 0.5 ? -1 : 1);
			
			const color = this.getRandomColor();

			this.polyominoes.push(new Polyomino(this.ctx, type, x, y, dx, dy, color));
		}
	};

	getRandomColor() {
		if (this.colors.length === 0) {
			this.colors = this.usedColors;
			this.usedColors = [];
		}
		const color = this.colors.splice(Math.floor(Math.random() * this.colors.length), 1)[0];
		this.usedColors.push(color);
		return color;
	};

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

								if (px < ppx + size &&
									px + size > ppx &&
									py < ppy + size &&
									py + size > ppy) {
									return true;
								}
							}
						}
					}
				}
			}
		}

		return false;
	};

	animate() {
		requestAnimationFrame(() => this.animate());
		this.polyominoes.forEach(polyomino => polyomino.update());
		this.drawContent();
	};
};

const main_app = new MainApp();
