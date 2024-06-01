import { Polyomino, SHAPES, getRandomColor } from './polyomino.js';

export class Toolbar {
	constructor(mainApp) {
		this.mainApp = mainApp;
		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d');
		this.canvas.width = window.innerWidth;
		this.canvas.height = 50;
		this.canvas.style.position = 'absolute';
		this.canvas.style.top = '0';
		this.canvas.style.left = '0';
		document.body.appendChild(this.canvas);

		this.buttons = [
			{ name: 'Create Polyomino', icon: '../assets/ic_plus.png', action: () => this.togglePolyominoPopup() },
			{ name: 'Draw Grid', icon: '../assets/ic_table.png', action: () => this.toggleGridPopup() },
			{ name: 'Solve', icon: '../assets/ic_solving.png', action: () => this.solvingPuzzle() }
		];

		this.popupOpen = false;
		this.currentPopup = null;
		this.gridPopupCanvas = null;
		this.drawToolbar();
		this.addEventListeners();
		this.addHomeButton();
	};

	drawToolbar() {
		this.ctx.fillStyle = '#333';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		const totalWidth = this.buttons.reduce((acc, button) => acc + 40 + 20, 0);
		let startX = (this.canvas.width - totalWidth) / 2;

		this.buttons.forEach(button => {
			const img = new Image();
			img.src = button.icon;
			img.onload = () => {
				this.ctx.drawImage(img, startX, 10, 30, 30);
				this.ctx.strokeStyle = '#fff';
				this.ctx.strokeRect(startX - 5, 5, 40, 40);
				button.x = startX - 5;
				button.y = 5;
				button.width = 40;
				button.height = 40;
				startX += button.width + 20;
			};
		});
	};

	addEventListeners() {
		this.canvas.addEventListener('click', (e) => {
			const rect = this.canvas.getBoundingClientRect();
			const mouseX = e.clientX - rect.left;
			const mouseY = e.clientY - rect.top;

			this.buttons.forEach(button => {
				if (mouseX >= button.x && mouseX <= button.x + button.width &&
					mouseY >= button.y && mouseY <= button.y + button.height) {
					button.action();
				}
			});

			if (mouseX >= 10 && mouseX <= 50 && mouseY >= 10 && mouseY <= 50) {
				window.location.href = '../index.html';
			}
		});
		document.addEventListener('click', (e) => {
			if (this.popupOpen) {
				if (this.gridPopupCanvas && !this.gridPopupCanvas.contains(e.target) && !this.canvas.contains(e.target)) {
					this.closeGridPopup();
				}
				const pPopup = document.getElementById('polyominoPopup');
				if (pPopup && !pPopup.contains(e.target) && !this.canvas.contains(e.target)) {
					this.closePolyominoPopup();
				}
			}
		});
	};

	addHomeButton() {
		const img = new Image();
		img.src = '../assets/ic_home.png';
		img.onload = () => {
			this.ctx.drawImage(img, 10, 10, 30, 30);
			this.ctx.strokeStyle = '#fff';
			this.ctx.strokeRect(5, 5, 40, 40);
		};
	};

	togglePolyominoPopup() {
		if (this.currentPopup === 'polyomino') {
			this.closePolyominoPopup();
		} else {
			this.closeCurrentPopup();
			this.showPolyominoPopup();
			this.currentPopup = 'polyomino';
		}
	};

	toggleGridPopup() {
		if (this.currentPopup === 'grid') {
			this.closeGridPopup();
		} else {
			this.closeCurrentPopup();
			this.showGridPopup();
			this.currentPopup = 'grid';
		}
	};

	closeCurrentPopup() {
		if (this.currentPopup === 'polyomino') {
			this.closePolyominoPopup();
		} else if (this.currentPopup === 'grid') {
			this.closeGridPopup();
		}
	}

