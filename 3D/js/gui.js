import { GUI } from './libs/dat.gui.module.js';
import { Polycube } from './polycube.js';

export class GUIController {
	constructor(mainApp) {
		this.mainApp = mainApp;
		this.settings = {
			gridSize: 10,
			backgroundColor: '#c3c3c3',
			selectedColor: '#0000ff',
			addPolycube: () => {
				const polycube = new Polycube(
					{ x: Math.random() * 10 - 5, y: Math.random() * 10 - 5, z: Math.random() * 10 - 5 },
					this.settings.selectedColor
				);
				this.mainApp.board.addPolycube(polycube);
			},
			removePolycube: () => {
				if (this.mainApp.board.grid.children.length > 1) {
					this.mainApp.board.grid.remove(this.mainApp.board.grid.children[this.mainApp.board.grid.children.length - 1]);
				}
			}
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
			this.mainApp.renderer.setClearColor(value);
		});
		this.gui.addColor(this.settings, 'selectedColor').onChange((value) => {
			this.settings.selectedColor = value;
		});
		this.gui.add(this.settings, 'addPolycube');
		this.gui.add(this.settings, 'removePolycube');
	};

	checkWindowSize() {
		this.gui.domElement.style.display = window.innerWidth <= 800 ? 'none' : 'block';
	};
};
