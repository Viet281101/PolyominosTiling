import { GridBoard } from './board.js';
import { Polyomino, getRandomColor } from './polyomino.js';
import { GUIController } from './gui.js';
import { Toolbar } from './toolbar.js';
import { backtrackingAutoTiling } from './ai.js';

class MainApp {
	constructor() {
		this.canvas = document.getElementById('myCanvas');
		this.gridSize = 30;
		this.rows = 10;
		this.cols = 10;
		this.polyominoes = [];
		this.selectedPolyomino = null;
		this.icons = {
			flip: new Image(),
			rotateLeft: new Image(),
			rotateRight: new Image(),
			duplicate: new Image(),
			trash: new Image()
		};
		const as = "../assets/";
		this.icons.flip.src = as + 'ic_flip.png';
		this.icons.rotateLeft.src = as + 'ic_rotate_left.png';
		this.icons.rotateRight.src = as + 'ic_rotate_right.png';
		this.icons.duplicate.src = as + 'ic_duplicate.png';
		this.icons.trash.src = as + 'ic_trash.png';
		this.gridBoard = new GridBoard(this.canvas, this.gridSize, this.rows, this.cols);
		this.guiController = new GUIController(this);
		this.toolbar = new Toolbar(this);
		this.needsRedraw = true;
		this.isBlackening = false;
		this.blackenedCells = new Set();
		this.init();
	};

	init() {
		Object.assign(document.body.style, { margin: '0', padding: '0', overflow: 'hidden' });
		this.canvas.style.backgroundColor = '#c3c3c3';
		this.addEventListeners();
	};

	drawPolyominoes() {
		this.polyominoes.forEach(polyomino => polyomino.draw(this.gridBoard.ctx, this.gridSize, this.selectedPolyomino === polyomino));
	};

	addEventListeners() {
		this.canvas.addEventListener('mousedown', (e) => {
			const mousePos = this.gridBoard.getMousePos(e);
			this.handleMouseDown(mousePos);
		});
		this.canvas.addEventListener('mousemove', (e) => {
			const mousePos = this.gridBoard.getMousePos(e);
			this.handleMouseMove(mousePos);
		});
		this.canvas.addEventListener('mouseup', (e) => {
			this.handleMouseUp();
		});
		window.addEventListener('keydown', (e) => {
			if (e.key === 'r' && this.selectedPolyomino) { this.selectedPolyomino.rotate(); this.redraw(); }
		});
		window.addEventListener('resize', () => {
			this.gridBoard.resizeCanvas();
			this.gridBoard.drawGrid();
			this.guiController.checkWindowSize();
			this.toolbar.resizeToolbar();
		});
		this.canvas.addEventListener('touchstart', (e) => {
			e.preventDefault();
			const touchPos = this.gridBoard.getTouchPos(e);
			this.handleMouseDown(touchPos);
		});
		this.canvas.addEventListener('touchmove', (e) => {
			e.preventDefault();
			const touchPos = this.gridBoard.getTouchPos(e);
			this.handleMouseMove(touchPos);
		});
		this.canvas.addEventListener('touchend', (e) => {
			e.preventDefault();
			this.handleMouseUp();
		});
	};

	handleMouseDown(mousePos) {
		if (this.isBlackening) {
			const col = Math.floor((mousePos.x - this.gridBoard.gridOffsetX) / this.gridSize);
			const row = Math.floor((mousePos.y - this.gridBoard.gridOffsetY) / this.gridSize);
			if (col >= 0 && col < this.cols && row >= 0 && row < this.rows) {
				const cellKey = `${row}-${col}`;
				if (this.blackenedCells.has(cellKey)) {
					this.blackenedCells.delete(cellKey);
					this.gridBoard.grid[row][col] = null;
				} else {
					this.blackenedCells.add(cellKey);
					this.gridBoard.grid[row][col] = '#000000';
				}
				this.redraw();
			} else { this.isBlackening = false; this.canvas.style.cursor = 'default'; }
		} else {
			let clickedOnIcon = false;
			if (this.selectedPolyomino) {
				clickedOnIcon = this.selectedPolyomino.checkIconsClick(mousePos);
			}
			if (!clickedOnIcon) {
				let selected = false;
				for (let i = this.polyominoes.length - 1; i >= 0; i--) {
					const polyomino = this.polyominoes[i];
					if (polyomino.contains(mousePos.x, mousePos.y, this.gridSize)) {
						if (polyomino.isPlaced) {
							this.gridBoard.removePolyomino(polyomino);
							polyomino.isPlaced = false;
						}
						polyomino.onMouseDown(mousePos);
						this.selectedPolyomino = polyomino;
						this.guiController.settings.selectedColor = polyomino.color;
						selected = true;
						break;
					}
				}
				if (!selected) { this.selectedPolyomino = null; }
			}
			this.redraw();
		}
	};

	handleMouseMove(mousePos) {
		if (this.isBlackening) this.canvas.style.cursor = 'url("../assets/cursor_blackend.png"), auto';
		this.polyominoes.forEach(polyomino => polyomino.onMouseMove(mousePos));
		this.redraw();
	};

	handleMouseUp() {
		this.polyominoes.forEach(polyomino => polyomino.onMouseUp());
		this.redraw();
	};

	redraw() {
		if (!this.needsRedraw) return;
		this.gridBoard.clear();
		this.gridBoard.drawGrid();
		this.drawPolyominoes();
		if (this.selectedPolyomino && !this.selectedPolyomino.isDragging) {
			this.selectedPolyomino.drawIcons(this.gridBoard.ctx, this.gridSize, this.icons);
		}
	};

	placePolyomino(polyomino) {
		this.gridBoard.placePolyomino(polyomino);
		polyomino.isPlaced = true;
		this.selectedPolyomino = null;
		this.redraw();
	};

	duplicatePolyomino(polyomino) {
		let newColor;
		do { newColor = getRandomColor();
		} while (newColor === polyomino.color);
		const newShape = polyomino.shape.map(row => row.slice());
		const newPolyomino = new Polyomino(newShape, polyomino.x, polyomino.y, newColor, this);
		this.polyominoes.push(newPolyomino);
		this.redraw();
	};

	deletePolyomino(polyomino) {
		const index = this.polyominoes.indexOf(polyomino);
		if (index !== -1) {
			this.polyominoes.splice(index, 1);
			this.selectedPolyomino = null;
			this.redraw();
		}
	};

	clearBoard() {
		this.needsRedraw = false;
		this.gridBoard.clearGrid();
		this.polyominoes = [];
		this.selectedPolyomino = null;
		this.gridBoard.clear();
	};

	createNewBoard(rows, cols, gridSize) {
		this.rows = rows;
		this.cols = cols;
		this.gridSize = gridSize;
		this.gridBoard = new GridBoard(this.canvas, this.gridSize, this.rows, this.cols);
		this.needsRedraw = true;
		this.redraw();
	};

	updateGridSize(newGridSize) {
		this.resetBoard();
		this.gridSize = newGridSize;
		this.gridBoard.gridSize = newGridSize;
		this.gridBoard.resizeCanvas();
		this.redraw();
	};

	resetBoard() {
		this.polyominoes.forEach(polyomino => {
			if (polyomino.isPlaced) {
				this.gridBoard.removePolyomino(polyomino);
				polyomino.isPlaced = false;
			}
		});
		this.redraw();
	};

	backtrackingAutoTiling() {
		this.resetBoard();
		backtrackingAutoTiling(this.polyominoes, this.gridBoard, this.placePolyomino.bind(this), this.gridBoard.removePolyomino.bind(this), this.redraw.bind(this));
	};
};

const main_app = new MainApp();
