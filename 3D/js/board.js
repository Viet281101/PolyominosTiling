import * as THREE from 'three';

export class Board {
	constructor(scene, size = 10) {
		this.scene = scene;
		this.size = size;
		this.grid = new THREE.Group();
		this.innerGrid = new THREE.Group();
		this.showInnerGrid = false;

		this.createGridBox(size);

		this.scene.add(this.grid);
		if (this.showInnerGrid) {
			this.scene.add(this.innerGrid);
		}
	};

	createGridBox(size) {
		const gridMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
		const gridStep = 1;

		for (let i = -size / 2; i <= size / 2; i += gridStep) {
			this.addLine(gridMaterial, [i, -size / 2, -size / 2], [i, size / 2, -size / 2], this.grid);
			this.addLine(gridMaterial, [i, -size / 2, size / 2], [i, size / 2, size / 2], this.grid);
			this.addLine(gridMaterial, [i, -size / 2, -size / 2], [i, -size / 2, size / 2], this.grid);
			this.addLine(gridMaterial, [i, size / 2, -size / 2], [i, size / 2, size / 2], this.grid);

			this.addLine(gridMaterial, [-size / 2, i, -size / 2], [size / 2, i, -size / 2], this.grid);
			this.addLine(gridMaterial, [-size / 2, i, size / 2], [size / 2, i, size / 2], this.grid);
			this.addLine(gridMaterial, [-size / 2, i, -size / 2], [-size / 2, i, size / 2], this.grid);
			this.addLine(gridMaterial, [size / 2, i, -size / 2], [size / 2, i, size / 2], this.grid);

			this.addLine(gridMaterial, [-size / 2, -size / 2, i], [size / 2, -size / 2, i], this.grid);
			this.addLine(gridMaterial, [-size / 2, size / 2, i], [size / 2, size / 2, i], this.grid);
			this.addLine(gridMaterial, [-size / 2, -size / 2, i], [-size / 2, size / 2, i], this.grid);
			this.addLine(gridMaterial, [size / 2, -size / 2, i], [size / 2, size / 2, i], this.grid);
		}

		for (let x = -size / 2 + gridStep; x < size / 2; x += gridStep) {
			for (let y = -size / 2 + gridStep; y < size / 2; y += gridStep) {
				for (let z = -size / 2 + gridStep; z < size / 2; z += gridStep) {
					this.addLine(gridMaterial, [x, y, -size / 2], [x, y, size / 2], this.innerGrid);
					this.addLine(gridMaterial, [x, -size / 2, z], [x, size / 2, z], this.innerGrid);
					this.addLine(gridMaterial, [-size / 2, y, z], [size / 2, y, z], this.innerGrid);
				}
			}
		}
	};

	addLine(material, start, end, group) {
		const geometry = new THREE.BufferGeometry().setFromPoints([
			new THREE.Vector3(...start),
			new THREE.Vector3(...end),
		]);
		const line = new THREE.Line(geometry, material);
		group.add(line);
	};

	addPolycube(polycube) {
		this.grid.add(polycube.group);
	};

	removePolycube(polycube) {
		this.grid.remove(polycube.group);
	};

	toggleInnerGrid(show) {
		this.showInnerGrid = show;
		if (show) {
			this.scene.add(this.innerGrid);
		} else {
			this.scene.remove(this.innerGrid);
		}
	};
};
