import { showPolyominoPopup } from './popup/polyomino.js';
import { showGridPopup } from './popup/grid.js';
import { showSolvePopup } from './popup/solve.js';
import { showTutorialPopup } from './popup/tutorial.js';
import { showSettingsPopup } from './popup/setting.js';

export class Toolbar {
	constructor(mainApp) {
		this.mainApp = mainApp;
		this.isMobile = this.checkIfMobile();
		this.setupCanvas();
		this.buttons = this.createButtons();
		this.popupOpen = false;
		this.currentPopup = null;
		this.currentCloseIcon = null;
		this.drawToolbar();
		this.addEventListeners();
		this.addHomeButton();
		this.homeButtonRect = this.isMobile ? { x: 10, y: 10, width: 40, height: 40 } : { x: 10, y: 10, width: 40, height: 40 };
	};

	checkIfMobile() {
		return window.innerWidth <= 800;
	};

	setupCanvas() {
		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d');
		if (this.isMobile) {
			this.canvas.width = window.innerWidth;
			this.canvas.height = 50;
			this.canvas.style.position = 'absolute';
			this.canvas.style.top = this.canvas.style.left = '0';
		} else {
			this.canvas.width = 50;
			this.canvas.height = window.innerHeight;
			this.canvas.style.position = 'absolute';
			this.canvas.style.left = '0';
			this.canvas.style.top = '0';
		}
		document.body.appendChild(this.canvas);
	};

	createButtons() {
		return [
			{ name: 'Create Polyomino', icon: '../assets/ic_plus.png', action: () => this.togglePopup('polyomino') },
			{ name: 'Grid Settings', icon: '../assets/ic_table.png', action: () => this.togglePopup('grid') },
			{ name: 'Solving Polyomino', icon: '../assets/ic_solving.png', action: () => this.togglePopup('solve') },
			{ name: 'Tutorial', icon: '../assets/ic_question.png', action: () => this.togglePopup('tutorial') },
			{ name: 'Settings', icon: '../assets/ic_setting.png', action: () => this.togglePopup('settings') },
		];
	};

	drawToolbar() {
		this.ctx.fillStyle = '#333';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		if (this.isMobile) {
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
		} else {
			const totalHeight = this.buttons.length * 60;
			let startY = (this.canvas.height - totalHeight) / 2;

			this.buttons.forEach(button => {
				const img = new Image();
				img.src = button.icon;
				img.onload = () => {
					this.ctx.drawImage(img, 10, startY, 30, 30);
					this.ctx.strokeStyle = '#fff';
					this.ctx.strokeRect(5, startY - 5, 40, 40);
					button.x = 5;
					button.y = startY - 5;
					button.width = button.height = 40;
					startY += 60;
				};
			});
		}
	};

	addEventListeners() {
		this.canvas.addEventListener('mousemove', (e) => {
			let cursor = 'default';
			this.buttons.forEach(button => {
				if (this.isInside(e.clientX, e.clientY, button)) {
					cursor = 'pointer';
				}
			});
			if (this.isInside(e.clientX, e.clientY, this.homeButtonRect)) {
				cursor = 'pointer';
			}
			this.canvas.style.cursor = cursor;
		});
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
		if (this.isInside(mouseX, mouseY, this.homeButtonRect)) {
			window.location.href = '../index.html';
		}
	};

	handleDocumentClick(e) {
		if (this.popupOpen) {
			const polyominoPopup = document.getElementById('polyominoPopup');
			const gridPopup = document.getElementById('gridPopup');
			const solvePopup = document.getElementById('solvePopup');
			const tutorialPopup = document.getElementById('tutorialPopup');
			const settingsPopup = document.getElementById('settingsPopup');
			if (
				(polyominoPopup && !polyominoPopup.contains(e.target) && !this.canvas.contains(e.target)) ||
				(gridPopup && !gridPopup.contains(e.target) && !this.canvas.contains(e.target)) ||
				(solvePopup && !solvePopup.contains(e.target) && !this.canvas.contains(e.target)) ||
				(tutorialPopup && !tutorialPopup.contains(e.target) && !this.canvas.contains(e.target)) ||
				(settingsPopup && !settingsPopup.contains(e.target) && !this.canvas.contains(e.target))
			) {
				this.closeCurrentPopup();
			}
		}
	};

	resizeToolbar() {
		if (this.isMobile) {
			this.canvas.width = window.innerWidth;
			this.canvas.height = 50;
		} else {
			this.canvas.width = 50;
			this.canvas.height = window.innerHeight;
		}
		this.drawToolbar();
		this.addHomeButton();
	};

	isInside(x, y, rect) {
		return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
	};

	closeCurrentPopup() {
		if (this.currentPopup) {
			this.closePopup(this.currentPopup);
		}
	};

	addHomeButton() {
		const img = new Image();
		img.src = '../assets/ic_home.png';
		img.onload = () => {
			if (this.isMobile) {
				this.ctx.drawImage(img, 10, 10, 30, 30);
				this.ctx.strokeStyle = '#fff';
				this.ctx.strokeRect(5, 5, 40, 40);
			} else {
				this.ctx.drawImage(img, 10, 10, 30, 30);
				this.ctx.strokeStyle = '#fff';
				this.ctx.strokeRect(5, 5, 40, 40);
			}
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
			case 'polyomino': showPolyominoPopup(this); break;
			case 'grid': showGridPopup(this); break;
			case 'solve': showSolvePopup(this); break;
			case 'tutorial': showTutorialPopup(this); break;
			case 'settings': showSettingsPopup(this); break;
		}
	};

	createPopupContainer(id, title) {
		const popupContainer = document.createElement('div');
		popupContainer.id = id;
		popupContainer.style.position = 'absolute';
		popupContainer.style.top = this.checkIfMobile() ? '50px' : '160px';
		popupContainer.style.left = this.checkIfMobile() ? '50%' : '238px';
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
		closeIcon.style.top = this.checkIfMobile() ? '56px' : '166px';
		closeIcon.style.left = this.checkIfMobile() ? 'calc(50% + 162px)' : '400px';
		closeIcon.style.transform = 'translateX(-50%)';
		closeIcon.style.cursor = 'pointer';
		closeIcon.style.zIndex = '1001';
		closeIcon.addEventListener('click', () => this.closeCurrentPopup());
		document.body.appendChild(closeIcon);
		this.currentCloseIcon = closeIcon;
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
