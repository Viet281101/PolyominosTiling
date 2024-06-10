import { GridBoard } from './board.js';
import { Polyomino, getRandomColor } from './polyomino.js';
import { GUIController } from './gui.js';
import { Toolbar } from './toolbar.js';
import { backtrackingAutoTiling, bruteForceTiling, randomTiling, randomBacktrackingTiling } from './ai.js';

class MainApp {
	constructor() {
		this.canvas = document.getElementById('myCanvas');
		this.gridSize = 30;
		this.rows = this.cols = 10;
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
		this.isBlackening = false;
		this.blackenedCells = new Set();
		this.tooltipPolyominoBlocks();
		this.init();
	};

	init() {
		Object.assign(document.body.style, { margin: '0', padding: '0', overflow: 'hidden' });
		this.canvas.style.backgroundColor = '#c3c3c3';
		this.addEventListeners();
	};

	tooltipPolyominoBlocks() {
		this.tooltipPolyomino = false;
		this.tooltip = document.createElement('div');
		this.tooltip.style.position = 'absolute';
		this.tooltip.style.backgroundColor = '#fff';
		this.tooltip.style.border = '1px solid #000';
		this.tooltip.style.padding = '5px';
		this.tooltip.style.display = 'none';
		document.body.appendChild(this.tooltip);
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
			this.tooltip.style.display = 'none';
			this.redraw();
		}
	};

	handleMouseMove(mousePos) {
		if (this.isBlackening) this.canvas.style.cursor = 'url("../assets/cursor_blacken.png"), auto';
		this.polyominoes.forEach(polyomino => polyomino.onMouseMove(mousePos));
		if (this.tooltipPolyomino && !this.selectedPolyomino?.isDragging) {
			let found = false;
			for (let i = this.polyominoes.length - 1; i >= 0; i--) {
				const polyomino = this.polyominoes[i];
				if (polyomino.contains(mousePos.x, mousePos.y, this.gridSize)) {
					this.tooltip.innerHTML = `${polyomino.name} (#${i + 1})`;
					this.tooltip.style.left = `${mousePos.x + 10}px`;
					this.tooltip.style.top = `${mousePos.y + 10}px`;
					this.tooltip.style.display = 'block';
					found = true;
					break;
				}
			}
			if (!found) { this.tooltip.style.display = 'none'; }
		} else { this.tooltip.style.display = 'none'; }
		this.redraw();
	};

	handleMouseUp() {
		this.polyominoes.forEach(polyomino => polyomino.onMouseUp());
		this.redraw();
	};

	redraw() {
		this.gridBoard.clear();
		this.gridBoard.drawGrid();
		this.drawPolyominoes();
		if (this.selectedPolyomino && !this.selectedPolyomino.isDragging) {
			this.selectedPolyomino.drawIcons(this.gridBoard.ctx, this.gridSize, this.icons);
		}
		if (this.clearedBoard) this.clearBoard();
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

	deleteAllPolyominos() {
		this.polyominoes = [];
		this.selectedPolyomino = null;
		this.redraw();
	};

	clearBoard() {
		const polyominoStates = this.polyominoes.map(polyomino => ({ shape: polyomino.shape.map(row => [...row]), x: polyomino.x, y: polyomino.y, color: polyomino.color, name: polyomino.name }));
		this.gridBoard.clear();
		this.polyominoes = [];
		this.selectedPolyomino = null;
		this.clearedBoard = true;
		polyominoStates.forEach(state => {
			const newPolyomino = new Polyomino(state.shape, state.x, state.y, state.color, this, state.name);
			this.polyominoes.push(newPolyomino);
		});
		this.gridBoard.clear();
		this.drawPolyominoes();
	};

	createNewBoard(rows, cols, gridSize) {
		this.clearedBoard = false;
		this.rows = rows;
		this.cols = cols;
		this.gridSize = gridSize;
		this.gridBoard = new GridBoard(this.canvas, this.gridSize, this.rows, this.cols);
		this.redraw();
	};

	updateGridSize(newGridSize) {
		this.resetBoard();
		this.gridSize = newGridSize;
		this.gridBoard.gridSize = newGridSize;
		this.gridBoard.resizeCanvas();
		this.redraw();
	};

	resetRotations() {
		this.polyominoes.forEach(polyomino => {
			const rotationCount = polyomino.nbRotations % 4;
			if (rotationCount === 0) { return; }
			else if (rotationCount > 0) { for (let i = 0; i < rotationCount; i++) { polyomino.rotateLeft(); } }
			else { for (let i = 0; i < Math.abs(rotationCount); i++) { polyomino.rotateRight(); } }
			polyomino.nbRotations = 0;
		});
	};

	autoRandomBlackening() {
		const totalCells = this.gridBoard.rows * this.gridBoard.cols;
		const minBlackCells = Math.floor(totalCells * 0.20);
		const maxBlackCells = Math.floor(totalCells * 0.25);
		const nbBlackCellsWanted = Math.floor(Math.random() * (maxBlackCells - minBlackCells + 1)) + minBlackCells;
		let currentBlackCells = this.blackenedCells.size;

		while (currentBlackCells < nbBlackCellsWanted) {
			const randomRow = Math.floor(Math.random() * this.gridBoard.rows);
			const randomCol = Math.floor(Math.random() * this.gridBoard.cols);
			const cellKey = `${randomRow}-${randomCol}`;

			if (!this.blackenedCells.has(cellKey)) {
				this.blackenedCells.add(cellKey);
				this.gridBoard.grid[randomRow][randomCol] = '#000000';
				currentBlackCells++;
			}
		}
		this.redraw();
	};

	autoWhitening() {
		this.blackenedCells.clear();
		for (let row = 0; row < this.gridBoard.rows; row++) {
			for (let col = 0; col < this.gridBoard.cols; col++) {
				this.gridBoard.grid[row][col] = null;
			}
		}
		this.redraw();
	};

	invertBlackWhite() {
		for (let row = 0; row < this.gridBoard.rows; row++) {
			for (let col = 0; col < this.gridBoard.cols; col++) {
				const cellKey = `${row}-${col}`;
				if (this.blackenedCells.has(cellKey)) {
					this.blackenedCells.delete(cellKey);
					this.gridBoard.grid[row][col] = null;
				} else {
					this.blackenedCells.add(cellKey);
					this.gridBoard.grid[row][col] = '#000000';
				}
			}
		}
		this.redraw();
	};

	resetBoard() {
		this.polyominoes.forEach(polyomino => {
			if (polyomino.isPlaced) {
				this.gridBoard.removePolyomino(polyomino);
				polyomino.isPlaced = false;
				polyomino.resetPosition();
			}
		});
		this.resetRotations();
		this.redraw();
	};

	mixPosition() {
		const margin = 70;
		const gridLeft = this.gridBoard.gridOffsetX;
		const gridTop = this.gridBoard.gridOffsetY;
		const gridRight = this.gridBoard.gridOffsetX + this.gridSize * this.cols;
		const gridBottom = this.gridBoard.gridOffsetY + this.gridSize * this.rows;
		const windowWidth = window.innerWidth;
		const windowHeight = window.innerHeight;
		this.polyominoes.forEach((polyomino) => {
			let attempts = 0;
			let randomX, randomY, validPosition;
			this.gridBoard.removePolyomino(polyomino);
			polyomino.isPlaced = false;
			do {
				const zone = Math.floor(Math.random() * 4);
				switch (zone) {
					case 0:
						randomX = Math.floor(Math.random() * (gridLeft - margin));
						randomY = Math.floor(Math.random() * (windowHeight - 2 * margin)) + margin;
						break;
					case 1:
						randomX = Math.floor(Math.random() * (windowWidth - gridRight - margin)) + gridRight;
						randomY = Math.floor(Math.random() * (windowHeight - 2 * margin)) + margin;
						break;
					case 2:
						randomX = Math.floor(Math.random() * (windowWidth - 2 * margin)) + margin;
						randomY = Math.floor(Math.random() * (gridTop - margin));
						break;
					case 3:
						randomX = Math.floor(Math.random() * (windowWidth - 2 * margin)) + margin;
						randomY = Math.floor(Math.random() * (windowHeight - gridBottom - margin)) + gridBottom;
						break;
				}
				validPosition = true;
				attempts++;
			} while (!validPosition && attempts < 100);
			polyomino.x = randomX;
			polyomino.y = randomY;
			polyomino.isPlaced = false;
		});
		this.resetRotations();
		this.redraw();
	};

	createMessageBox(type_tiling) {
		const messageBox = document.createElement('div');
		messageBox.id = 'messageBox';
		switch (type_tiling) {
			case 1: messageBox.textContent = 'BACKTRACKING TILING FINISHED'; break;
			case 2: messageBox.textContent = 'BRUTE FORCE TILING FINISHED'; break;
			case 3: messageBox.textContent = 'RANDOM TILING FINISHED'; break;
			case 4: messageBox.textContent = 'RANDOM BACKTRACKING TILING FINISHED'; break;
			default: messageBox.textContent = 'TILING FINISHED';
		}
		Object.assign(messageBox.style, { position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)',
			backgroundColor: 'blue', color: 'white', padding: '10px', borderRadius: '5px', zIndex: '1001' });
		messageBox.style.display = 'none';
		return messageBox;
	};

	showMessageBox(messageBox) {
		document.body.appendChild(messageBox);
		messageBox.style.display = 'block';
		setTimeout(() => { messageBox.style.display = 'none'; }, 2000);
	};

	backtrackingAutoTiling() {
		this.resetBoard();
		const messageBox = this.createMessageBox(1);
		setTimeout(() => {
			backtrackingAutoTiling(
				this.polyominoes, 
				this.gridBoard, 
				this.placePolyomino.bind(this), 
				this.gridBoard.removePolyomino.bind(this), 
				this.redraw.bind(this),
				() => { this.showMessageBox(messageBox); }
			);
		}, 1000);
	};

	bruteForceTiling() {
		this.resetBoard(); 
		const messageBox = this.createMessageBox(2);
		setTimeout(() => {
			bruteForceTiling(
				this.gridBoard, 
				this.polyominoes, 
				this.placePolyomino.bind(this), 
				this.redraw.bind(this),
				() => { this.showMessageBox(messageBox); }
			);
		}, 1000);
	};

	randomTiling() {
		this.resetBoard();
		const messageBox = this.createMessageBox(3);
		setTimeout(() => { randomTiling( this.gridBoard, this.polyominoes, this.placePolyomino.bind(this), this.redraw.bind(this), () => { this.showMessageBox(messageBox); } ); }, 1000);
	};

	randomBacktrackingTiling() {
		this.resetBoard();
		const messageBox = this.createMessageBox(4);
		setTimeout(() => {
			randomBacktrackingTiling(
				this.polyominoes, 
				this.gridBoard, 
				this.placePolyomino.bind(this), 
				this.gridBoard.removePolyomino.bind(this), 
				this.redraw.bind(this),
				() => { this.showMessageBox(messageBox); }
			);
		}, 1000);
	};
};

const main_app = new MainApp();
