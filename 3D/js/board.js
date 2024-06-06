import * as THREE from 'three';

export class Board {
	constructor(scene, size = 10) {
		this.scene = scene;
		this.size = size;
		this.grid = new THREE.Group();

		const gridHelper = new THREE.GridHelper(size, size);
		this.grid.add(gridHelper);

		this.scene.add(this.grid);
	};

	addPolycube(polycube) {
		this.grid.add(polycube.mesh);
	};

	removePolycube(polycube) {
		this.grid.remove(polycube.mesh);
	};
};

