import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Board } from './board.js';
import { GUIController } from './gui.js';
import { Toolbar } from './toolbar.js';
import { Polycube } from './polycube.js';

class MainApp {
	constructor() {
		this.selectedPolycube = null;
		this.isDragging = false;
		this.isRightClick = false;
		this.polys = [];
		this.init();
		this.animate();
		this.eventListener();
	};

	init() {
		Object.assign(document.body.style, { margin: '0', padding: '0', overflow: 'hidden' });
		this.scene = new THREE.Scene();

		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.camera.position.z = 15;

		this.renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('myCanvas') });
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setClearColor('#c3c3c3');

		this.controls = new OrbitControls(this.camera, this.renderer.domElement);

		this.board = new Board(this.scene, { x: 3, y: 3, z: 3 });
		this.guiController = new GUIController(this);
		this.toolbar = new Toolbar(this);

		this.addPolycube({ n: 1, cubes: [[0, 0, 0]], color: 0x00ff00, position: { x: 0, y: 3, z: 0 } });
		this.addPolycube({ n: 3, cubes: [[0, 0, 0], [0, 1, 0], [0, 0, 1]], color: 0xff0000, position: { x: 2, y: 2, z: 2 } });
	};

	eventListener() {
		window.addEventListener('resize', this.onWindowResize.bind(this), false);
		this.renderer.domElement.addEventListener('mousedown', this.onMouseDown.bind(this), false);
		this.renderer.domElement.addEventListener('mouseup', this.onMouseUp.bind(this), false);
		this.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this), false);
		this.renderer.domElement.addEventListener('contextmenu', (event) => { event.preventDefault(); }, false);
	};

	addPolycube(cubeData) {
		const polycube = new Polycube(cubeData);
		this.scene.add(polycube.group);
		this.polys.push(polycube);
	};

	onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	};

	animate() {
		requestAnimationFrame(this.animate.bind(this));
		this.renderer.render(this.scene, this.camera);
	};

	onMouseDown(event) {
		event.preventDefault();
		const mouse = new THREE.Vector2(
			(event.clientX / window.innerWidth) * 2 - 1,
			-(event.clientY / window.innerHeight) * 2 + 1
		);
		const raycaster = new THREE.Raycaster();
		raycaster.setFromCamera(mouse, this.camera);

		const intersects = raycaster.intersectObjects(this.polys.map(p => p.group.children).flat());

		if (intersects.length > 0) {
			const intersectedObject = intersects[0].object;

			const intersectedPolycube = this.polys.find(p => p.group.children.includes(intersectedObject));
			if (intersectedPolycube !== this.selectedPolycube) {
				this.deselectPolycube();
				this.selectPolycube(intersectedPolycube);
			}

			this.isDragging = true;
			this.controls.enabled = false;

			if (event.button === 2) { this.isRightClick = true; }

			this.lastMousePosition = { x: event.clientX, y: event.clientY };
			this.lastValidPosition = this.selectedPolycube.group.position.clone();
		} else {
			this.deselectPolycube();
			this.controls.enabled = true;
		}
	};

	onMouseMove(event) {
		if (!this.isDragging || !this.selectedPolycube) return;

		const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		if (this.isRightClick) {
			const deltaX = event.clientX - this.lastMousePosition.x;
			const deltaY = event.clientY - this.lastMousePosition.y;

			const moveVector = new THREE.Vector3(deltaX * 0.01, -deltaY * 0.01, 0);
			moveVector.applyQuaternion(this.camera.quaternion);
			this.selectedPolycube.group.position.add(moveVector);

			this.lastMousePosition = { x: event.clientX, y: event.clientY };
		} else {
			this.selectedPolycube.group.rotation.y += movementX * 0.01;
			this.selectedPolycube.group.rotation.x += movementY * 0.01;
		}
	};

	onMouseUp(event) {
		if (this.isRightClick) {
			if (this.snapToGrid(this.selectedPolycube)) {
				this.lastValidPosition = this.selectedPolycube.group.position.clone();
			} else {
				this.selectedPolycube.group.position.copy(this.lastValidPosition);
			}
		}
		this.isDragging = false;
		this.isRightClick = false;
		this.controls.enabled = true;
	};

	selectPolycube(polycube) {
		this.selectedPolycube = polycube;
		this.selectedPolycube.group.children.forEach(child => {
			if (child instanceof THREE.LineSegments) {
				child.material.color.set(0xffffff);
			}
		});
	};

	deselectPolycube() {
		if (this.selectedPolycube) {
			this.selectedPolycube.group.children.forEach(child => {
				if (child instanceof THREE.LineSegments) {
					child.material.color.set(0x000000);
				}
			});
			this.selectedPolycube = null;
		}
	};

	snapToGrid(polycube) {
		const gridSize = 1;
		const group = polycube.group;
		const size = this.board.size;

		const offsetX = (size.x % 2 === 0) ? gridSize / 2 : 0;
		const offsetY = (size.y % 2 === 0) ? gridSize / 2 : 0;
		const offsetZ = (size.z % 2 === 0) ? gridSize / 2 : 0;

		const newPosition = new THREE.Vector3(
			Math.round((group.position.x - offsetX) / gridSize) * gridSize + offsetX,
			Math.round((group.position.y - offsetY) / gridSize) * gridSize + offsetY,
			Math.round((group.position.z - offsetZ) / gridSize) * gridSize + offsetZ
		);

		const rotationMatrix = new THREE.Matrix4().makeRotationFromQuaternion(group.quaternion);
		const decomposed = {
			scale: new THREE.Vector3(),
			position: new THREE.Vector3(),
			rotation: new THREE.Quaternion(),
		};
		rotationMatrix.decompose(decomposed.position, decomposed.rotation, decomposed.scale);

		const euler = new THREE.Euler().setFromQuaternion(decomposed.rotation, 'XYZ');
		euler.x = Math.round(euler.x / (Math.PI / 2)) * (Math.PI / 2);
		euler.y = Math.round(euler.y / (Math.PI / 2)) * (Math.PI / 2);
		euler.z = Math.round(euler.z / (Math.PI / 2)) * (Math.PI / 2);

		group.setRotationFromEuler(euler);

		const newCubesPositions = polycube.cubeData.cubes.map(coord => {
			const [x, y, z] = coord;
			const position = new THREE.Vector3(x, y, z);
			position.applyEuler(group.rotation);
			position.add(newPosition);
			return position;
		});

		const overlapping = this.polys.some(otherPolycube => {
			if (otherPolycube === polycube) return false;
			return otherPolycube.cubeData.cubes.some(coord => {
				const [x, y, z] = coord;
				const position = new THREE.Vector3(x, y, z);
				position.applyEuler(otherPolycube.group.rotation);
				position.add(otherPolycube.group.position);
				return newCubesPositions.some(newPos => newPos.equals(position));
			});
		});

		if (overlapping) {
			return false;
		} else {
			group.position.copy(newPosition);
			return true;
		}
	};

	updatePolycubeColor(color) {
		if (this.selectedPolycube) {
			this.selectedPolycube.group.children.forEach(child => {
				if (child instanceof THREE.Mesh) {
					child.material.color.set(color);
				}
			});
		}
	};

	clearBoard() {
		this.board.clearGrid();
	};
};

const app = new MainApp();
