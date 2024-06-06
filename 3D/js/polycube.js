import * as THREE from 'three';

export class Polycube {
	constructor(position = { x: 0, y: 0, z: 0 }, color = 0xff0000) {
		this.geometry = new THREE.BoxGeometry();
		this.material = new THREE.MeshBasicMaterial({ color: color });
		this.mesh = new THREE.Mesh(this.geometry, this.material);

		this.mesh.position.set(position.x, position.y, position.z);
	};
};
