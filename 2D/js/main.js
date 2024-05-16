class MainApp {
	constructor() {
		this.canvas = document.getElementById('myCanvas');
		this.ctx = this.canvas.getContext('2d');
		this.gridSize = 30;
		this.rows = 10;
		this.cols = 10;
		this.polyominoes = [];
		this.init();
	};

	init() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.drawGrid();
		this.createPolyominoes();
		this.addEventListeners();
	};

	drawGrid() {
		this.ctx.strokeStyle = '#000';
		for (let i = 0; i <= this.cols; i++) {
			this.ctx.beginPath();
			this.ctx.moveTo(i * this.gridSize, 0);
			this.ctx.lineTo(i * this.gridSize, this.rows * this.gridSize);
			this.ctx.stroke();
		}
		for (let j = 0; j <= this.rows; j++) {
			this.ctx.beginPath();
			this.ctx.moveTo(0, j * this.gridSize);
			this.ctx.lineTo(this.cols * this.gridSize, j * this.gridSize);
			this.ctx.stroke();
		}
	};

	createPolyominoes() {
		this.polyominoes.push(new Polyomino(4, 1, 100, 100, 'red'));
		this.polyominoes.push(new Polyomino(2, 2, 200, 100, 'blue'));
		this.drawPolyominoes();
	};

	drawPolyominoes() {
		this.polyominoes.forEach(polyomino => polyomino.draw(this.ctx, this.gridSize));
	};

	addEventListeners() {
		let isDragging = false;
		let currentPolyomino = null;
		let offsetX, offsetY;

		this.canvas.addEventListener('mousedown', (e) => {
			const mousePos = this.getMousePos(e);
			this.polyominoes.forEach(polyomino => {
				if (polyomino.contains(mousePos.x, mousePos.y, this.gridSize)) {
					isDragging = true;
					currentPolyomino = polyomino;
					offsetX = mousePos.x - polyomino.x;
					offsetY = mousePos.y - polyomino.y;
				}
			});
		});

		this.canvas.addEventListener('mousemove', (e) => {
			if (isDragging && currentPolyomino) {
				const mousePos = this.getMousePos(e);
				currentPolyomino.x = mousePos.x - offsetX;
				currentPolyomino.y = mousePos.y - offsetY;
				this.redraw();
			}
		});

		this.canvas.addEventListener('mouseup', () => {
			isDragging = false;
			currentPolyomino = null;
		});
	};

	getMousePos(e) {
		const rect = this.canvas.getBoundingClientRect();
		return {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top
		};
	};

	redraw() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.drawGrid();
		this.drawPolyominoes();
	};
};

class Polyomino {
	constructor(width, height, x, y, color) {
		this.width = width;
		this.height = height;
		this.x = x;
		this.y = y;
		this.color = color;
	};

	draw(ctx, gridSize) {
		ctx.fillStyle = this.color;
		for (let i = 0; i < this.width; i++) {
			for (let j = 0; j < this.height; j++) {
				ctx.fillRect(this.x + i * gridSize, this.y + j * gridSize, gridSize, gridSize);
				ctx.strokeRect(this.x + i * gridSize, this.y + j * gridSize, gridSize, gridSize);
			}
		}
	};

	contains(mouseX, mouseY, gridSize) {
		return mouseX >= this.x && mouseX < this.x + this.width * gridSize &&
			   mouseY >= this.y && mouseY < this.y + this.height * gridSize;
	};
};

const main_app = new MainApp();

