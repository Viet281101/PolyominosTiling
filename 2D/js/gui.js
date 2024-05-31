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
	};

	init() {
		const gui = new GUI();
		// gui.hide();
		gui.add(this.settings, 'gridSize', 10, 100).onChange((value) => {
			this.mainApp.gridSize = value;
			this.mainApp.gridBoard.gridSize = value;
			this.mainApp.redraw();
		});
		gui.addColor(this.settings, 'backgroundColor').onChange((value) => {
			document.body.style.backgroundColor = value;
		});
		gui.addColor(this.settings, 'selectedColor').onChange((value) => {
			if (this.mainApp.selectedPolyomino) {
				this.mainApp.selectedPolyomino.color = value;
				this.mainApp.redraw();
			}
		});
	};
};
