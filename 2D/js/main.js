import { GridBoard } from './board.js';
import { Polyomino, getRandomColor } from './polyomino.js';
import { GUIController } from './gui.js';
import { Toolbar } from './toolbar.js';
import { backtrackingAutoTiling, bruteForceTiling, randomTiling, randomBacktrackingTiling } from './ai.js';

class MainApp {
	constructor() {
		this.canvas = document.getElementById('myCanvas');
		this.gridSize = 30;
		this.rows = 10;
		this.cols = 10;
		this.polyominoes = [];
		this.selectedPolyomino = null;
		this.icons = this.loadIcons();
		this.gridBoard = new GridBoard(this.canvas, this.gridSize, this.rows, this.cols);
		this.guiController = new GUIController(this);
		this.toolbar = new Toolbar(this);
		this.isBlackening = false;
		this.blackenedCells = new Set();
		this.tooltipPolyominoBlocks();
		this.init();
	};

	loadIcons() {
		const icons = {
			flip: new Image(),
			rotateLeft: new Image(),
			rotateRight: new Image(),
			duplicate: new Image(),
			trash: new Image()
		};
		const as = "../assets/";
		icons.flip.src = `${as}ic_flip.png`;
		icons.rotateLeft.src = `${as}ic_rotate_left.png`;
		icons.rotateRight.src = `${as}ic_rotate_right.png`;
		icons.duplicate.src = `${as}ic_duplicate.png`;
		icons.trash.src = `${as}ic_trash.png`;
		return icons;
	};

	init() {
		Object.assign(document.body.style, { margin: '0', padding: '0', overflow: 'hidden' });
		this.canvas.style.backgroundColor = '#c3c3c3';
		this.addEventListeners();
	};

	tooltipPolyominoBlocks() {
		this.tooltipPolyomino = false;
		this.tooltip = document.createElement('div');
		Object.assign(this.tooltip.style, {
			position: 'absolute', backgroundColor: '#fff', border: '1px solid #000',
			padding: '5px', display: 'none'
		});
		document.body.appendChild(this.tooltip);
	};

	drawPolyominoes() {
		this.polyominoes.forEach(polyomino => polyomino.draw(this.gridBoard.ctx, this.gridSize, this.selectedPolyomino === polyomino));
	};

	addEventListeners() {
		const events = [
			{ event: 'mousedown', handler: this.handleMouseDown.bind(this) },
			{ event: 'mousemove', handler: this.handleMouseMove.bind(this) },
			{ event: 'mouseup', handler: this.handleMouseUp.bind(this) },
			{ event: 'touchstart', handler: this.handleTouchStart.bind(this), options: { passive: false } },
			{ event: 'touchmove', handler: this.handleTouchMove.bind(this), options: { passive: false } },
			{ event: 'touchend', handler: this.handleTouchEnd.bind(this), options: { passive: false } }
		];

		events.forEach(({ event, handler, options }) => this.canvas.addEventListener(event, handler, options));
		window.addEventListener('keydown', this.handleKeyDown.bind(this));
		window.addEventListener('resize', this.handleResize.bind(this));
	};

	handleMouseDown(event) {
		const mousePos = this.gridBoard.getMousePos(event);
		this.handlePointerDown(mousePos);
	};

	handleMouseMove(event) {
		const mousePos = this.gridBoard.getMousePos(event);
		this.handlePointerMove(mousePos);
	};

	handleMouseUp() {
		this.handlePointerUp();
	};

	handleTouchStart(event) {
		event.preventDefault();
		const touchPos = this.gridBoard.getTouchPos(event);
		this.handlePointerDown(touchPos);
	};

	handleTouchMove(event) {
		event.preventDefault();
		const touchPos = this.gridBoard.getTouchPos(event);
		this.handlePointerMove(touchPos);
	};

	handleTouchEnd(event) {
		event.preventDefault();
		this.handlePointerUp();
	};

	handleKeyDown(event) {
		if (event.key === 'r' && this.selectedPolyomino) {
			this.selectedPolyomino.rotate();
			this.redraw();
		}
	};

	handleResize() {
		this.gridBoard.resizeCanvas();
		this.gridBoard.drawGrid();
		this.guiController.checkWindowSize();
		this.toolbar.resizeToolbar();
	};

	handlePointerDown(pointerPos) {
		if (this.isBlackening) {
			const col = Math.floor((pointerPos.x - this.gridBoard.gridOffsetX) / this.gridSize);
			const row = Math.floor((pointerPos.y - this.gridBoard.gridOffsetY) / this.gridSize);
			this.toggleBlackenedCell(row, col);
		} else { this.selectPolyomino(pointerPos); }
		this.tooltip.style.display = 'none';
		this.redraw();
	};

