import { Polyomino } from './polyomino.js';

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
		this.resizeCanvas();
		this.drawGrid();
		this.createPolyominoes();
		this.addEventListeners();

		window.addEventListener('resize', () => {
			this.resizeCanvas();
			this.drawGrid();
			this.redraw();
		});
	};

	resizeCanvas() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.gridOffsetX = (this.canvas.width - this.cols * this.gridSize) / 2;
		this.gridOffsetY = (this.canvas.height - this.rows * this.gridSize) / 2;
	}

	drawGrid() {
		this.ctx.strokeStyle = '#000';
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		for (let i = 0; i <= this.cols; i++) {
			this.ctx.beginPath();
			this.ctx.moveTo(this.gridOffsetX + i * this.gridSize, this.gridOffsetY);
			this.ctx.lineTo(this.gridOffsetX + i * this.gridSize, this.gridOffsetY + this.rows * this.gridSize);
			this.ctx.stroke();
		}
		for (let j = 0; j <= this.rows; j++) {
			this.ctx.beginPath();
			this.ctx.moveTo(this.gridOffsetX, this.gridOffsetY + j * this.gridSize);
			this.ctx.lineTo(this.gridOffsetX + this.cols * this.gridSize, this.gridOffsetY + j * this.gridSize);
			this.ctx.stroke();
		}
	};

	createPolyominoes() {
		this.polyominoes.push(new Polyomino(4, 1, 100, 100, 'red'));
		this.polyominoes.push(new Polyomino(2, 2, 200, 100, 'blue'));
		this.polyominoes.push(new Polyomino(1, 1, 300, 100, 'green')); // Monomino
		this.polyominoes.push(new Polyomino(1, 3, 400, 100, 'purple')); // Tromino
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

const main_app = new MainApp();
