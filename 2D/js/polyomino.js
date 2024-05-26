export class Polyomino {
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
