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
		this.init();
		this.animate();
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

		this.board = new Board(this.scene, 10);
		this.guiController = new GUIController(this);
		this.toolbar = new Toolbar(this);

		this.polys = [];
		this.addPolycube({ n: 1, cubes: [[0, 0, 0]], color: 0x00ff00, position: { x: 0, y: 3, z: 0 } });
		this.addPolycube({ n: 3, cubes: [[0, 0, 0], [0, 1, 0], [0, 0, 1]], color: 0xff0000, position: { x: 2, y: 2, z: 2 } });

		window.addEventListener('resize', this.onWindowResize.bind(this), false);
		this.renderer.domElement.addEventListener('mousedown', this.onMouseDown.bind(this), false);
		this.renderer.domElement.addEventListener('mouseup', this.onMouseUp.bind(this), false);
		this.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this), false);
		this.renderer.domElement.addEventListener('contextmenu', this.onContextMenu.bind(this), false);
	};

	addPolycube(cubeData) {
		const polycube = new Polycube(cubeData);
		this.board.addPolycube(polycube);
		this.polys.push(polycube);
	};

	onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	};

	updateGridSize(size) {
		this.board.grid.scale.set(size / 10, size / 10, size / 10);
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

			if (event.button === 2) {
				this.isRightClick = true;
			}

			this.lastMousePosition = { x: event.clientX, y: event.clientY };
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
			this.snapToGrid(this.selectedPolycube.group.position);
		}
		this.isDragging = false;
		this.isRightClick = false;
		this.controls.enabled = true;
	};

	onContextMenu(event) {
		event.preventDefault();
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

	snapToGrid(position) {
		const gridSize = 1;
		position.x = Math.round(position.x / gridSize) * gridSize;
		position.y = Math.round(position.y / gridSize) * gridSize;
		position.z = Math.round(position.z / gridSize) * gridSize;
	};
};

const app = new MainApp();
