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
		this.iconSize = 16;
	};

	draw(ctx, gridSize, isSelected) {
		ctx.fillStyle = this.color;
		for (let i = 0; i < this.shape.length; i++) {
			for (let j = 0; j < this.shape[i].length; j++) {
				if (this.shape[i][j] === 1) {
					ctx.fillRect(this.x + j * gridSize, this.y + i * gridSize, gridSize, gridSize);
					ctx.strokeStyle = isSelected ? 'white' : 'black';
					ctx.strokeRect(this.x + j * gridSize, this.y + i * gridSize, gridSize, gridSize);
				}
			}
		}
	};

	drawIcons(ctx, gridSize, icons) {
		const centerX = this.x + (this.shape[0].length * gridSize) / 2;
		const centerY = this.y + (this.shape.length * gridSize) / 2;
		ctx.drawImage(icons.flip, centerX - this.iconSize, centerY - gridSize - this.iconSize, this.iconSize * 2, this.iconSize * 2);
		ctx.drawImage(icons.rotateLeft, centerX - gridSize - this.iconSize * 2, centerY - this.iconSize, this.iconSize * 2, this.iconSize * 2);
		ctx.drawImage(icons.rotateRight, centerX + gridSize, centerY - this.iconSize, this.iconSize * 2, this.iconSize * 2);
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

	checkIconsClick(mousePos) {
		const centerX = this.x + (this.shape[0].length * this.app.gridSize) / 2;
		const centerY = this.y + (this.shape.length * this.app.gridSize) / 2;
		const icons = [
			{ type: 'flip', x: centerX - this.iconSize, y: centerY - this.app.gridSize - this.iconSize },
			{ type: 'rotateLeft', x: centerX - this.app.gridSize - this.iconSize * 2, y: centerY - this.iconSize },
			{ type: 'rotateRight', x: centerX + this.app.gridSize, y: centerY - this.iconSize }
		];

		for (let icon of icons) {
			if (mousePos.x >= icon.x && mousePos.x < icon.x + this.iconSize * 2 &&
				mousePos.y >= icon.y && mousePos.y < icon.y + this.iconSize * 2) {
				this.handleIconClick(icon.type);
				return true;
			}
		}
		return false;
	};

	handleIconClick(type) {
		switch (type) {
			case 'flip':
				this.flip();
				break;
			case 'rotateLeft':
				this.rotateLeft();
				break;
			case 'rotateRight':
				this.rotateRight();
				break;
		}
		this.app.redraw();
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

	rotateLeft() {
		this.rotate();
		this.rotate();
		this.rotate();
	};

	rotateRight() {
		this.rotate();
	};

	flip() {
		for (let row of this.shape) {
			row.reverse();
		}
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
