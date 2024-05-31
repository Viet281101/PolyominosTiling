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
			{ name: 'Create Polyomino', action: () => this.showPolyominoPopup() }
		];

		this.popupOpen = false;

		this.drawToolbar();
		this.addEventListeners();
	};

	drawToolbar() {
		this.ctx.fillStyle = '#333';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		this.ctx.font = '20px Helvetica';
		this.ctx.fillStyle = '#fff';

		const totalWidth = this.buttons.reduce((acc, button) => acc + this.ctx.measureText(button.name).width + 20, 0);
		let startX = (this.canvas.width - totalWidth) / 2;

		this.buttons.forEach(button => {
			const x = startX;
			const y = 30;
			this.ctx.fillText(button.name, x, y);
			this.ctx.strokeStyle = '#fff';
			this.ctx.strokeRect(x - 5, y - 20, this.ctx.measureText(button.name).width + 10, 30);
			button.x = x - 5;
			button.y = y - 20;
			button.width = this.ctx.measureText(button.name).width + 10;
			button.height = 30;
			startX += button.width + 20;
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
		});

		document.addEventListener('click', (e) => {
			if (this.popupOpen) {
				const popup = document.getElementById('polyominoPopup');
				if (popup && !popup.contains(e.target) && !this.canvas.contains(e.target)) {
					this.closePopup();
				}
			}
		});
	};

	showPolyominoPopup() {
		if (this.popupOpen) return;
		this.popupOpen = true;

		const popupContainer = document.createElement('div');
		popupContainer.id = 'polyominoPopup';
		popupContainer.style.position = 'absolute';
		popupContainer.style.top = '50px';
		popupContainer.style.left = '50%';
		popupContainer.style.transform = 'translateX(-50%)';
		popupContainer.style.width = '360px';
		popupContainer.style.height = '600px';
		popupContainer.style.border = '1px solid #000';
		popupContainer.style.backgroundColor = '#fff';
		popupContainer.style.overflowY = 'auto';
		popupContainer.style.zIndex = '1000';
		document.body.appendChild(popupContainer);

		const popup = document.createElement('canvas');
		const ctx = popup.getContext('2d');
		const width = 360;
		const height = 1000;
		popup.width = width;
		popup.height = height;
		popupContainer.appendChild(popup);

		const closeIcon = new Image();
		closeIcon.src = '../assets/ic_close.png';
		closeIcon.style.position = 'fixed';
		closeIcon.style.top = '54px';
		closeIcon.style.left = 'calc(50% + 168px)';
		closeIcon.style.transform = 'translateX(-50%)';
		closeIcon.style.cursor = 'pointer';
		closeIcon.style.zIndex = '1001';
		closeIcon.addEventListener('click', () => this.closePopup());
		document.body.appendChild(closeIcon);

		const shapes = Object.keys(SHAPES);
		const shapeSize = 30;
		const padding = 60;

		ctx.fillStyle = '#a0a0a0';
		ctx.fillRect(0, 0, width, height);

		shapes.forEach((shape, index) => {
			const y = 40 + index * (shapeSize + padding) + shapeSize / 2;

			ctx.fillStyle = '#d1d1d1';
			ctx.fillRect(10, y - shapeSize / 2, 180, shapeSize + 20);
			ctx.strokeStyle = '#000';
			ctx.strokeRect(10, y - shapeSize / 2, 180, shapeSize + 20);

			ctx.font = '20px Helvetica';
			ctx.fillStyle = '#0000ff';
			ctx.fillText(shape, 15, y + 7);

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
				this.closePopup();
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

	closePopup() {
		const popup = document.getElementById('polyominoPopup');
		if (popup) {
			document.body.removeChild(popup);
		}
		const closeIcon = document.querySelector('img[src="../assets/ic_close.png"]');
		if (closeIcon) {
			document.body.removeChild(closeIcon);
		}
		this.popupOpen = false;
	};
};
