import { Polyomino, SHAPES, getRandomColor } from './polyomino.js';

export class Toolbar {
	constructor(mainApp) {
		this.mainApp = mainApp;
		this.setupCanvas();
		this.buttons = this.createButtons();
		this.popupOpen = false;
		this.currentPopup = null;
		this.currentCloseIcon = null;
		this.drawToolbar();
		this.addEventListeners();
		this.addHomeButton();
	};

	setupCanvas() {
		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d');
		this.canvas.width = window.innerWidth;
		this.canvas.height = 50;
		this.canvas.style.position = 'absolute';
		this.canvas.style.top = this.canvas.style.left = '0';
		document.body.appendChild(this.canvas);
	};

	createButtons() {
		return [
			{ name: 'Create Polyomino', icon: '../assets/ic_plus.png', action: () => this.togglePopup('polyomino') },
			{ name: 'Grid Settings', icon: '../assets/ic_table.png', action: () => this.togglePopup('grid') },
			{ name: 'Solve', icon: '../assets/ic_solving.png', action: () => this.togglePopup('solve') },
			{ name: 'Tutorial', icon: '../assets/ic_question.png', action: () => this.togglePopup('tutorial') }
		];
	};

	drawToolbar() {
		this.ctx.fillStyle = '#333';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		const totalWidth = this.buttons.length * 60;
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
				button.width = button.height = 40;
				startX += 60;
			};
		});
	};

	addEventListeners() {
		this.canvas.addEventListener('mousemove', (e) => { let cursor = 'default'; this.buttons.forEach(button => { if (this.isInside(e.clientX, e.clientY, button)) { cursor = 'pointer'; } }); this.canvas.style.cursor = cursor; });
		this.canvas.addEventListener('mousedown', (e) => this.handleCanvasClick(e));
		this.canvas.addEventListener('touchstart', (e) => this.handleCanvasClick(e));
		document.addEventListener('click', (e) => this.handleDocumentClick(e));
		document.addEventListener('touchstart', (e) => this.handleDocumentClick(e));
	};

	handleCanvasClick(e) {
		const { clientX: mouseX, clientY: mouseY } = e;
		this.buttons.forEach(button => {
			if (this.isInside(mouseX, mouseY, button)) {
				button.action();
			}
		});
		if (mouseX >= 10 && mouseX <= 50 && mouseY >= 10 && mouseY <= 50) { window.location.href = '../index.html';}
	};

	handleDocumentClick(e) {
		if (this.popupOpen) {
			const polyominoPopup = document.getElementById('polyominoPopup');
			const gridPopup = document.getElementById('gridPopup');
			const solvePopup = document.getElementById('solvePopup');
			if (
				(polyominoPopup && !polyominoPopup.contains(e.target) && !this.canvas.contains(e.target)) ||
				(gridPopup && !gridPopup.contains(e.target) && !this.canvas.contains(e.target)) ||
				(solvePopup && !solvePopup.contains(e.target) && !this.canvas.contains(e.target))
			) {
				this.closeCurrentPopup();
			}
		}
	};

	resizeToolbar() { this.canvas.width = window.innerWidth; this.drawToolbar(); this.addHomeButton(); };
	isInside(x, y, rect) { return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height; };
	closeCurrentPopup() { if (this.currentPopup) { this.closePopup(this.currentPopup); } };

	addHomeButton() {
		const img = new Image();
		img.src = '../assets/ic_home.png';
		img.onload = () => {
			this.ctx.drawImage(img, 10, 10, 30, 30);
			this.ctx.strokeStyle = '#fff';
			this.ctx.strokeRect(5, 5, 40, 40);
		};
	};

	togglePopup(type) {
		if (this.currentPopup === type) {
			this.closePopup(type);
		} else {
			this.closeCurrentPopup();
			this.showPopup(type);
			this.currentPopup = type;
		}
	};

	showPopup(type) {
		this.popupOpen = true;
		switch (type) {
			case 'polyomino': this.showPolyominoPopup(); break;
			case 'grid': this.showGridPopup(); break;
			case 'solve': this.showSolvePopup(); break;
			case 'tutorial': this.showTutorialPopup(); break;
		}
	};

	showPolyominoPopup() {
		const popupContainer = this.createPopupContainer('polyominoPopup', this.buttons[0].name);

		const shapes = Object.keys(SHAPES);
		const shapeSize = 30;
		const padding = 80;

		const popup = popupContainer.querySelector('canvas');
		const ctx = popup.getContext('2d');
		const width = popup.width;
		const height = popup.height;

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

			this.attachPopupClickEvent(popup, polyomino, shape, shapeSize, y);
		});
	};

	showGridPopup() {
		const popupContainer = this.createPopupContainer('gridPopup', this.buttons[1].name);
		const popup = popupContainer.querySelector('canvas');
		const ctx = popup.getContext('2d');

		ctx.fillStyle = '#a0a0a0';
		ctx.fillRect(0, 0, popup.width, popup.height);

		const rows = [
			{ label: 'Create new grid board here', box: true, title: true },
			{ label: 'Enter n° rows', type: 'input' },
			{ label: 'Enter n° columns', type: 'input' },
			{ label: 'Draw grid by click to 👉', icon: '../assets/ic_draw.png' },
			{ label: 'Delete current grid :', icon: '../assets/ic_trash.png' },
			{ label: 'Blacken the cells :', icon: '../assets/ic_blackend_cell.png' }
		];

		const startY = 72;
		const rowHeight = 72;
		const colX = 30;

		rows.forEach((row, index) => {
			const y = startY + index * rowHeight;
			if (row.box) {
				ctx.strokeStyle = '#fff';
				ctx.strokeRect(10, (y - 30), (popup.width - 20), (rowHeight * (row.title ? 4 : 1)) );
			}
			ctx.font = '22px Pixellari';
			ctx.fillStyle = '#000';
			ctx.fillText(row.label, colX, y + 20);

			if (row.icon) {
				const icon = new Image();
				icon.src = row.icon;
				icon.onload = () => { ctx.drawImage(icon, popup.width - 94, y - 14, 50, 50); };
			} else if (row.type === 'input') {
				this.createInputField(popupContainer, y);
			}
		});
	};

	showSolvePopup() {
		const popupContainer = this.createPopupContainer('solvePopup', this.buttons[2].name);
		const popup = popupContainer.querySelector('canvas');
		const ctx = popup.getContext('2d');

		ctx.fillStyle = '#a0a0a0';
		ctx.fillRect(0, 0, popup.width, popup.height);

		const rows = [
			{ label: 'Auto tiling the Polyominoes blocks', box: true, title: true },
			{ label: '1) Backtracking method :', icon: '../assets/ic_solution.png' }
		];

		const startY = 60;
		const rowHeight = 60;
		const colX = 30;

		rows.forEach((row, index) => {
			const y = startY + index * rowHeight;
			ctx.font = '20px Pixellari';
			ctx.fillStyle = '#15159f';
			ctx.fillText(row.label, colX, y + 20);

			if (row.icon) {
				const icon = new Image();
				icon.src = row.icon;
				icon.onload = () => { ctx.drawImage(icon, popup.width - 94, y - 14, 50, 50); };
				this.attachSolveClickEvent(popup, row, y);
			}
		});
	};

	attachSolveClickEvent(popup, row, y) {
		popup.addEventListener('click', (e) => {
			const rect = popup.getBoundingClientRect();
			const mouseX = e.clientX - rect.left;
			const mouseY = e.clientY - rect.top;

			if (this.isInside(mouseX, mouseY, { x: popup.width - 94, y: y - 14, width: 50, height: 50 })) {
				switch (row.label) {
					case 'Backtracking method':
						this.mainApp.backtrackingAutoTiling();
						break;
				}
			}
		});
	};

	showTutorialPopup() {
		const popupContainer = this.createPopupContainer('tutorialPopup', this.buttons[3].name);
		const popup = popupContainer.querySelector('canvas');
		const ctx = popup.getContext('2d');

		ctx.fillStyle = '#a0a0a0';
		ctx.fillRect(0, 0, popup.width, popup.height);
	};

	createPopupContainer(id, title) {
		const popupContainer = document.createElement('div');
		popupContainer.id = id;
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
		popup.width = 370;
		popup.height = 6000;
		popupContainer.appendChild(popup);

		const titleElement = document.createElement('h3');
		titleElement.style.position = 'absolute';
		titleElement.style.top = '-12px';
		titleElement.style.left = '50%';
		titleElement.style.transform = 'translateX(-50%)';
		titleElement.style.zIndex = '1001';
		titleElement.style.fontSize = '20px';
		titleElement.style.color = '#00ffaa';
		titleElement.textContent = title;
		popupContainer.appendChild(titleElement);

		this.addCloseIcon();
		this.currentPopup = popupContainer;
		return popupContainer;
	};

	addCloseIcon() {
		if (this.currentCloseIcon) { document.body.removeChild(this.currentCloseIcon); }
		const closeIcon = new Image();
		closeIcon.src = '../assets/ic_close.png';
		closeIcon.style.position = 'fixed';
		closeIcon.style.top = '56px';
		closeIcon.style.left = 'calc(50% + 162px)';
		closeIcon.style.transform = 'translateX(-50%)';
		closeIcon.style.cursor = 'pointer';
		closeIcon.style.zIndex = '1001';
		closeIcon.addEventListener('click', () => this.closeCurrentPopup());
		document.body.appendChild(closeIcon);
		this.currentCloseIcon = closeIcon;
	};

	attachPopupClickEvent(popup, polyomino, shape, shapeSize, y) {
		popup.addEventListener('click', (e) => {
			const rect = popup.getBoundingClientRect();
			const mouseX = e.clientX - rect.left;
			const mouseY = e.clientY - rect.top;

			const onMouseDown = (mousePos) => {
				const newPolyomino = new Polyomino(SHAPES[shape].map(row => [...row]), mousePos.x, mousePos.y, getRandomColor(), this.mainApp);
				this.mainApp.polyominoes.push(newPolyomino);
				this.mainApp.redraw();
				this.closePopup('polyomino');
			};
			if (this.isInside(mouseX, mouseY, polyomino) || this.isInside(mouseX, mouseY, { x: 10, y: y - shapeSize / 2, width: 180, height: shapeSize + 20 })) { onMouseDown({ x: mouseX, y: mouseY }); }
		});
	};

	createInputField(popupContainer, y) {
		const input = document.createElement('input');
		input.type = 'number';
		input.style.position = 'absolute';
		input.style.left = 'calc(100% - 120px)';
		input.style.top = `${y}px`;
		input.style.width = '80px';
		input.style.height = '24px';
		input.style.border = '1px solid #000';
		input.style.backgroundColor = '#fff';
		input.style.fontSize = '16px';
		input.style.fontFamily = 'Pixellari';
		input.style.color = '#000';
		input.style.zIndex = '1001';
		input.classList.add('popup-input');
		popupContainer.appendChild(input);
	};

	closePopup(type) {
		const popup = document.getElementById(`${type}Popup`);
		if (popup) { document.body.removeChild(popup); }
		if (this.currentCloseIcon) {
			document.body.removeChild(this.currentCloseIcon);
			this.currentCloseIcon = null;
		}
		const inputs = document.querySelectorAll('.popup-input');
		inputs.forEach(input => input.parentElement.removeChild(input));
		this.popupOpen = false;
		this.currentPopup = null;
	};
};
