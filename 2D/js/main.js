import { GridBoard } from './board.js';
import { Polyomino, getRandomColor } from './polyomino.js';
import { GUIController } from './gui.js';
import { Toolbar } from './toolbar.js';

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
		this.init();
	};

	init() {
		document.body.style.backgroundColor = '#c3c3c3';
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
			if (e.key === 'r' && this.selectedPolyomino) {
				this.selectedPolyomino.rotate();
				this.redraw();
			}
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
			if (!selected) {
				this.selectedPolyomino = null;
			}
		}
		this.redraw();
	};

	handleMouseMove(mousePos) {
		this.polyominoes.forEach(polyomino => polyomino.onMouseMove(mousePos));
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

	//IA POUR TILING 
    autoTiling() {
        const polyominoes = [...this.polyominoes]; // Clone des polyominos pour ne pas les modifier
        polyominoes.sort((a, b) => b.shape.flat().reduce((acc, val) => acc + val) - a.shape.flat().reduce((acc, val) => acc + val)); // trie par taille
        if (this.tryPlacePolyominoes(0, polyominoes)) {
            console.log("Pavage Reussi!");
        } else {
            console.log("Pavage Echouer!");
        }
    };

    tryPlacePolyominoes(index, polyominoes) {
        if (index >= polyominoes.length) {
            return true; // Tous les polyominos sont place
        }

        const polyomino = polyominoes[index];

        for (let row = 0; row < this.gridBoard.rows; row++) {
            for (let col = 0; col < this.gridBoard.cols; col++) {
                const originalX = polyomino.x;
                const originalY = polyomino.y;
                polyomino.x = col * this.gridSize + this.gridBoard.gridOffsetX;
                polyomino.y = row * this.gridSize + this.gridBoard.gridOffsetY;

                if (this.gridBoard.isInBounds(polyomino) && !this.gridBoard.isOverlapping(polyomino)) {
                    this.placePolyomino(polyomino);
                    if (this.tryPlacePolyominoes(index + 1, polyominoes)) {
                        return true;
                    }
                    this.gridBoard.removePolyomino(polyomino);
                }

                polyomino.x = originalX;
                polyomino.y = originalY;
            }
        }

		return false;
	};
};

const main_app = new MainApp();
window.onload = () => {
    const iaButton = document.createElement('button');
    iaButton.innerText = 'IA';
    iaButton.id = 'ia-button';
    iaButton.style.position = 'fixed';
    iaButton.style.bottom = '10px';
    iaButton.style.right = '10px';
    iaButton.style.padding = '10px 20px';
    iaButton.style.fontSize = '16px';
    iaButton.style.backgroundColor = 'blue';
    iaButton.style.color = 'white';
    iaButton.style.border = 'none';
    iaButton.style.borderRadius = '5px';
    iaButton.addEventListener('click', () => main_app.autoTiling());
    document.body.appendChild(iaButton);
};
