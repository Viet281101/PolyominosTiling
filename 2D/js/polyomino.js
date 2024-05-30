export class Polyomino {
	constructor(shape, x, y, color, app) {
		this.shape = shape;
		this.x = x;
		this.y = y;
		this.originalX = x;
		this.originalY = y;
		this.lastX = x;
		this.lastY = y;
		this.color = color;
		this.app = app;
		this.isDragging = false;
		this.isPlaced = false;
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
		if (!this.isPlaced) {
			const centerX = this.x + (this.shape[0].length * gridSize) / 2;
			const centerY = this.y + (this.shape.length * gridSize) / 2;
			const radius = ((gridSize * Math.abs(this.shape[0].length > this.shape.length ? this.shape[0].length : this.shape.length)) / 2) + (this.iconSize * 1.75);
			const iconPositions = [
				{ icon: icons.flip, angle: -90 },
				{ icon: icons.rotateLeft, angle: -162 },
				{ icon: icons.rotateRight, angle: -18 },
				{ icon: icons.duplicate, angle: 128 },
				{ icon: icons.trash, angle: 52 },
			];
			iconPositions.forEach(({ icon, angle }) => {
				const rad = (angle * Math.PI) / 180;
				const iconX = centerX + radius * Math.cos(rad) - this.iconSize;
				const iconY = centerY + radius * Math.sin(rad) - this.iconSize;
				ctx.drawImage(icon, iconX, iconY, this.iconSize * 2, this.iconSize * 2);
			});
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

	checkIconsClick(mousePos) {
		const centerX = this.x + (this.shape[0].length * this.app.gridSize) / 2;
		const centerY = this.y + (this.shape.length * this.app.gridSize) / 2;
		const radius = ((this.app.gridSize * Math.abs(this.shape[0].length > this.shape.length ? this.shape[0].length : this.shape.length)) / 2) + (this.iconSize * 1.75);
		const iconPositions = [
			{ type: 'flip', angle: -90 },
			{ type: 'rotateLeft', angle: -162 },
			{ type: 'rotateRight', angle: -18 },
			{ type: 'duplicate', angle: 128 },
			{ type: 'trash', angle: 52 },
		];
		for (let { type, angle } of iconPositions) {
			const rad = (angle * Math.PI) / 180;
			const iconX = centerX + radius * Math.cos(rad) - this.iconSize;
			const iconY = centerY + radius * Math.sin(rad) - this.iconSize;
			if (mousePos.x >= iconX && mousePos.x < iconX + this.iconSize * 2 &&
				mousePos.y >= iconY && mousePos.y < iconY + this.iconSize * 2) {
				this.handleIconClick(type);
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
			case 'duplicate':
				this.app.duplicatePolyomino(this);
				break;
			case 'trash':
				this.app.deletePolyomino(this);
				break;
		}
		this.app.redraw();
	};

	onMouseDown(mousePos) {
		if (this.contains(mousePos.x, mousePos.y, this.app.gridSize)) {
			if (this.isPlaced) {
				this.app.gridBoard.removePolyomino(this);
				this.isPlaced = false;
			}
			this.isDragging = true;
			this.offsetX = mousePos.x - this.x;
			this.offsetY = mousePos.y - this.y;
			this.app.selectedPolyomino = this;

			this.lastX = this.x;
			this.lastY = this.y;
		}
		this.app.canvas.style.cursor = 'grabbing';
	};

	onMouseMove(mousePos) {
		if (this.isDragging) {
			this.x = mousePos.x - this.offsetX;
			this.y = mousePos.y - this.offsetY;
		}
	};

	onMouseUp() {
		if (this.isDragging) {
			this.isDragging = false;
			this.app.canvas.style.cursor = 'default';

			const gridSize = this.app.gridSize;
			const offsetX = this.app.gridBoard.gridOffsetX;
			const offsetY = this.app.gridBoard.gridOffsetY;

			const newX = Math.round((this.x - offsetX) / gridSize) * gridSize + offsetX;
			const newY = Math.round((this.y - offsetY) / gridSize) * gridSize + offsetY;

			this.x = newX;
			this.y = newY;

			if (this.app.gridBoard.isInBounds(this)) {
				if (!this.app.gridBoard.isOverlapping(this)) {
					this.app.placePolyomino(this);
					this.isPlaced = true;
				} else {
					this.x = this.lastX;
					this.y = this.lastY;
				}
			}
			this.app.redraw();
		}
	};

	resetPosition() {
		this.x = this.originalX;
		this.y = this.originalY;
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

export function getRandomColor() {
	const letters = '0123456789ABCDEF';
	let color = '#';
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
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