	showPolyominoPopup() {
		this.popupOpen = true;

		const popupContainer = document.createElement('div');
		popupContainer.id = 'polyominoPopup';
		popupContainer.style.position = 'absolute';
		popupContainer.style.top = '50px';
		popupContainer.style.left = '50%';
		popupContainer.style.transform = 'translateX(-50%)';
		popupContainer.style.width = '370px';
		popupContainer.style.height = '600px';
		popupContainer.style.border = '3px solid #000';
		popupContainer.style.backgroundColor = '#fff';
		popupContainer.style.overflowY = 'auto';
		popupContainer.style.zIndex = '1000';
		document.body.appendChild(popupContainer);

		const popup = document.createElement('canvas');
		const ctx = popup.getContext('2d');
		const width = 370;
		const height = 6000;
		popup.width = width;
		popup.height = height;
		popupContainer.appendChild(popup);

		const closeIcon = new Image();
		closeIcon.src = '../assets/ic_close.png';
		closeIcon.style.position = 'fixed';
		closeIcon.style.top = '54px';
		closeIcon.style.left = 'calc(50% + 162px)';
		closeIcon.style.transform = 'translateX(-50%)';
		closeIcon.style.cursor = 'pointer';
		closeIcon.style.zIndex = '1001';
		closeIcon.addEventListener('click', () => this.closePolyominoPopup());
		document.body.appendChild(closeIcon);

		const shapes = Object.keys(SHAPES);
		const shapeSize = 30;
		const padding = 80;

		ctx.fillStyle = '#a0a0a0';
		ctx.fillRect(0, 0, width, height);

		shapes.forEach((shape, index) => {
			const y = 40 + index * (shapeSize + padding) + shapeSize / 2;

			ctx.fillStyle = '#d1d1d1';
			ctx.fillRect(10, y - shapeSize / 2, 180, shapeSize + 20);
			ctx.strokeStyle = '#000';
			ctx.strokeRect(10, y - shapeSize / 2, 180, shapeSize + 20);

			ctx.font = '20px Pixellari';
			ctx.fillStyle = '#0000ff';
			ctx.fillText(shape.replace(/_/g, ' '), 15, y + 7);

			const polyomino = new Polyomino(SHAPES[shape].map(row => [...row]), 200, y - shapeSize / 2, getRandomColor(), this.mainApp);
			polyomino.draw(ctx, shapeSize, false);

			polyomino.x = 200;
			polyomino.y = y - shapeSize / 2;
			polyomino.width = shapeSize * polyomino.shape[0].length;
			polyomino.height = shapeSize * polyomino.shape.length;

			const onMouseDown = (mousePos) => {
				const newPolyomino = new Polyomino(SHAPES[shape].map(row => [...row]), mousePos.x, mousePos.y, getRandomColor(), this.mainApp);
				this.mainApp.polyominoes.push(newPolyomino);
				this.mainApp.redraw();
				this.closePolyominoPopup();
			};

			popup.addEventListener('click', (e) => {
				const rect = popup.getBoundingClientRect();
				const mouseX = e.clientX - rect.left;
				const mouseY = e.clientY - rect.top;

				if (mouseX >= polyomino.x && mouseX <= polyomino.x + polyomino.width &&
					mouseY >= polyomino.y && mouseY <= polyomino.y + polyomino.height) {
					onMouseDown({ x: mouseX, y: mouseY });
				}

				if (mouseX >= 10 && mouseX <= 190 && mouseY >= y - shapeSize / 2 && mouseY <= y + shapeSize / 2 + 10) {
					onMouseDown({ x: 250, y: y });
				}
			});
		});
	};

	showGridPopup() {
		this.popupOpen = true;

		this.gridPopupCanvas = document.createElement('canvas');
		this.gridPopupCanvas.width = 370;
		this.gridPopupCanvas.height = 600;
		this.gridPopupCanvas.style.position = 'absolute';
		this.gridPopupCanvas.style.top = '50px';
		this.gridPopupCanvas.style.left = '50%';
		this.gridPopupCanvas.style.transform = 'translateX(-50%)';
		this.gridPopupCanvas.style.border = '3px solid #000';
		this.gridPopupCanvas.style.zIndex = '1000';
		document.body.appendChild(this.gridPopupCanvas);

		const ctx = this.gridPopupCanvas.getContext('2d');
		ctx.fillStyle = '#a0a0a0';
		ctx.fillRect(0, 0, this.gridPopupCanvas.width, this.gridPopupCanvas.height);

		const closeIcon = new Image();
		closeIcon.src = '../assets/ic_close.png';
		closeIcon.onload = () => {
			ctx.drawImage(closeIcon, this.gridPopupCanvas.width - 38, 1, 32, 32);
		};

		this.gridPopupCanvas.addEventListener('click', (e) => {
			const rect = this.gridPopupCanvas.getBoundingClientRect();
			const mouseX = e.clientX - rect.left;
			const mouseY = e.clientY - rect.top;

			if (mouseX >= this.gridPopupCanvas.width - 40 && mouseX <= this.gridPopupCanvas.width - 10 &&
				mouseY >= 10 && mouseY <= 40) {
				this.closeGridPopup();
			}
		});
	};

	closePolyominoPopup() {
		const popup = document.getElementById('polyominoPopup');
		if (popup) {
			document.body.removeChild(popup);
		}
		const closeIcon = document.querySelector('img[src="../assets/ic_close.png"]');
		if (closeIcon) {
			document.body.removeChild(closeIcon);
		}
		this.popupOpen = false;
		this.currentPopup = null;
	};

	closeGridPopup() {
		if (this.gridPopupCanvas) {
			document.body.removeChild(this.gridPopupCanvas);
			this.gridPopupCanvas = null;
		}
		this.popupOpen = false;
		this.currentPopup = null;
	};

	resizeToolbar() {
		this.canvas.width = window.innerWidth;
		this.drawToolbar();
		this.addHomeButton();
	};
};
