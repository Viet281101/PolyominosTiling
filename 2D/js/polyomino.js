export class Polyomino {
	constructor(shape, x, y, color, app) {
		this.shape = shape;
		this.x = x;
		this.y = y;
		this.color = color;
		this.app = app;
		this.isDragging = false;
		this.offsetX = 0;
		this.offsetY = 0;
	};

	draw(ctx, gridSize) {
		ctx.fillStyle = this.color;
		for (let i = 0; i < this.shape.length; i++) {
			for (let j = 0; j < this.shape[i].length; j++) {
				if (this.shape[i][j] === 1) {
					ctx.fillRect(this.x + j * gridSize, this.y + i * gridSize, gridSize, gridSize);
					ctx.strokeRect(this.x + j * gridSize, this.y + i * gridSize, gridSize, gridSize);
				}
			}
		}
	};

	contains(mouseX, mouseY, gridSize) {
		for (let i = 0; i < this.shape.length; i++) {
			for (let j = 0; j < this.shape[i].length; j++) {
				if (this.shape[i][j] === 1) {
					const rectX = this.x + j * gridSize;
					const rectY = this.y + i * gridSize;
					if (mouseX >= rectX && mouseX < rectX + gridSize &&
						mouseY >= rectY && mouseY < rectY + gridSize) {
						return true;
					}
				}
			}
		}
		return false;
	};

	onMouseDown(mousePos) {
		if (this.contains(mousePos.x, mousePos.y, this.app.gridSize)) {
			this.isDragging = true;
			this.offsetX = mousePos.x - this.x;
			this.offsetY = mousePos.y - this.y;
		}
	};

	onMouseMove(mousePos) {
		if (this.isDragging) {
			this.x = mousePos.x - this.offsetX;
			this.y = mousePos.y - this.offsetY;
		}
	};

	onMouseUp() {
		this.isDragging = false;
	};

	rotate() {
		const newShape = [];
		for (let i = 0; i < this.shape[0].length; i++) {
			newShape.push([]);
			for (let j = 0; j < this.shape.length; j++) {
				newShape[i].push(this.shape[this.shape.length - 1 - j][i]);
			}
		}
		this.shape = newShape;
	};
};

export const SHAPES = {
	MONOMINO: [[1]],
	DOMINO: [[1, 1]],
	TROMINO: [[1, 1, 1]],
	TETROMINO_I: [[1, 1, 1, 1]],
	TETROMINO_O: [[1, 1], [1, 1]],
	TETROMINO_S: [[0, 1, 1], [1, 1, 0]],
	TETROMINO_T: [[0, 1, 0], [1, 1, 1]],
	TETROMINO_L: [[1, 0, 0], [1, 1, 1]],
};
