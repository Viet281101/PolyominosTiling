class Tetris {
	constructor(canvasId) {
		this.canvas = document.getElementById(canvasId);
		this.ctx = this.canvas.getContext('2d');
		this.blockSize = 30;
		this.rows = this.canvas.height / this.blockSize;
		this.cols = this.canvas.width / this.blockSize;
		this.score = 0;
		this.board = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
		this.tetriminos = [
			{ shape: [[1, 1, 1, 1]], color: 'cyan' },
			{ shape: [[1, 1, 1, 0], [1]], color: 'blue' },
			{ shape: [[1, 1, 1, 0], [0, 0, 1]], color: 'orange' },
			{ shape: [[1, 1, 0], [0, 1, 1]], color: 'yellow' },
			{ shape: [[0, 1, 1], [1, 1]], color: 'green' },
			{ shape: [[1, 1, 1], [0, 1, 0]], color: 'purple' },
			{ shape: [[0, 1, 1, 0], [0, 1, 1]], color: 'red' }
		];
		this.applyStyles();
		this.reset();
		this.bindEvents();
		this.startGame();
	};

	applyStyles() {
		this.canvas.style.border = '1px solid black';
		this.canvas.style.display = 'block';
		this.canvas.style.margin = 'auto';
	};

	reset() {
		this.x = Math.floor(this.cols / 2) - 2;
		this.y = 0;
		this.currentTetrimino = this.getRandomTetrimino();
		if (this.collides()) {
			// game over
			this.board = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
			this.score = 0;
		}
	};

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
	};

	rotate(matrix) {
		const N = matrix.length - 1;
		return matrix.map((row, i) =>
			row.map((val, j) => matrix[N - j][i])
		);
	};

	move(dir) {
		this.x += dir;
		if (this.collides()) {
			this.x -= dir;
		}
	};

	drop() {
		this.y++;
		if (this.collides()) {
			this.y--;
			this.merge();
			this.reset();
			this.clearRows();
		}
	};

	merge() {
		for (let row = 0; row < this.currentTetrimino.shape.length; row++) {
			for (let col = 0; col < this.currentTetrimino.shape[row].length; col++) {
				if (this.currentTetrimino.shape[row][col]) {
					this.board[row + this.y][col + this.x] = this.currentTetrimino.color;
				}
			}
		}
	};

	drawBlock(x, y, color) {
		this.ctx.fillStyle = color;
		this.ctx.fillRect(x * this.blockSize, y * this.blockSize, this.blockSize, this.blockSize);
		this.ctx.strokeRect(x * this.blockSize, y * this.blockSize, this.blockSize, this.blockSize);
	};

	drawBoard() {
		for (let row = 0; row < this.rows; row++) {
			for (let col = 0; col < this.cols; col++) {
				if (this.board[row][col]) {
					this.drawBlock(col, row, this.board[row][col]);
				}
			}
		}
	};

	drawTetrimino() {
		for (let row = 0; row < this.currentTetrimino.shape.length; row++) {
			for (let col = 0; col < this.currentTetrimino.shape[row].length; col++) {
				if (this.currentTetrimino.shape[row][col]) {
					this.drawBlock(this.x + col, this.y + row, this.currentTetrimino.color);
				}
			}
		}
	};

	getRandomTetrimino() {
		return { ...this.tetriminos[Math.floor(Math.random() * this.tetriminos.length)] };
	};

	clearRows() {
		outer: for (let row = this.rows - 1; row >= 0; row--) {
			for (let col = 0; col < this.cols; col++) {
				if (!this.board[row][col]) {
					continue outer;
				}
			}

			this.board.splice(row, 1);
			this.board.unshift(Array(this.cols).fill(0));
			this.score += 10;
		}
	};

	bindEvents() {
		document.addEventListener('keydown', (e) => {
			if (e.key === 'ArrowLeft') {
				this.move(-1);
			} else if (e.key === 'ArrowRight') {
				this.move(1);
			} else if (e.key === 'ArrowDown') {
				this.drop();
			} else if (e.key === 'ArrowUp') {
				this.currentTetrimino.shape = this.rotate(this.currentTetrimino.shape);
				if (this.collides()) {
					this.currentTetrimino.shape = this.rotate(this.currentTetrimino.shape);
					this.currentTetrimino.shape = this.rotate(this.currentTetrimino.shape);
					this.currentTetrimino.shape = this.rotate(this.currentTetrimino.shape);
				}
			}

			this.draw();
		});
	};

	draw() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.drawBoard();
		this.drawTetrimino();
		this.ctx.fillText('Score: ' + this.score, 10, 20);
	};

	startGame() {
		setInterval(() => {
			this.drop();
			this.draw();
		}, 1000);
		this.draw();
	};
};

document.addEventListener('DOMContentLoaded', () => {
	new Tetris('canvas');
});
