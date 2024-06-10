import { GUI } from './libs/dat.gui.module.js';

export class GUIController {
	constructor(mainApp) {
		this.mainApp = mainApp;
		this.settings = {
			gridSize: mainApp.gridSize,
			backgroundColor: '#c3c3c3',
			polyominoesColor: mainApp.selectedPolyomino ? mainApp.selectedPolyomino.color : '#0000ff',
			tooltipPolyomino: false,
			tooltipToolbar: true
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
		this.gui.add(this.settings, 'gridSize', 10, 100).step(1).onChange((value) => {
			this.mainApp.updateGridSize(value);
		});
		this.gui.addColor(this.settings, 'backgroundColor').onChange((value) => {
			this.mainApp.canvas.style.backgroundColor = value;
		});
		this.gui.addColor(this.settings, 'polyominoesColor').onChange((value) => {
			if (this.mainApp.selectedPolyomino) {
				this.mainApp.selectedPolyomino.color = value;
				this.mainApp.redraw();
			}
		});
		this.gui.add(this.settings, 'tooltipPolyomino').onChange((value) => {
			this.mainApp.tooltipPolyomino = value;
		});
		this.gui.add(this.settings, 'tooltipToolbar').onChange((value) => {
			this.mainApp.toolbar.tooltipToolbar = value;
		});
	};

	checkWindowSize() {
		this.gui.domElement.style.display = window.innerWidth <= 800 ? 'none' : 'block';
	};
};
