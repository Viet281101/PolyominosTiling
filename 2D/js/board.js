export class GridBoard {
	constructor(canvas, gridSize, rows, cols) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.gridSize = gridSize;
		this.rows = rows;
		this.cols = cols;
		this.grid = Array.from({ length: rows }, () => Array(cols).fill(null));
		this.resizeCanvas();
		this.drawGrid();

		window.addEventListener('resize', () => {
			this.resizeCanvas();
			this.drawGrid();
		});
	};

	resizeCanvas() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.gridOffsetX = (this.canvas.width - this.cols * this.gridSize) / 2;
		this.gridOffsetY = (this.canvas.height - this.rows * this.gridSize) / 2;
	};

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

	getMousePos(e) {
		const rect = this.canvas.getBoundingClientRect();
		return {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top
		};
	};

	getTouchPos(e) {
		const rect = this.canvas.getBoundingClientRect();
		return {
			x: e.touches[0].clientX - rect.left,
			y: e.touches[0].clientY - rect.top
		};
	};

	clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	};

	isInBounds(polyomino) {
		const { x, y, shape } = polyomino;
		const gridSize = this.gridSize;
		const offsetX = this.gridOffsetX;
		const offsetY = this.gridOffsetY;

		for (let i = 0; i < shape.length; i++) {
			for (let j = 0; j < shape[i].length; j++) {
				if (shape[i][j] === 1) {
					const posX = Math.floor((x - offsetX + j * gridSize) / gridSize);
					const posY = Math.floor((y - offsetY + i * gridSize) / gridSize);
					if (posX < 0 || posX >= this.cols || posY < 0 || posY >= this.rows) {
						return false;
					}
				}
			}
		}
		return true;
	};

	isOverlapping(polyomino) {
		const { x, y, shape } = polyomino;
		const gridSize = this.gridSize;
		const offsetX = this.gridOffsetX;
		const offsetY = this.gridOffsetY;

		for (let i = 0; i < shape.length; i++) {
			for (let j = 0; j < shape[i].length; j++) {
				if (shape[i][j] === 1) {
					const posX = Math.floor((x - offsetX + j * gridSize) / gridSize);
					const posY = Math.floor((y - offsetY + i * gridSize) / gridSize);
					if (this.grid[posY][posX] !== null) {
						return true;
					}
				}
			}
		}
		return false;
	};

	placePolyomino(polyomino) {
		const { x, y, shape, color } = polyomino;
		const gridSize = this.gridSize;
		const offsetX = this.gridOffsetX;
		const offsetY = this.gridOffsetY;

		for (let i = 0; i < shape.length; i++) {
			for (let j = 0; j < shape[i].length; j++) {
				if (shape[i][j] === 1) {
					const posX = Math.floor((x - offsetX + j * gridSize) / gridSize);
					const posY = Math.floor((y - offsetY + i * gridSize) / gridSize);
					this.grid[posY][posX] = color;
				}
			}
		}
	};
};
