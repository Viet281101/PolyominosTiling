import { GUI } from './libs/dat.gui.module.js';

export class GUIController {
	constructor(mainApp) {
		this.mainApp = mainApp;
		this.settings = {
			backgroundColor: '#c3c3c3',
			selectedColor: '#0000ff',
		};
		this.init();
		this.checkWindowSize();
	};

	init() {
		this.gui = new GUI();
		const guiContainer = document.querySelector('.dg');
		if (guiContainer) {
			guiContainer.classList.add('scaled-gui');
			guiContainer.style.zIndex = '1000 !important';
			guiContainer.style.right = '-22px';
			guiContainer.style.transformOrigin = 'top right';
			guiContainer.style.transform = 'scale(1.5)';
		}

		this.gui.addColor(this.settings, 'backgroundColor').onChange((value) => {
			this.mainApp.renderer.setClearColor(value);
		});
		this.gui.addColor(this.settings, 'selectedColor').onChange((value) => {
			this.settings.selectedColor = value;
		});
	};

	checkWindowSize() {
		this.gui.domElement.style.display = window.innerWidth <= 800 ? 'none' : 'block';
	};
};