	handlePointerMove(pointerPos) {
		this.updateCursor(pointerPos);
		this.polyominoes.forEach(polyomino => polyomino.onMouseMove(pointerPos));
		this.updateTooltip(pointerPos);
		this.redraw();
	};

	handlePointerUp() {
		this.polyominoes.forEach(polyomino => polyomino.onMouseUp());
		this.redraw();
	};

	toggleBlackenedCell(row, col) {
		if (col >= 0 && col < this.cols && row >= 0 && row < this.rows) {
			const cellKey = `${row}-${col}`;
			if (this.blackenedCells.has(cellKey)) {
				this.blackenedCells.delete(cellKey);
				this.gridBoard.grid[row][col] = null;
			} else {
				this.blackenedCells.add(cellKey);
				this.gridBoard.grid[row][col] = '#000000';
			}
		} else {
			this.isBlackening = false;
			this.canvas.style.cursor = 'default';
		}
		this.redraw();
	};

	selectPolyomino(pointerPos) {
		let clickedOnIcon = this.selectedPolyomino?.checkIconsClick(pointerPos) || false;
		if (!clickedOnIcon) {
			this.selectedPolyomino = null;
			for (let i = this.polyominoes.length - 1; i >= 0; i--) {
				const polyomino = this.polyominoes[i];
				if (polyomino.contains(pointerPos.x, pointerPos.y, this.gridSize)) {
					if (polyomino.isPlaced) {
						this.gridBoard.removePolyomino(polyomino);
						polyomino.isPlaced = false;
					}
					polyomino.onMouseDown(pointerPos);
					this.selectedPolyomino = polyomino;
					this.guiController.settings.selectedColor = polyomino.color;
					break;
				}
			}
		}
	};

	updateCursor(pointerPos) {
		this.canvas.style.cursor = this.isBlackening ? 'url("../assets/cursor_blackend.png"), auto' : 'default';
	};

	updateTooltip(pointerPos) {
		if (this.tooltipPolyomino && !this.selectedPolyomino?.isDragging) {
			let found = false;
			for (let i = this.polyominoes.length - 1; i >= 0; i--) {
				const polyomino = this.polyominoes[i];
				if (polyomino.contains(pointerPos.x, pointerPos.y, this.gridSize)) {
					this.tooltip.innerHTML = `${polyomino.name} (#${i + 1})`;
					Object.assign(this.tooltip.style, {
						left: `${pointerPos.x + 10}px`, top: `${pointerPos.y + 10}px`, display: 'block'
					});
					found = true;
					break;
				}
			}
			if (!found) { this.tooltip.style.display = 'none'; }
		} else { this.tooltip.style.display = 'none'; }
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
		do {
			newColor = getRandomColor();
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

	resetBoard() {
		this.polyominoes.forEach(polyomino => {
			if (polyomino.isPlaced) {
				this.gridBoard.removePolyomino(polyomino);
				polyomino.isPlaced = false;
				polyomino.resetPosition();
			}
		});
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

		this.gridBoard.clearGrid();

		this.polyominoes.forEach(polyomino => {
			let attempts = 0;
			let randomX, randomY, validPosition;
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
		this.redraw();
	};

	createMessageBox(type_tiling) {
		const messages = [
			'TILING FINISHED',
			'BACKTRACKING TILING FINISHED',
			'BRUTE FORCE TILING FINISHED',
			'RANDOM TILING FINISHED',
			'RANDOM BACKTRACKING TILING FINISHED'
		];
		const messageBox = document.createElement('div');
		messageBox.id = 'messageBox';
		messageBox.textContent = messages[type_tiling] || messages[0];
		Object.assign(messageBox.style, {
			display: 'none', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
			backgroundColor: 'red', color: 'white', padding: '10px', borderRadius: '5px'
		});
		return messageBox;
	};

	showMessageBox(messageBox) {
		document.body.appendChild(messageBox);
		messageBox.style.display = 'block';

		setTimeout(() => {
			messageBox.style.display = 'none';
		}, 2000);
	};

	runTiling(tilingFunction, type_tiling) {
		this.resetBoard();
		const messageBox = this.createMessageBox(type_tiling);

		setTimeout(() => {
			tilingFunction(
				this.gridBoard, this.polyominoes, this.placePolyomino.bind(this), this.redraw.bind(this), () => {
					this.showMessageBox(messageBox);
				}
			);
		}, 1000);
	};

	backtrackingAutoTiling() {
		this.runTiling(backtrackingAutoTiling, 1);
	};

	bruteForceTiling() {
		this.runTiling(bruteForceTiling, 2);
	};

	randomTiling() {
		this.runTiling(randomTiling, 3);
	};

	randomBacktrackingTiling() {
		this.runTiling(randomBacktrackingTiling, 4);
	};
};

const main_app = new MainApp();
