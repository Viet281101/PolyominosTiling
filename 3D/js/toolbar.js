import { createCubePopup } from './popup/cube.js';
import { showGridPopup } from './popup/grid.js';
import { showSolvePopup } from './popup/solve.js';
import { showTutorialPopup } from './popup/tutorial.js';

export class Toolbar {
	constructor(mainApp) {
		this.mainApp = mainApp;
		this.isMobile = this.checkIfMobile();
		this.setupCanvas();
		this.buttons = this.createButtons();
		this.popupOpen = false;
		this.currentPopup = null;
		this.currentCloseIcon = null;
		this.createTooltip();
		this.drawToolbar();
		this.addEventListeners();
		this.addHomeButton();
		this.homeButtonRect = this.isMobile ? { x: 10, y: 10, width: 40, height: 40 } : { x: 10, y: 10, width: 40, height: 40 };
		this.is3DPopupOpen = false;
	};

	checkIfMobile() { return window.innerWidth <= 800; };
	setupCanvas() {
		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d');
		this.canvas.width = this.isMobile ? window.innerWidth : 50;
		this.canvas.height = this.isMobile ? 50 : window.innerHeight;
		this.canvas.style.position = 'absolute';
		this.canvas.style.left = this.canvas.style.top = '0';
		this.canvas.style.zIndex = '999';
		document.body.appendChild(this.canvas);
	};

	createButtons() {
		return [
			{ name: 'Create Polycube', icon: '../assets/ic_plus.png', action: () => this.togglePopup('cube'), description: 'To create a new cube and add it to the scene.' },
			{ name: 'Grid Settings', icon: '../assets/ic_table.png', action: () => this.togglePopup('grid'), description: 'To change the grid settings.' },
			{ name: 'Solving Polycube', icon: '../assets/ic_solving.png', action: () => this.togglePopup('solve'), description: 'To solve the polycube puzzle.\nUse different algorithms to solve.' },
			{ name: 'Tutorial', icon: '../assets/ic_question.png', action: () => this.togglePopup('tutorial'), description: 'To view the tutorial.\nLearn how to use the application.' },
		];
	};

	createTooltip() {
		this.tooltipToolbar = this.isMobile ? false : true;
		this.tooltip = document.createElement('div');
		this.tooltip.style.position = 'absolute';
		this.tooltip.style.backgroundColor = '#fff';
		this.tooltip.style.border = '1px solid #000';
		this.tooltip.style.padding = '5px';
		this.tooltip.style.display = 'none';
		this.tooltip.style.whiteSpace = 'pre';
		this.tooltip.style.zIndex = '1001';
		document.body.appendChild(this.tooltip);
	};

	drawToolbar() {
		this.ctx.fillStyle = '#333';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.isMobile ? this.drawToolbarVertical() : this.drawToolbarHorizontal();
	};

	drawToolbarVertical() {
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

	drawToolbarHorizontal() {
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
	};

	addEventListeners() {
		this.canvas.addEventListener('mousemove', (e) => {
			let cursor = 'default';
			let foundButton = null;
			this.buttons.forEach(button => {
				if (this.isInside(e.clientX, e.clientY, button)) { cursor = 'pointer'; foundButton = button; }
			});
			if (this.isInside(e.clientX, e.clientY, this.homeButtonRect)) {
				cursor = 'pointer'; foundButton = { name: 'Home', description: 'Return to the home menu.' };
			}
			this.canvas.style.cursor = cursor;
			if (this.tooltipToolbar && foundButton) {
				this.tooltip.innerHTML = `${foundButton.name}\n\n${foundButton.description}`;
				this.tooltip.style.left = `${e.clientX + 10}px`;
				this.tooltip.style.top = `${e.clientY + 10}px`;
				this.tooltip.style.display = 'block';
			} else { this.tooltip.style.display = 'none'; }
		});
		this.canvas.addEventListener('mouseleave', () => { this.tooltip.style.display = 'none'; });
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
		if (this.is3DPopupOpen) return;
		if (this.popupOpen) {
			const cubePopup = document.getElementById('cubePopup');
			const gridPopup = document.getElementById('gridPopup');
			const solvePopup = document.getElementById('solvePopup');
			const tutorialPopup = document.getElementById('tutorialPopup');
			if ((cubePopup && !cubePopup.contains(e.target) && !this.canvas.contains(e.target) && !e.target.classList.contains('popup-input') && !e.target.classList.contains('popup-button')) ||
				(gridPopup && !gridPopup.contains(e.target) && !this.canvas.contains(e.target)) ||
				(solvePopup && !solvePopup.contains(e.target) && !this.canvas.contains(e.target)) ||
				(tutorialPopup && !tutorialPopup.contains(e.target) && !this.canvas.contains(e.target))) {
				this.closeCurrentPopup();
				this.tooltip.style.display = 'none';
			}
		}
	};

	resizeToolbar() {
		this.updateToolbarLayout();
		this.canvas.width = this.isMobile ? window.innerWidth : 50;
		this.canvas.height = this.isMobile ? 50 : window.innerHeight;
		this.drawToolbar(); 
		this.addHomeButton(); 
		this.addEventListeners();
	};

	updateToolbarLayout() {
		const wasMobile = this.isMobile; 
		this.isMobile = this.checkIfMobile();
		if (wasMobile !== this.isMobile) { 
			this.removeCanvas(); 
			this.setupCanvas(); 
			this.drawToolbar(); 
			this.addHomeButton(); 
			this.addEventListeners(); 
		}
	};

	removeCanvas() {
		if (this.canvas && this.canvas.parentNode) {
			this.canvas.parentNode.removeChild(this.canvas);
		}
	};

	isInside(x, y, rect) {
		return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
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

	togglePopup(type) {
		if (type !== 'popup3d' && (this.currentPopup === type || this.is3DPopupOpen)) { this.closePopup(type); }
		else {
			this.closeCurrentPopup();
			this.showPopup(type);
			this.currentPopup = type;
		}
	};

	showPopup(type) {
		this.popupOpen = true;
		switch (type) {
			case 'cube': createCubePopup(this); break;
			case 'grid': showGridPopup(this); break;
			case 'solve': showSolvePopup(this); break;
			case 'tutorial': showTutorialPopup(this); break;
			case 'popup3d': break;
		}
	};

	createPopupContainer(id, title) {
		const popupContainer = document.createElement('div');
		popupContainer.id = id;
		popupContainer.style.position = 'absolute';
		popupContainer.style.top = this.isMobile ? '50px' : '0';
		popupContainer.style.left = this.isMobile ? '50%' : '238px';
		popupContainer.style.transform = 'translateX(-50%)';
		popupContainer.style.width = '370px';
		popupContainer.style.height = '100%';
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
		titleElement.style.top = '-10px';
		titleElement.style.left = '50%';
		titleElement.style.transform = 'translateX(-50%)';
		titleElement.style.zIndex = '1001';
		titleElement.style.fontSize = '22px';
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
		closeIcon.style.top = this.isMobile ? '56px' : '10px';
		closeIcon.style.left = this.isMobile ? 'calc(50% + 162px)' : '400px';
		Object.assign(closeIcon.style, { cursor: 'pointer', zIndex: '1001', transform: 'translateX(-50%)' });
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

	closeCurrentPopup() { 
		if (this.currentPopup) { this.closePopup(this.currentPopup); } 
	};
};
