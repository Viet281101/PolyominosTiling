import { GUI } from './libs/dat.gui.module.js';

export class GUIController {
	constructor(mainApp) {
		this.mainApp = mainApp;
		this.settings = {
			backgroundColor: '#999999',
			polycubeColor: '#0000ff',
			tooltipToolbar: true,
			showInnerGrid: false,
			showOuterGrid: true,
			polycubeVisible: true,
			allCubesVisible: true,
			polycubeOpacity: 0.7,
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
		this.gui.addColor(this.settings, 'polycubeColor').onChange((value) => {
			this.mainApp.updatePolycubeColor(value);
		});
		this.gui.add(this.settings, 'polycubeOpacity', 0, 1).onChange((value) => {
			this.mainApp.updatePolycubeOpacity(value);
		});
		this.gui.add(this.settings, 'tooltipToolbar').onChange((value) => {
			this.mainApp.toolbar.tooltipToolbar = value;
		});
		this.gui.add(this.settings, 'showInnerGrid').onChange((value) => {
			this.mainApp.board.toggleInnerGrid(value);
		});
		this.gui.add(this.settings, 'showOuterGrid').onChange((value) => {
			this.mainApp.board.toggleOuterGrid(value);
		});
		this.gui.add(this.settings, 'polycubeVisible').onChange((value) => {
			this.mainApp.toggleSelectedPolycubeVisibility(value);
		});
		this.gui.add(this.settings, 'allCubesVisible').onChange((value) => {
			this.mainApp.toggleAllCubesVisibility(value);
		});
	};

	checkWindowSize() {
		this.gui.domElement.style.display = window.innerWidth <= 800 ? 'none' : 'block';
	};
};

