export class GridBoard {
	constructor(canvas, gridSize, rows, cols) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.gridSize = gridSize;
		this.rows = rows;
		this.cols = cols;
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

	clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	};
};
