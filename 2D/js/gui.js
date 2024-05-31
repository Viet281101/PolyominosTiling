import { GUI } from './libs/dat.gui.module.js';

export class GUIController {
	constructor(mainApp) {
		this.mainApp = mainApp;
		this.settings = {
			gridSize: mainApp.gridSize,
			backgroundColor: '#c3c3c3',
			iconSize: mainApp.icons.flip.width / 2,
			selectedColor: mainApp.selectedPolyomino ? mainApp.selectedPolyomino.color : '#0000ff'
		};
		this.init();
		this.checkWindowSize();
	};

	init() {
		this.gui = new GUI();
		this.gui.addColor(this.settings, 'backgroundColor').onChange((value) => {
			document.body.style.backgroundColor = value;
		});
		this.gui.addColor(this.settings, 'selectedColor').onChange((value) => {
			if (this.mainApp.selectedPolyomino) {
				this.mainApp.selectedPolyomino.color = value;
				this.mainApp.redraw();
			}
		});
	};

	checkWindowSize() {
		this.gui.domElement.style.display = window.innerWidth < 768 ? 'none' : 'block';
	};
};
