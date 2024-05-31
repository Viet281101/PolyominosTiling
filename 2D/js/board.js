export class GridBoard {
    constructor(canvas, gridSize, rows, cols) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gridSize = gridSize;
        this.rows = rows;
        this.cols = cols;
        this.gridOffsetX = 50;
        this.gridOffsetY = 50;
        this.grid = this.createGrid(rows, cols);
        this.updateCanvasSize();
        this.clear();
        this.drawGrid();
    }

    updateCanvasSize() {
        this.canvas.width = this.cols * this.gridSize + this.gridOffsetX * 2;
        this.canvas.height = this.rows * this.gridSize + this.gridOffsetY * 2;
    }

    createGrid(rows, cols) {
        const grid = [];
        for (let row = 0; row < rows; row++) {
            const gridRow = [];
            for (let col = 0; col < cols; col++) {
                gridRow.push(0);
            }
            grid.push(gridRow);
        }
        return grid;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawGrid() {
        this.ctx.strokeStyle = '#ddd';
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.ctx.strokeRect(
                    this.gridOffsetX + col * this.gridSize,
                    this.gridOffsetY + row * this.gridSize,
                    this.gridSize,
                    this.gridSize
                );
            }
        }
    }

    getMousePos(event) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    getTouchPos(event) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: event.touches[0].clientX - rect.left,
            y: event.touches[0].clientY - rect.top
        };
    }

    placePolyomino(polyomino) {
        const gridX = Math.floor((polyomino.x - this.gridOffsetX) / this.gridSize);
        const gridY = Math.floor((polyomino.y - this.gridOffsetY) / this.gridSize);
        for (let row = 0; row < polyomino.shape.length; row++) {
            for (let col = 0; col < polyomino.shape[row].length; col++) {
                if (polyomino.shape[row][col]) {
                    this.grid[gridY + row][gridX + col] = 1;
                }
            }
        }
    }

    removePolyomino(polyomino) {
        const gridX = Math.floor((polyomino.x - this.gridOffsetX) / this.gridSize);
        const gridY = Math.floor((polyomino.y - this.gridOffsetY) / this.gridSize);
        for (let row = 0; row < polyomino.shape.length; row++) {
            for (let col = 0; col < polyomino.shape[row].length; col++) {
                if (polyomino.shape[row][col]) {
                    this.grid[gridY + row][gridX + col] = 0;
                }
            }
        }
    }

    isInBounds(polyomino) {
        const gridX = Math.floor((polyomino.x - this.gridOffsetX) / this.gridSize);
        const gridY = Math.floor((polyomino.y - this.gridOffsetY) / this.gridSize);
        for (let row = 0; row < polyomino.shape.length; row++) {
            for (let col = 0; col < polyomino.shape[row].length; col++) {
                if (polyomino.shape[row][col]) {
                    if (gridY + row < 0 || gridY + row >= this.rows || gridX + col < 0 || gridX + col >= this.cols) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    isOverlapping(polyomino) {
        const gridX = Math.floor((polyomino.x - this.gridOffsetX) / this.gridSize);
        const gridY = Math.floor((polyomino.y - this.gridOffsetY) / this.gridSize);
        for (let row = 0; row < polyomino.shape.length; row++) {
            for (let col = 0; col < polyomino.shape[row].length; col++) {
                if (polyomino.shape[row][col]) {
                    if (this.grid[gridY + row][gridX + col] === 1) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}
