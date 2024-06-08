import * as THREE from 'three';

export class Polycube {
	constructor(cubeData = { cubes: [[0, 0, 0]], color: 0xff0000 }) {
		this.cubeData = cubeData;
		this.group = new THREE.Group();

		this.createPolycube();
	};

	createPolycube() {
		const { cubes, color } = this.cubeData;

		cubes.forEach(coord => {
			const [x, y, z] = coord;

			const geometry = new THREE.BoxGeometry();
			const material = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.7 });
			const mesh = new THREE.Mesh(geometry, material);

			const wireframeGeometry = new THREE.EdgesGeometry(geometry);
			const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
			const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);

			mesh.position.set(x, y, z);
			wireframe.position.set(x, y, z);

			this.group.add(mesh);
			this.group.add(wireframe);
		});
	};
};
